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
  Globe2,
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
    { id: 'universities', label: 'Campuses', icon: Globe2 },
    { id: 'messages', label: 'Chat', icon: MessageSquareLock, badge: unreadMessagesCount },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'profile', label: 'Profile', icon: UserCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              isActive 
                ? 'text-sky-600 font-bold bg-sky-50/80 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-500'}`} />
              {item.badge ? (
                <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold px-1 rounded-full border border-white">
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
