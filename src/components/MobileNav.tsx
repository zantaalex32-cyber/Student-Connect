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
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, color: 'text-sky-600', activeBg: 'bg-sky-600 text-white' },
    { id: 'discover', label: 'Discover', icon: Compass, color: 'text-purple-600', activeBg: 'bg-purple-600 text-white' },
    { id: 'groups', label: 'Groups', icon: Users2, color: 'text-emerald-600', activeBg: 'bg-emerald-600 text-white' },
    { id: 'universities', label: 'Campuses', icon: Globe2, color: 'text-teal-600', activeBg: 'bg-teal-600 text-white' },
    { id: 'messages', label: 'Chat', icon: MessageSquareLock, color: 'text-rose-600', activeBg: 'bg-rose-600 text-white', badge: unreadMessagesCount },
    { id: 'events', label: 'Events', icon: CalendarDays, color: 'text-amber-600', activeBg: 'bg-amber-600 text-white' },
    { id: 'profile', label: 'Profile', icon: UserCheck, color: 'text-teal-600', activeBg: 'bg-teal-600 text-white' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-1 py-1.5 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
              isActive ? `${item.activeBg} font-bold shadow-xs` : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <div className="relative">
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
              {item.badge ? (
                <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold px-1 rounded-full border border-white">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
