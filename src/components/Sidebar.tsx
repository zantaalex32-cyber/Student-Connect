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
  Globe2,
  LogIn,
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
    firebaseUser,
    openAuthModal,
  } = useApp();

  const unreadMessagesCount = messages.filter(
    m => m.recipientId === currentUser.id && m.status !== 'read'
  ).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'discover', label: 'Discover Students', icon: Compass },
    { id: 'groups', label: 'Groups & Circles', icon: Users2 },
    { id: 'workspace', label: 'Team Workspace', icon: FolderKanban },
    { id: 'universities', label: 'Worldwide Campuses', icon: Globe2, badgeText: '100+' },
    { id: 'messages', label: 'Secure Messages', icon: MessageSquareLock, badge: unreadMessagesCount },
    { id: 'events', label: 'Events & Sessions', icon: CalendarDays },
    { id: 'profile', label: 'Profile & Privacy', icon: UserCheck },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 shrink-0 p-4 justify-between h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition border ${
                  isActive
                    ? 'bg-sky-50/90 text-sky-950 border-sky-200/80 font-bold shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                    isActive ? 'bg-white text-sky-600 shadow-2xs border border-sky-200/60' : 'bg-slate-100/80 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-600 text-white">
                    {item.badge}
                  </span>
                ) : item.badgeText ? (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {item.badgeText}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
            Quick Actions
          </p>
          <div className="space-y-2">
            <button
              onClick={() => setIsCreateGroupOpen(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>New Group or Team</span>
            </button>
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition shadow-2xs"
            >
              <PlusCircle className="w-4 h-4 text-slate-600" />
              <span>Schedule Session</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Firebase Authentication Session Card */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Firebase Auth
            </span>
            <span className={`w-2 h-2 rounded-full ${firebaseUser ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          </div>

          {firebaseUser ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-900 truncate">
                {firebaseUser.email}
              </p>
              <button
                onClick={() => openAuthModal('session')}
                className="w-full py-1.5 px-2 text-[11px] font-bold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition flex items-center justify-center gap-1 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Manage Session</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-[11px] text-slate-500 leading-tight">
                Sign in to sync your university profile and groups.
              </p>
              <button
                onClick={() => openAuthModal('login')}
                className="w-full py-1.5 px-2 text-[11px] font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-1 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
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
    </div>
  </aside>
  );
};
