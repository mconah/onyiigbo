import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import StatCard from '../components/dashboard/StatCard';
import AdminUserTable from '../components/dashboard/AdminUserTable';
import AdminJobTable from '../components/dashboard/AdminJobTable';
import AdminContentTable from '../components/dashboard/AdminContentTable';
import AdminNewsTable from '../components/dashboard/AdminNewsTable';
import ChatInterface from '../components/dashboard/ChatInterface';
import { User, ServiceRequest, Post, NewsPost } from '../data/mockData';
import VerificationModal from '../components/modals/VerificationModal';
import AssignJobModal from '../components/modals/AssignJobModal';
import CreatePostModal from '../components/modals/CreatePostModal';
import EditPostModal from '../components/modals/EditPostModal';
import CreateNewsPostModal from '../components/modals/CreateNewsPostModal';
import EditNewsPostModal from '../components/modals/EditNewsPostModal';
import { databases, dbId, usersCollectionId, serviceRequestsCollectionId, blogPostsCollectionId, newsPostsCollectionId, chatsCollectionId, messagesCollectionId } from "../lib/appwrite";
import { Query, ID, AppwriteException } from "appwrite";

interface AdminDashboardPageProps {
  user: User; // The admin user currently logged in
  onOpenChat: () => void; // NEW: Prop to open the chat panel (for potential future use, e.g., if admin can initiate chat)
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ user, onOpenChat }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [users, setUsers] = useState<User[]>([]);
    const [jobs, setJobs] = useState<ServiceRequest[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modals state
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [userToVerify, setUserToVerify] = useState<User | null>(null);

    const [isAssignJobModalOpen, setIsAssignJobModalOpen] = useState(false);
    const [jobToAssign, setJobToAssign] = useState<ServiceRequest | null>(null);

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
    const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
    const [postToEdit, setPostToEdit] = useState<Post | null>(null);

    const [isCreateNewsPostModalOpen, setIsCreateNewsPostModalOpen] = useState(false);
    const [isEditNewsPostModalOpen, setIsEditNewsPostModalOpen] = useState(false);
    const [newsPostToEdit, setNewsPostToEdit] = useState<NewsPost | null>(null);

    // --- Data Fetching ---
    const fetchAllData = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, jobsRes, postsRes, newsRes] = await Promise.all([
          databases.listDocuments(dbId, usersCollectionId, [Query.limit(100)]),
          databases.listDocuments(dbId, serviceRequestsCollectionId, [Query.limit(100)]),
          databases.listDocuments(dbId, blogPostsCollectionId, [Query.limit(100), Query.orderDesc('$createdAt')]),
          databases.listDocuments(dbId, newsPostsCollectionId, [Query.limit(100), Query.orderDesc('$createdAt')])
        ]);

        const fetchedUsers: User[] = usersRes.documents.map(doc => ({
          $id: doc.$id, appwrite_user_id: doc.appwrite_user_id, name: doc.name, email: doc.email, role: doc.role,
          interests: doc.interests, status: doc.status, joined: doc.joined, avatar: doc.avatar,
          bio: doc.bio || '', location: doc.location || '', specialty: doc.specialty || 'Beginner',
          availability: doc.availability || 'remote',
        }));
        const fetchedJobs: ServiceRequest[] = jobsRes.documents.map(doc => ({
            $id: doc.$id, service: doc.service_type, client_appwrite_id: doc.client_appwrite_id, clientName: doc.client_name,
            description: doc.description, date: new Date(doc.date_requested).toLocaleDateString(), status: doc.status,
            assigned_provider_appwrite_id: doc.assigned_provider_appwrite_id || null,
            budget: doc.budget || '', deadline: doc.deadline || '',
        }));
        const fetchedPosts: Post[] = postsRes.documents.map(doc => ({
            $id: doc.$id, title: doc.title, author: doc.author_name,
            date: new Date(doc.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            category: doc.category, excerpt: doc.excerpt, content: doc.content,
        }));
        const fetchedNews: NewsPost[] = newsRes.documents.map(doc => ({
            $id: doc.$id, title: doc.title, author: doc.author_name,
            date: new Date(doc.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            category: doc.category, excerpt: doc.excerpt, content: doc.content, image: doc.image,
        }));

        setUsers(fetchedUsers);
        setJobs(fetchedJobs);
        setPosts(fetchedPosts);
        setNewsPosts(fetchedNews);

      } catch (err) {
        console.error('Failed to fetch admin data:', err);
        if (err instanceof AppwriteException) {
            setError(err.message);
        } else {
            setError('Failed to load admin data.');
        }
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchAllData();
    }, [fetchAllData]);

    // --- Handlers for Users ---
    const handleVerifyUser = useCallback(async (userId: string) => {
        try {
            await databases.updateDocument(dbId, usersCollectionId, userId, { status: 'Verified' });
            fetchAllData(); // Re-fetch all data to update UI
            setIsVerificationModalOpen(false);
            setUserToVerify(null);
        } catch (error) {
            console.error('Error verifying user:', error);
            alert('Failed to verify user.');
        }
    }, [fetchAllData]);

    const handleUserStatusChange = useCallback(async (userId: string, newStatus: User['status']) => {
        try {
            await databases.updateDocument(dbId, usersCollectionId, userId, { status: newStatus });
            fetchAllData(); // Re-fetch all data
        } catch (error) {
            console.error('Error changing user status:', error);
            alert('Failed to update user status.');
        }
    }, [fetchAllData]);

    const handleOpenVerificationModal = (user: User) => {
      setUserToVerify(user);
      setIsVerificationModalOpen(true);
    };
    
    // --- Handlers for Jobs ---
    const handleAssignJob = useCallback(async (jobId: string, providerAppwriteId: string) => {
        try {
            await databases.updateDocument(dbId, serviceRequestsCollectionId, jobId, {
                assigned_provider_appwrite_id: providerAppwriteId,
                status: 'In Progress'
            });

            fetchAllData(); // Re-fetch all data
            setIsAssignJobModalOpen(false);
            setJobToAssign(null);
        } catch (error) {
            console.error('Error assigning job:', error);
            alert('Failed to assign job.');
        }
    }, [fetchAllData]);

    const handleJobStatusChange = useCallback(async (jobId: string, newStatus: ServiceRequest['status']) => {
        try {
            await databases.updateDocument(dbId, serviceRequestsCollectionId, jobId, { status: newStatus });
            fetchAllData(); // Re-fetch all data
        } catch (error) {
            console.error('Error changing job status:', error);
            alert('Failed to update job status.');
        }
    }, [fetchAllData]);

    const handleOpenAssignJobModal = (job: ServiceRequest) => {
      setJobToAssign(job);
      setIsAssignJobModalOpen(true);
    };

    // --- Handlers for Igbo Log Content ---
    const handleCreatePost = useCallback(async (newPost: Omit<Post, '$id'>) => {
        try {
            await databases.createDocument(
                dbId,
                blogPostsCollectionId,
                ID.unique(),
                {
                    title: newPost.title,
                    author_name: newPost.author,
                    author_appwrite_id: user.appwrite_user_id, // NEW: Add author's appwrite ID
                    date_published: new Date().toISOString().split('T')[0],
                    category: newPost.category,
                    excerpt: newPost.excerpt,
                    content: newPost.content, // Lexical JSON string
                }
            );
            fetchAllData(); // Re-fetch all data
            setIsCreatePostModalOpen(false);
        } catch (error) {
            console.error('Error creating blog post:', error);
            alert('Failed to create blog post.');
        }
    }, [fetchAllData, user.appwrite_user_id]);

    const handleUpdatePost = useCallback(async (updatedPost: Post) => {
        try {
            await databases.updateDocument(
                dbId,
                blogPostsCollectionId,
                updatedPost.$id,
                {
                    title: updatedPost.title,
                    author_name: updatedPost.author,
                    category: updatedPost.category,
                    excerpt: updatedPost.excerpt,
                    content: updatedPost.content, // Lexical JSON string
                }
            );
            fetchAllData(); // Re-fetch all data
            setIsEditPostModalOpen(false);
            setPostToEdit(null);
        } catch (error) {
            console.error('Error updating blog post:', error);
            alert('Failed to update blog post.');
        }
    }, [fetchAllData]);

    const handleDeletePost = useCallback(async (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await databases.deleteDocument(dbId, blogPostsCollectionId, postId);
                fetchAllData(); // Re-fetch all data
            } catch (error) {
                console.error('Error deleting blog post:', error);
                alert('Failed to delete blog post.');
            }
        }
    }, [fetchAllData]);

    const handleOpenEditPostModal = (post: Post) => {
      setPostToEdit(post);
      setIsEditPostModalOpen(true);
    };

    // --- Handlers for News Content ---
    const handleCreateNewsPost = useCallback(async (newNewsPost: Omit<NewsPost, '$id'>) => {
        try {
            await databases.createDocument(
                dbId,
                newsPostsCollectionId,
                ID.unique(),
                {
                    title: newNewsPost.title,
                    author_name: newNewsPost.author,
                    author_appwrite_id: user.appwrite_user_id, // NEW: Add author's appwrite ID
                    date_published: new Date().toISOString().split('T')[0],
                    category: newNewsPost.category,
                    excerpt: newNewsPost.excerpt,
                    content: newNewsPost.content, // Lexical JSON string
                    image: newNewsPost.image,
                }
            );
            fetchAllData(); // Re-fetch all data
            setIsCreateNewsPostModalOpen(false);
        } catch (error) {
            console.error('Error creating news post:', error);
            alert('Failed to create news post.');
        }
    }, [fetchAllData, user.appwrite_user_id]);

    const handleUpdateNewsPost = useCallback(async (updatedNewsPost: NewsPost) => {
        try {
            await databases.updateDocument(
                dbId,
                newsPostsCollectionId,
                updatedNewsPost.$id,
                {
                    title: updatedNewsPost.title,
                    author_name: updatedNewsPost.author,
                    category: updatedNewsPost.category,
                    excerpt: updatedNewsPost.excerpt,
                    content: updatedNewsPost.content, // Lexical JSON string
                    image: updatedNewsPost.image,
                }
            );
            fetchAllData(); // Re-fetch all data
            setIsEditNewsPostModalOpen(false);
            setNewsPostToEdit(null);
        } catch (error) {
            console.error('Error updating news post:', error);
            alert('Failed to update news post.');
        }
    }, [fetchAllData]);


    const handleDeleteNewsPost = useCallback(async (newsPostId: string) => {
        if (window.confirm('Are you sure you want to delete this news post?')) {
            try {
                await databases.deleteDocument(dbId, newsPostsCollectionId, newsPostId);
                fetchAllData(); // Re-fetch all data
            } catch (error) {
                console.error('Error deleting news post:', error);
                alert('Failed to delete news post.');
            }
        }
    }, [fetchAllData]);

    const handleOpenEditNewsPostModal = (newsPost: NewsPost) => {
      setNewsPostToEdit(newsPost);
      setIsEditNewsPostModalOpen(true);
    };


    const renderContent = () => {
    if (loading) {
        return <div className="text-center py-10 text-primary-text">Loading admin data...</div>;
    }
    if (error) {
        return <div className="text-center py-10 text-error">{error}</div>;
    }

    switch(activeTab) {
      case 'Overview':
        const totalUsers = users.length;
        const activeJobs = jobs.filter(job => job.status === 'In Progress' || job.status === 'Pending').length;
        const verifiedTutors = users.filter(u => (u.role === 'Tutor' || u.role === 'Service Provider') && u.status === 'Verified').length;
        const pendingVerifications = users.filter(u => u.status === 'Pending Verification').length;

        return (
          <div>
            <h2 className="text-3xl font-bold text-primary-text mb-6">Admin Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users" value={totalUsers} />
              <StatCard title="Active Jobs" value={activeJobs} />
              <StatCard title="Verified Tutors" value={verifiedTutors} />
              <StatCard title="Pending Verifications" value={pendingVerifications} variant="warning" />
            </div>
          </div>
        );
      case 'Users':
        return <AdminUserTable users={users} onVerify={handleOpenVerificationModal} onUserStatusChange={handleUserStatusChange} />;
      case 'Jobs':
        const availableProviders = users.filter(u => (u.role === 'Tutor' || u.role === 'Service Provider') && u.status === 'Verified');
        return <AdminJobTable jobs={jobs} users={availableProviders} onAssign={handleOpenAssignJobModal} onStatusChange={handleJobStatusChange} />;
      case 'Content':
          return <AdminContentTable posts={posts} onCreatePost={() => setIsCreatePostModalOpen(true)} onEditPost={handleOpenEditPostModal} onDeletePost={handleDeletePost} />;
      case 'News':
          return <AdminNewsTable newsPosts={newsPosts} onCreateNewsPost={() => setIsCreateNewsPostModalOpen(true)} onEditNewsPost={handleOpenEditNewsPostModal} onDeleteNewsPost={handleDeleteNewsPost} />;
      case 'Messages':
          return <ChatInterface user={user} chatsCollectionId={chatsCollectionId} messagesCollectionId={messagesCollectionId} />;
      default:
        return <div className="text-secondary-text">Select a tab</div>;
    }
  }

    return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isAdmin={true}
          />
          <main className="flex-1 bg-light-lavender/50 p-8 rounded-lg">
            {renderContent()}
          </main>
        </div>
      </div>
      {isVerificationModalOpen && userToVerify && (
        <VerificationModal
          user={userToVerify}
          onConfirm={() => handleVerifyUser(userToVerify.$id)}
          onClose={() => setIsVerificationModalOpen(false)}
        />
      )}
      {isAssignJobModalOpen && jobToAssign && (
        <AssignJobModal
          job={jobToAssign}
          providers={users.filter(u => (u.role === 'Tutor' || u.role === 'Service Provider') && u.status === 'Verified')}
          onAssign={handleAssignJob}
          onClose={() => setIsAssignJobModalOpen(false)}
        />
      )}
      {isCreatePostModalOpen && (
        <CreatePostModal
          onCreatePost={handleCreatePost}
          onClose={() => setIsCreatePostModalOpen(false)}
        />
      )}
      {isEditPostModalOpen && postToEdit && (
        <EditPostModal
          post={postToEdit}
          onUpdatePost={handleUpdatePost}
          onClose={() => setIsEditPostModalOpen(false)}
        />
      )}
      {isCreateNewsPostModalOpen && (
        <CreateNewsPostModal
          onCreateNewsPost={handleCreateNewsPost}
          onClose={() => setIsCreateNewsPostModalOpen(false)}
        />
      )}
      {isEditNewsPostModalOpen && newsPostToEdit && (
        <EditNewsPostModal
          newsPost={newsPostToEdit}
          onUpdateNewsPost={handleUpdateNewsPost}
          onClose={() => setIsEditNewsPostModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;