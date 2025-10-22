import React, { useState, useEffect, useCallback } from 'react';
import { Route } from '../App';
import Sidebar from '../components/dashboard/Sidebar';
import SettingsPanel from '../components/dashboard/SettingsPanel';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import TutorDashboard from '../components/dashboard/TutorDashboard';
import ChatInterface from '../components/dashboard/ChatInterface';
import StatCard from '../components/dashboard/StatCard';
import { User, ServiceRequest } from '../data/mockData';
import { databases, dbId, serviceRequestsCollectionId, chatsCollectionId, messagesCollectionId } from '../lib/appwrite';
import { Query } from 'appwrite';

interface DashboardPageProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  navigate: (route: Route) => void;
  onOpenChat: () => void; // NEW: Prop to open the chat panel
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, setUser, navigate, onOpenChat }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [clientRequests, setClientRequests] = useState<ServiceRequest[]>([]);
  const [tutorRequests, setTutorRequests] = useState<ServiceRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState<string | null>(null);

  const hasClientInterests = user.interests.includes('Request a Language Service') || user.interests.includes('Find a Tutor');
  const hasProviderInterests = user.interests.includes('Become a Tutor') || user.interests.includes('Become a Service Provider');

  const fetchServiceRequests = useCallback(async () => {
    setLoadingRequests(true);
    setErrorRequests(null);
    try {
      // Fetch requests made by this user (client)
      const clientResponse = await databases.listDocuments(
        dbId,
        serviceRequestsCollectionId,
        [Query.equal('client_appwrite_id', user.appwrite_user_id), Query.limit(100)]
      );
      const fetchedClientRequests: ServiceRequest[] = clientResponse.documents.map(doc => ({
        $id: doc.$id,
        service: doc.service_type,
        client_appwrite_id: doc.client_appwrite_id,
        clientName: doc.client_name,
        description: doc.description,
        date: new Date(doc.date_requested).toLocaleDateString(),
        status: doc.status,
        assigned_provider_appwrite_id: doc.assigned_provider_appwrite_id || null,
        budget: doc.budget || '',
        deadline: doc.deadline || '',
      }));
      setClientRequests(fetchedClientRequests);

      // Fetch requests assigned to this user (tutor/provider)
      if (hasProviderInterests) {
        const tutorResponse = await databases.listDocuments(
          dbId,
          serviceRequestsCollectionId,
          [Query.equal('assigned_provider_appwrite_id', user.appwrite_user_id), Query.limit(100)]
        );
        const fetchedTutorRequests: ServiceRequest[] = tutorResponse.documents.map(doc => ({
          $id: doc.$id,
          service: doc.service_type,
          client_appwrite_id: doc.client_appwrite_id,
          clientName: doc.client_name,
          description: doc.description,
          date: new Date(doc.date_requested).toLocaleDateString(),
          status: doc.status,
          assigned_provider_appwrite_id: doc.assigned_provider_appwrite_id || null,
          budget: doc.budget || '',
          deadline: doc.deadline || '',
        }));
        setTutorRequests(fetchedTutorRequests);
      } else {
          setTutorRequests([]);
      }

    } catch (err) {
      console.error('Failed to fetch service requests:', err);
      setErrorRequests('Failed to load dashboard data.');
    } finally {
      setLoadingRequests(false);
    }
  }, [user.appwrite_user_id, hasProviderInterests]);

  useEffect(() => {
    fetchServiceRequests();
  }, [fetchServiceRequests]);

  const handleUpdateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, [setUser]);

  const handleServiceRequestStatusChange = useCallback(async (requestId: string, newStatus: ServiceRequest['status']) => {
    try {
        await databases.updateDocument(dbId, serviceRequestsCollectionId, requestId, { status: newStatus });
        fetchServiceRequests(); // Re-fetch to update local state
    } catch (error) {
        console.error('Error updating service request status:', error);
        setErrorRequests('Failed to update request status.');
    }
  }, [fetchServiceRequests]);


  const renderContent = () => {
    if (loadingRequests) {
        return <div className="text-center py-10 text-primary-text">Loading dashboard data...</div>;
    }
    if (errorRequests) {
        return <div className="text-center py-10 text-error">{errorRequests}</div>;
    }

    switch(activeTab) {
      case 'Overview':
        const pendingClientRequests = clientRequests.filter(req => req.status === 'Pending').length;
        const inProgressClientRequests = clientRequests.filter(req => req.status === 'In Progress').length;
        const pendingTutorRequests = tutorRequests.filter(req => req.status === 'Pending').length;
        const activeTutorAssignments = tutorRequests.filter(req => req.status === 'In Progress').length;

        return (
          <div>
            <h2 className="text-3xl font-bold text-primary-text mb-6">Welcome back, {user.name.split(' ')[0]}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasClientInterests && (
                <>
                  <StatCard title="My Pending Requests" value={pendingClientRequests} description="Awaiting vendor assignment" />
                  <StatCard title="My In Progress Jobs" value={inProgressClientRequests} description="Currently being handled" />
                </>
              )}
              {hasProviderInterests && (
                <>
                  <StatCard title="New Assignment Offers" value={pendingTutorRequests} description="Awaiting your confirmation" variant="warning" />
                  <StatCard title="My Active Assignments" value={activeTutorAssignments} description="Currently working on" />
                </>
              )}
              <StatCard 
                title="Account Status" 
                value={user.status} 
                description="Ready to engage with services" 
                variant={user.status === 'Verified' || user.status === 'Active' ? 'success' : 'warning'} 
              />
            </div>
          </div>
        );
      case 'Client Hub':
        return hasClientInterests ? <ClientDashboard 
                                        clientRequests={clientRequests} 
                                        onNavigate={navigate} 
                                        onStatusChange={handleServiceRequestStatusChange}
                                        onOpenChat={onOpenChat} // NEW: Pass onOpenChat
                                    /> : <div className="text-secondary-text">Select client interests in Settings to see this page.</div>;
      case 'Tutor Hub':
        return hasProviderInterests ? <TutorDashboard 
                                        tutorRequests={tutorRequests} 
                                        onNavigateToSettings={() => setActiveTab('Settings')} 
                                        onStatusChange={handleServiceRequestStatusChange}
                                        onOpenChat={onOpenChat} // NEW: Pass onOpenChat
                                        /> : <div className="text-secondary-text">Select tutor/provider interests in Settings to see this page.</div>;
      case 'Messages':
        return <ChatInterface user={user} chatsCollectionId={chatsCollectionId} messagesCollectionId={messagesCollectionId} />;
      case 'Settings':
        return <SettingsPanel user={user} setUser={handleUpdateUser} />;
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
            hasClientInterests={hasClientInterests}
            hasProviderInterests={hasProviderInterests}
          />
          <main className="flex-1 bg-light-lavender/50 p-8 rounded-lg">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;