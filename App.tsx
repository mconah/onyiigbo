import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import TutorsPage from './pages/TutorsPage';
import IgboLogPage from './pages/IgboLogPage';
import AboutUsPage from './pages/AboutUsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TutorProfilePage from './pages/TutorProfilePage';
import BlogPostPage from './pages/BlogPostPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NewsPage from './pages/NewsPage';
import NewsPostPage from './pages/NewsPostPage';
import { User } from './data/mockData'; // User interface only
import { account, databases, usersCollectionId, dbId } from './lib/appwrite';
import { Models, Query } from 'appwrite';
import { ChatProvider } from './components/ChatProvider'; // NEW: ChatProvider
import ChatList from './components/ChatList'; // NEW: ChatList
import InitiateChatModal from './components/modals/InitiateChatModal'; // NEW: InitiateChatModal

export type Route =
  | { page: 'home' | 'services' | 'tutors' | 'igbo-log' | 'about' | 'help' | 'terms' | 'login' | 'signup' | 'dashboard' | 'admin' | 'news' }
  | { page: 'tutor-profile', id: string } 
  | { page: 'blog-post', id: string } 
  | { page: 'news-post', id: string }
  | { page: 'chat', chatId?: string }; // NEW: Chat route with optional chat ID

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>({ page: 'home' });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false); // NEW: State for chat panel visibility
  const [isInitiateChatModalOpen, setIsInitiateChatModalOpen] = useState(false); // NEW: State for initiate chat modal

  const fetchUserProfile = useCallback(async (appwriteUserId: string): Promise<User | null> => {
    try {
      const response = await databases.listDocuments(
        dbId,
        usersCollectionId,
        [
          Query.equal('appwrite_user_id', appwriteUserId),
          Query.limit(1)
        ]
      );
      if (response.documents.length > 0) {
        const doc = response.documents[0];
        return {
          $id: doc.$id,
          appwrite_user_id: doc.appwrite_user_id,
          name: doc.name,
          email: doc.email,
          role: doc.role,
          interests: doc.interests,
          status: doc.status,
          joined: doc.joined,
          bio: doc.bio || '',
          location: doc.location || '',
          specialty: doc.specialty || 'Beginner',
          avatar: doc.avatar || 'https://picsum.photos/seed/default/200',
          availability: doc.availability || 'remote',
        } as User;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const appwriteUser: Models.User<Models.Preferences> = await account.get();
        if (appwriteUser) {
          const profile = await fetchUserProfile(appwriteUser.$id);
          if (profile) {
            setUser(profile);
            // Redirect to dashboard/admin if already logged in
            if (profile.role === 'Admin') {
              setRoute({ page: 'admin' });
            } else {
              setRoute({ page: 'dashboard' });
            }
          } else {
            // User exists in Appwrite Auth but no profile document, force logout
            await account.deleteSession('current');
            setUser(null);
            setRoute({ page: 'login' });
          }
        }
      } catch (error) {
        // No active session, user is guest
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, [fetchUserProfile]);

  const navigate = useCallback((newRoute: Route) => {
    setRoute(newRoute);
    setIsChatPanelOpen(false); // Close chat panel on navigation
    setIsInitiateChatModalOpen(false); // Close initiate chat modal on navigation
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = useCallback(async (appwriteUserId: string) => {
    const loggedInUser = await fetchUserProfile(appwriteUserId);
    if (loggedInUser) {
      setUser(loggedInUser);
      if (loggedInUser.role === 'Admin') {
        navigate({ page: 'admin' });
      } else {
        navigate({ page: 'dashboard' });
      }
    } else {
      // Should not happen if profile is created on signup
      console.error('User profile not found after login.');
      await account.deleteSession('current');
      setUser(null);
      navigate({ page: 'login' });
    }
  }, [fetchUserProfile, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      navigate({ page: 'home' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [navigate]);
  
  // This helper is for components that only need to navigate to simple pages by string name
  const handleSimplePageNavigate = (page: 'home' | 'services' | 'tutors' | 'igbo-log' | 'about' | 'help' | 'terms' | 'login' | 'signup' | 'news') => {
    navigate({ page });
  }

  const handleOpenChatPanel = useCallback(() => {
    if (!user) {
      navigate({ page: 'login' });
      return;
    }
    setIsChatPanelOpen(prev => !prev);
  }, [user, navigate]);

  const handleOpenInitiateChatModal = useCallback(() => {
    if (!user) {
      navigate({ page: 'login' });
      return;
    }
    setIsInitiateChatModalOpen(true);
    setIsChatPanelOpen(false); // Close main chat panel if open
  }, [user, navigate]);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[50vh] text-primary-text text-xl font-bold">
          Loading...
        </div>
      );
    }

    switch (route.page) {
      case 'services':
        return <ServicesPage />;
      case 'tutors':
        return <TutorsPage onNavigate={navigate} />;
      case 'igbo-log':
        return <IgboLogPage onNavigate={navigate} />;
      case 'about':
        return <AboutUsPage />;
      case 'help':
        return <HelpCenterPage />;
      case 'terms':
        return <TermsOfServicePage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleSimplePageNavigate} />;
      case 'signup':
        return <SignupPage onLogin={handleLogin} onNavigate={handleSimplePageNavigate} />;
      case 'tutor-profile':
        return <TutorProfilePage tutorId={route.id} />;
      case 'blog-post':
        return <BlogPostPage postId={route.id} />;
      case 'news':
        return <NewsPage onNavigate={navigate} />;
      case 'news-post':
        return <NewsPostPage newsPostId={route.id} />;
      case 'dashboard':
        return user ? <DashboardPage user={user} setUser={setUser} navigate={navigate} onOpenChat={handleOpenChatPanel} /> : <LoginPage onLogin={handleLogin} onNavigate={handleSimplePageNavigate} />;
      case 'admin':
        return user?.role === 'Admin' ? <AdminDashboardPage user={user} onOpenChat={handleOpenChatPanel} /> : <div className="text-error text-center py-10">Access Denied: Not an Admin</div>;
      case 'chat':
        return user ? (
          <div className="container mx-auto px-6 py-10 h-[calc(100vh-160px)] flex flex-col">
            <h1 className="font-unica-one text-4xl font-bold text-primary-text mb-6">Messages</h1>
            <div className="flex-grow flex border border-soft-gray rounded-lg overflow-hidden bg-white shadow-lg">
              <ChatList activeChatId={route.chatId || null} onSelectChat={(chatId) => navigate({ page: 'chat', chatId })} onCloseChatPanel={() => navigate({ page: 'dashboard' })} onInitiateChat={handleOpenInitiateChatModal} />
            </div>
          </div>
        ) : <LoginPage onLogin={handleLogin} onNavigate={handleSimplePageNavigate} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="bg-light-lavender font-noto-sans text-secondary-text min-h-screen flex flex-col">
      <ChatProvider currentUser={user} onOpenChat={handleOpenChatPanel} navigate={navigate}> {/* NEW: ChatProvider */}
        <Header onNavigate={navigate} currentPage={route.page} user={user} onLogout={handleLogout} onOpenChatPanel={handleOpenChatPanel} onOpenInitiateChatModal={handleOpenInitiateChatModal} /> {/* NEW: Chat props */}
        <main className="flex-grow">
          {renderPage()}
        </main>
        <Footer onNavigate={navigate} />

        {/* NEW: Chat Panel Overlay */}
        {user && isChatPanelOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-40 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm flex flex-col h-full">
              <ChatList 
                activeChatId={route.page === 'chat' ? route.chatId || null : null} // Pass active chat ID if on chat route
                onSelectChat={(chatId) => navigate({ page: 'chat', chatId })}
                onCloseChatPanel={() => setIsChatPanelOpen(false)}
                onInitiateChat={handleOpenInitiateChatModal}
              />
            </div>
          </div>
        )}

        {/* NEW: Initiate Chat Modal */}
        {user && isInitiateChatModalOpen && (
          <InitiateChatModal
            currentUser={user}
            onClose={() => setIsInitiateChatModalOpen(false)}
            onChatCreated={(chatId) => {
              setIsInitiateChatModalOpen(false);
              navigate({ page: 'chat', chatId });
            }}
          />
        )}
      </ChatProvider>
    </div>
  );
};

export default App;