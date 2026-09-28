import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  Users2,
  FolderKanban,
  MessageSquareLock,
  CalendarDays,
  UserCheck,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, messages, currentUser } = useApp();

  const unreadMessagesCount = messages.filter(
    m => m.recipientId === currentUser.id && m.status !== 'read'
  ).length;

  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'groups', label: 'Groups', icon: Users2 },
    { id: 'workspace', label: 'Workspace', icon: FolderKanban },
    { id: 'messages', label: 'Chat', icon: MessageSquareLock, badge: unreadMessagesCount },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'profile', label: 'Profile', icon: UserCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 relative transition ${
              isActive ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge ? (
                <span className="absolute -top-1.5 -right-2 bg-sky-600 text-white text-[9px] font-bold px-1 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
