import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DashboardView } from './views/DashboardView';
import { DiscoverView } from './views/DiscoverView';
import { GroupsView } from './views/GroupsView';
import { WorkspaceView } from './views/WorkspaceView';
import { MessagesView } from './views/MessagesView';
import { EventsView } from './views/EventsView';
import { ProfileView } from './views/ProfileView';
import { UniversitiesView } from './views/UniversitiesView';

import { CreateGroupModal } from './components/CreateGroupModal';
import { CreateEventModal } from './components/CreateEventModal';
import { UploadResourceModal } from './components/UploadResourceModal';
import { WhatsAppSupportModal } from './components/WhatsAppSupportModal';
import { ReportModal } from './components/ReportModal';
import { WorldwideUniversitiesModal } from './components/WorldwideUniversitiesModal';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    isWhatsAppSupportOpen, 
    setIsWhatsAppSupportOpen,
    isWorldwideUniModalOpen,
    setIsWorldwideUniModalOpen,
  } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'discover':
        return <DiscoverView />;
      case 'groups':
        return <GroupsView />;
      case 'workspace':
        return <WorkspaceView />;
      case 'messages':
        return <MessagesView />;
      case 'events':
        return <EventsView />;
      case 'profile':
        return <ProfileView />;
      case 'universities':
        return <UniversitiesView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Navigation Bottom Bar */}
      <MobileNav />

      {/* Connectivity Status Indicator */}
      <OfflineIndicator />

      {/* Global Interactive Modals */}
      <CreateGroupModal />
      <CreateEventModal />
      <UploadResourceModal />
      <ReportModal />
      <WhatsAppSupportModal
        isOpen={isWhatsAppSupportOpen}
        onClose={() => setIsWhatsAppSupportOpen(false)}
      />
      <WorldwideUniversitiesModal
        isOpen={isWorldwideUniModalOpen}
        onClose={() => setIsWorldwideUniModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
