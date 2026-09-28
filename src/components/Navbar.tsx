import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { 
  Bell, 
  Search, 
  School, 
  Globe, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  ChevronDown, 
  UserCheck, 
  SlidersHorizontal,
  X,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    groups,
    events,
    switchUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    filterUniversityOnly,
    setFilterUniversityOnly,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    setIsWhatsAppSupportOpen,
    requestBrowserPushPermission,
    pushPermissionState,
    clearAllData,
    loadSampleData,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isCurrentlyEmpty = groups.length === 0 && events.length === 0;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Colorful Brand Stripes (Solid colors matching logo, strictly NO gradients) */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-sky-500" />
        <div className="flex-1 bg-emerald-500" />
        <div className="flex-1 bg-amber-400" />
        <div className="flex-1 bg-rose-500" />
        <div className="flex-1 bg-purple-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 hover:opacity-90 transition text-left"
          >
            <Logo size={36} showText={true} />
          </button>

          {/* Campus Filter Toggle (My University vs Cross-University) */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setFilterUniversityOnly(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                filterUniversityOnly
                  ? 'bg-sky-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School className={`w-3.5 h-3.5 ${filterUniversityOnly ? 'text-white' : 'text-sky-600'}`} />
              <span>{currentUser.university.split(' ')[0]} Campus</span>
            </button>
            <button
              onClick={() => setFilterUniversityOnly(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                !filterUniversityOnly
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${!filterUniversityOnly ? 'text-white' : 'text-slate-500'}`} />
              <span>Global Academic</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students, study groups, courses, skills, events..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Empty / Sample Data Switcher Pill */}
          {isCurrentlyEmpty ? (
            <button
              onClick={loadSampleData}
              title="Populate app with starter university groups and events"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Load Starter Data</span>
            </button>
          ) : (
            <button
              onClick={clearAllData}
              title="Reset all data to empty clean slate"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-rose-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Empty Slate</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallPrompt />

          {/* WhatsApp Campus Support Hotline */}
          <button
            onClick={() => setIsWhatsAppSupportOpen(true)}
            title="Campus Support Hotline on WhatsApp"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Support</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-slate-900">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {pushPermissionState !== 'granted' && (
                      <button
                        onClick={requestBrowserPushPermission}
                        className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold"
                      >
                        Enable Push
                      </button>
                    )}
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-slate-500 hover:text-slate-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer text-xs ${
                          !n.read ? 'bg-sky-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-semibold ${!n.read ? 'text-sky-950 font-bold' : 'text-slate-800'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">{n.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-300"
              />
              <span className="hidden sm:block text-xs font-semibold text-slate-800 text-left leading-tight">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-slate-900">
                <div className="px-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.course}</p>
                      <p className="text-[10px] text-sky-700 font-medium truncate">{currentUser.university}</p>
                    </div>
                  </div>
                </div>

                {/* Switch Demo Student Profile */}
                <div className="p-3 bg-slate-50 border-y border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Quick Switch Demo Student
                  </p>
                  <div className="space-y-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition ${
                          u.id === currentUser.id
                            ? 'bg-sky-100 text-sky-900 font-bold'
                            : 'hover:bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-md object-cover" />
                          <span className="truncate">{u.name} ({u.university.split(' ')[0]})</span>
                        </div>
                        {u.id === currentUser.id && <Check className="w-3.5 h-3.5 text-sky-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 px-2 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition"
                  >
                    View & Edit Student Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsWhatsAppSupportOpen(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg transition flex items-center justify-between"
                  >
                    <span>Campus Ambassador Support</span>
                    <span className="text-[10px] font-mono text-emerald-800">0114488963</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
