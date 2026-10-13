import React from 'react';
import { useApp } from '../context/AppContext';
import { WORLDWIDE_APPROVED_UNIVERSITIES } from '../data/universities';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FolderKanban, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  MessageSquareLock,
  ChevronRight,
  TrendingUp,
  FileText,
  UserPlus,
  Compass,
  Check,
  Globe2,
  School
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    users,
    groups,
    setCurrentGroup,
    events,
    resources,
    setActiveTab,
    setSelectedChatId,
    toggleRSVP,
    setIsCreateEventOpen,
    setIsCreateGroupOpen,
    filterUniversityOnly,
    setFilterUniversityOnly,
    requestConnection,
    getConnectionStatus,
    loadSampleData,
  } = useApp();

  // Filter upcoming events
  const upcomingEvents = events
    .slice()
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 3);

  // Recommendations: students with matching university, course, or interests (excluding current user)
  const recommendedStudents = users
    .filter(u => u.id !== currentUser.id)
    .map(u => {
      let score = 0;
      if (u.university === currentUser.university) score += 3;
      if (u.school === currentUser.school) score += 2;
      const sharedInterests = u.interests.filter(i => currentUser.interests.includes(i));
      score += sharedInterests.length * 2;
      return { user: u, score, sharedInterests };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // My active groups
  const myGroups = groups.filter(g => g.members.some(m => m.userId === currentUser.id));
  const isDashboardEmpty = myGroups.length === 0 && upcomingEvents.length === 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Personalized Welcome Banner (Colorful Solid Badges, NO GRADIENTS) */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs relative overflow-hidden">
        {/* Top Colorful Brand Stripes (Solid colors matching logo, strictly NO gradients) */}
        <div className="h-2 w-full flex">
          <div className="flex-1 bg-sky-500" />
          <div className="flex-1 bg-emerald-500" />
          <div className="flex-1 bg-amber-400" />
          <div className="flex-1 bg-rose-500" />
          <div className="flex-1 bg-purple-600" />
          <div className="flex-1 bg-indigo-600" />
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-sky-200 border-2 border-white"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs" title="Online" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Welcome, {currentUser.name.split(' ')[0]}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    Verified Campus Student
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 font-medium flex items-center gap-1.5 flex-wrap">
                  <span>{currentUser.course} &bull; {currentUser.yearOfStudy} at</span>
                  <span className="bg-sky-100 text-sky-900 font-bold px-2 py-0.5 rounded-md border border-sky-300">
                    {currentUser.university}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={() => setActiveTab('universities')}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition shadow-xs flex items-center gap-1.5"
                title="Browse worldwide approved universities"
              >
                <Globe2 className="w-4 h-4 text-white" />
                <span>Worldwide Campuses ({WORLDWIDE_APPROVED_UNIVERSITIES.length}+)</span>
              </button>
              <button
                onClick={() => setIsCreateEventOpen(true)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Session</span>
              </button>
              <button
                onClick={() => setIsCreateGroupOpen(true)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Create Circle</span>
              </button>
            </div>
          </div>

          {/* Colorful Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-sky-50 border-2 border-sky-300 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-sky-800 font-extrabold uppercase tracking-wider block">Workspaces</span>
                <span className="text-xl font-black text-sky-950 leading-tight">{myGroups.length}</span>
              </div>
            </div>
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider block">Sessions</span>
                <span className="text-xl font-black text-amber-950 leading-tight">{events.length}</span>
              </div>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider block">Resources</span>
                <span className="text-xl font-black text-emerald-950 leading-tight">{resources.length}</span>
              </div>
            </div>
            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-purple-800 font-extrabold uppercase tracking-wider block">Peers</span>
                <span className="text-xl font-black text-purple-950 leading-tight">{users.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fresh Account Welcoming Onboarding Cards (when empty) */}
      {isDashboardEmpty && (
        <div className="bg-white border-2 border-sky-300 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h2 className="text-base font-bold text-slate-900">Your Campus Collaboration Hub is Ready</h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                You haven&apos;t joined any groups or scheduled study sessions yet. Get started with these 3 steps:
              </p>
            </div>
            <button
              onClick={loadSampleData}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 transition shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-950" />
              <span>Load Starter University Demo Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Step 1: Create or join group */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs">
              <div className="bg-emerald-600 text-white p-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">1. Study Groups & Teams</span>
                <BookOpen className="w-4 h-4 text-emerald-100" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                  Create a dedicated workspace for exam revision, capstone projects, or social friend circles.
                </p>
                <button
                  onClick={() => setIsCreateGroupOpen(true)}
                  className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
                >
                  Create First Group
                </button>
              </div>
            </div>

            {/* Step 2: Discover Peers */}
            <div className="bg-sky-50 border-2 border-sky-300 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs">
              <div className="bg-sky-600 text-white p-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">2. Discover Study Partners</span>
                <Compass className="w-4 h-4 text-sky-100" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-sky-950 leading-relaxed font-medium">
                  Find students from {currentUser.university} or across universities matching your courses and skills.
                </p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="mt-4 w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
                >
                  Find Students
                </button>
              </div>
            </div>

            {/* Step 3: Schedule Session */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs">
              <div className="bg-amber-500 text-white p-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">3. Schedule a Session</span>
                <Calendar className="w-4 h-4 text-amber-100" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  Set up a library study pod session, workshop, or weekend board game night with RSVP and reminders.
                </p>
                <button
                  onClick={() => setIsCreateEventOpen(true)}
                  className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition shadow-xs"
                >
                  Schedule Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed: Upcoming Study Sessions & Workspaces */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Events / Study Sessions */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Upcoming Sessions & Meetups</h2>
              </div>
              <button
                onClick={() => setActiveTab('events')}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold inline-flex items-center gap-1"
              >
                <span>Full Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No scheduled sessions</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Plan an exam problem set review or project sprint meeting.</p>
                <button
                  onClick={() => setIsCreateEventOpen(true)}
                  className="mt-3 px-3 py-1.5 text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 rounded-lg transition"
                >
                  Schedule First Event
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((ev) => {
                  const eventDate = new Date(ev.dateTime);
                  const isGoing = ev.attendees.some(a => a.userId === currentUser.id && a.status === 'going');

                  const categoryColors: Record<string, { tile: string; badge: string; border: string }> = {
                    study_session: { tile: 'bg-sky-600 text-white', badge: 'bg-sky-100 text-sky-800', border: 'border-l-sky-500' },
                    workshop: { tile: 'bg-indigo-600 text-white', badge: 'bg-indigo-100 text-indigo-800', border: 'border-l-indigo-500' },
                    seminar: { tile: 'bg-purple-600 text-white', badge: 'bg-purple-100 text-purple-800', border: 'border-l-purple-500' },
                    project_meeting: { tile: 'bg-emerald-600 text-white', badge: 'bg-emerald-100 text-emerald-800', border: 'border-l-emerald-500' },
                    academic_event: { tile: 'bg-blue-600 text-white', badge: 'bg-blue-100 text-blue-800', border: 'border-l-blue-500' },
                    social_meetup: { tile: 'bg-amber-500 text-white', badge: 'bg-amber-100 text-amber-800', border: 'border-l-amber-500' },
                    hangout: { tile: 'bg-amber-500 text-white', badge: 'bg-amber-100 text-amber-800', border: 'border-l-amber-500' },
                    game_night: { tile: 'bg-rose-600 text-white', badge: 'bg-rose-100 text-rose-800', border: 'border-l-rose-500' },
                    sports: { tile: 'bg-teal-600 text-white', badge: 'bg-teal-100 text-teal-800', border: 'border-l-teal-500' },
                    trip: { tile: 'bg-orange-500 text-white', badge: 'bg-orange-100 text-orange-800', border: 'border-l-orange-500' },
                    birthday: { tile: 'bg-pink-600 text-white', badge: 'bg-pink-100 text-pink-800', border: 'border-l-pink-500' },
                  };

                  const theme = categoryColors[ev.category] || { tile: 'bg-slate-700 text-white', badge: 'bg-slate-100 text-slate-800', border: 'border-l-slate-400' };

                  return (
                    <div
                      key={ev.id}
                      className={`p-4 rounded-xl border-2 border-slate-200 hover:border-sky-300 transition bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 ${theme.border} shadow-xs`}
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Solid Colorful Date Square */}
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-xs ${theme.tile}`}>
                          <span className="text-[10px] font-black uppercase tracking-wider leading-none">
                            {eventDate.toLocaleDateString(undefined, { month: 'short' })}
                          </span>
                          <span className="text-base font-black leading-tight mt-0.5">
                            {eventDate.getDate()}
                          </span>
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${theme.badge}`}>
                              {ev.category.replace('_', ' ')}
                            </span>
                            {ev.groupName && (
                              <span className="text-[11px] font-medium text-slate-500 truncate">
                                {ev.groupName}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">{ev.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-sky-600" />
                              {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({ev.duration})
                            </span>
                            <span className="flex items-center gap-1 font-medium text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-amber-500" />
                              {ev.locationDetails}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleRSVP(ev.id, isGoing ? 'cant_go' : 'going')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                            isGoing
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                              : 'bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isGoing ? '✓ Attending' : 'RSVP Going'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Workspaces & Teams */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Your Groups & Workspaces</h2>
              </div>
              <button
                onClick={() => setActiveTab('groups')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1"
              >
                <span>Browse Groups</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myGroups.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <FolderKanban className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No active workspaces</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Join existing campus circles or start a new group.</p>
                <button
                  onClick={() => setIsCreateGroupOpen(true)}
                  className="mt-3 px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition"
                >
                  Create Group Workspace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myGroups.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      setCurrentGroup(g);
                      setActiveTab('workspace');
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 transition cursor-pointer bg-white group border-l-4"
                    style={{ borderLeftColor: g.solidBadgeColor }}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={g.avatar}
                        alt={g.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span
                          className="inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white mb-1"
                          style={{ backgroundColor: g.solidBadgeColor }}
                        >
                          {g.category.replace('_', ' ')}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-sky-600 transition">
                          {g.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{g.description}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                          <span>{g.members.length} members</span>
                          <span>&bull;</span>
                          <span>{g.university}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Smart Recommendations & Study Buddies */}
        <div className="space-y-6">
          {/* Recommended Study Peers */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Recommended Peers</h2>
              </div>
              <button
                onClick={() => setActiveTab('discover')}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold"
              >
                Find more
              </button>
            </div>

            <div className="space-y-3.5">
              {recommendedStudents.map(({ user, sharedInterests }) => {
                const connStatus = getConnectionStatus(user.id);

                return (
                  <div
                    key={user.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 bg-slate-50/50 transition border-l-4 border-l-purple-500"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{user.name}</h4>
                          {user.verified && <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium truncate">{user.course}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.university}</p>
                      </div>
                    </div>

                    {sharedInterests.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {sharedInterests.slice(0, 2).map((interest) => (
                          <span
                            key={interest}
                            className="text-[9px] bg-white border border-sky-200 text-sky-800 px-1.5 py-0.5 rounded font-bold"
                          >
                            #{interest}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedChatId(`dm-${user.id}`);
                          setActiveTab('messages');
                        }}
                        className="flex-1 py-1.5 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
                      >
                        Message
                      </button>

                      {connStatus === 'connected' ? (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Connected
                        </span>
                      ) : connStatus === 'pending_sent' ? (
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">Pending</span>
                      ) : (
                        <button
                          onClick={() => requestConnection(user.id)}
                          className="flex-1 py-1.5 text-center text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition shadow-xs"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Worldwide Approved Universities Directory Spotlight Card */}
          <div className="bg-white border-2 border-teal-300 rounded-2xl p-5 shadow-xs overflow-hidden relative">
            <div className="h-1.5 w-full -mt-5 -mx-5 mb-4 flex">
              <div className="flex-1 bg-teal-500" />
              <div className="flex-1 bg-sky-500" />
              <div className="flex-1 bg-amber-400" />
              <div className="flex-1 bg-emerald-500" />
              <div className="flex-1 bg-purple-600" />
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                    Worldwide Approved Campuses
                  </h3>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {WORLDWIDE_APPROVED_UNIVERSITIES.length}+ Higher Education Institutions
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded border border-emerald-300">
                Accredited
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Degree-granting universities across Europe, North America, Asia, Africa, Oceania, and Latin America with verified student access.
            </p>

            <div className="mt-3.5 flex flex-wrap gap-1.5">
              <span className="text-[10px] bg-sky-50 text-sky-800 font-bold px-2 py-0.5 rounded border border-sky-200">
                UK & Europe
              </span>
              <span className="text-[10px] bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200">
                North America
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">
                Asia & Mideast
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                Africa
              </span>
              <span className="text-[10px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded border border-teal-200">
                Oceania
              </span>
              <span className="text-[10px] bg-rose-50 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-200">
                Latin America
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 font-medium">
                Your campus: <strong className="text-slate-900">{currentUser.university.split(' ')[0]}</strong>
              </span>
              <button
                onClick={() => setActiveTab('universities')}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1"
              >
                <span>Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* End-to-End Encryption Security Card (Rich Solid Dark Slate with Sky accents) */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs border-2 border-sky-900">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <MessageSquareLock className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">Security Guarantee</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All direct student communications and private circle files are protected with 256-bit End-to-End Encryption.
            </p>
            <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-mono">Fingerprint:</span>
              <span className="font-mono text-sky-300 font-semibold truncate ml-2">
                {currentUser.e2eeFingerprint}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
