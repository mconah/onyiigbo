import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin?: boolean;
  hasClientInterests?: boolean;
  hasProviderInterests?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isAdmin = false, hasClientInterests, hasProviderInterests }) => {
  const baseClasses = "w-full text-left px-4 py-3 rounded-lg font-bold transition-colors duration-200";
  const activeClasses = "bg-accent-primary text-white";
  const inactiveClasses = "text-secondary-text hover:bg-accent-primary/10 hover:text-accent-primary";

  const userTabs = [
    { name: 'Overview', show: true },
    { name: 'Client Hub', show: hasClientInterests },
    { name: 'Tutor Hub', show: hasProviderInterests },
    { name: 'Settings', show: true },
  ];

  const adminTabs = [
    { name: 'Overview', show: true },
    { name: 'Users', show: true },
    { name: 'Jobs', show: true },
    { name: 'Content', show: true },
    { name: 'News', show: true }, // Added News tab
  ];
  
  const tabsToShow = (isAdmin ? adminTabs : userTabs).filter(tab => tab.show);

  return (
    <aside className="md:w-64 bg-white p-6 rounded-lg shadow-md self-start">
      <h2 className="font-unica-one text-2xl mb-6 text-primary-text">{isAdmin ? 'Admin Panel' : 'My Dashboard'}</h2>
      <nav className="space-y-2">
        {tabsToShow.map(tab => (
          <button 
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`${baseClasses} ${activeTab === tab.name ? activeClasses : inactiveClasses}`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;