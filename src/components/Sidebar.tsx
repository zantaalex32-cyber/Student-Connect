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
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  Download,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsCreateGroupOpen,
    setIsCreateEventOpen,
    messages,
    currentUser,
    setIsWhatsAppSupportOpen,
  } = useApp();

  const unreadMessagesCount = messages.filter(
    m => m.recipientId === currentUser.id && m.status !== 'read'
  ).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-sky-600', activeBg: 'bg-sky-50 text-sky-900 border-sky-300' },
    { id: 'discover', label: 'Discover Students', icon: Compass, color: 'text-purple-600', activeBg: 'bg-purple-50 text-purple-900 border-purple-300' },
    { id: 'groups', label: 'Groups & Circles', icon: Users2, color: 'text-emerald-600', activeBg: 'bg-emerald-50 text-emerald-900 border-emerald-300' },
    { id: 'workspace', label: 'Team Workspace', icon: FolderKanban, color: 'text-indigo-600', activeBg: 'bg-indigo-50 text-indigo-900 border-indigo-300' },
    { id: 'messages', label: 'Secure Messages', icon: MessageSquareLock, color: 'text-rose-600', activeBg: 'bg-rose-50 text-rose-900 border-rose-300', badge: unreadMessagesCount },
    { id: 'events', label: 'Events & Sessions', icon: CalendarDays, color: 'text-amber-600', activeBg: 'bg-amber-50 text-amber-900 border-amber-300' },
    { id: 'profile', label: 'Profile & Privacy', icon: UserCheck, color: 'text-teal-600', activeBg: 'bg-teal-50 text-teal-900 border-teal-300' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 p-4 justify-between h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition border ${
                  isActive
                    ? `${item.activeBg} font-bold shadow-xs`
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white shadow-xs' : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-slate-500'}`} />
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
            Quick Actions
          </p>
          <div className="space-y-2">
            <button
              onClick={() => setIsCreateGroupOpen(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>New Group or Team</span>
            </button>
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-sky-600" />
              <span>Schedule Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Support Info */}
      <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>Verified Student Space</span>
        </div>
        <p className="text-[11px] text-sky-900/80 leading-snug">
          End-to-End Encrypted messaging and university access controls.
        </p>
        <button
          onClick={() => setIsWhatsAppSupportOpen(true)}
          className="w-full text-left text-[11px] text-emerald-800 font-bold hover:underline flex items-center justify-between pt-1 border-t border-sky-200"
        >
          <span>Campus Helpdesk</span>
          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">0114488963</span>
        </button>
      </div>
    </aside>
  );
};
