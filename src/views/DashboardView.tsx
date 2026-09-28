import React from 'react';
import { useApp } from '../context/AppContext';
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
  Check
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
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        {/* Decorative solid color corner tag */}
        <div className="absolute top-0 right-0 w-24 h-2 bg-sky-500" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Welcome, {currentUser.name.split(' ')[0]}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  Verified Campus Student
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 font-medium">
                {currentUser.course} &bull; {currentUser.yearOfStudy} at <strong className="text-sky-900">{currentUser.university}</strong>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition shadow-xs flex items-center gap-1.5"
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
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5">
            <span className="text-[11px] text-sky-800 font-bold uppercase tracking-wider block">Active Workspaces</span>
            <span className="text-xl font-extrabold text-sky-950 mt-0.5 block">{myGroups.length}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
            <span className="text-[11px] text-amber-800 font-bold uppercase tracking-wider block">Upcoming Sessions</span>
            <span className="text-xl font-extrabold text-amber-950 mt-0.5 block">{events.length}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
            <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider block">Shared Resources</span>
            <span className="text-xl font-extrabold text-emerald-950 mt-0.5 block">{resources.length} files</span>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5">
            <span className="text-[11px] text-purple-800 font-bold uppercase tracking-wider block">Campus Peers</span>
            <span className="text-xl font-extrabold text-purple-950 mt-0.5 block">{users.length} students</span>
          </div>
        </div>
      </div>

      {/* Fresh Account Welcoming Onboarding Cards (when empty) */}
      {isDashboardEmpty && (
        <div className="bg-white border-2 border-sky-200 rounded-2xl p-6 shadow-xs">
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
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Load Starter University Demo Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Step 1: Create or join group */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4.5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-emerald-950">1. Study Groups & Teams</h3>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  Create a dedicated workspace for exam revision, capstone projects, or social friend circles.
                </p>
              </div>
              <button
                onClick={() => setIsCreateGroupOpen(true)}
                className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
              >
                Create First Group
              </button>
            </div>

            {/* Step 2: Discover Peers */}
            <div className="bg-sky-50 border border-sky-300 rounded-xl p-4.5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-sky-950">2. Discover Study Partners</h3>
                <p className="text-[11px] text-sky-800 mt-1 leading-relaxed">
                  Find students from {currentUser.university} or across universities matching your courses and skills.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('discover')}
                className="mt-4 w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
              >
                Find Students
              </button>
            </div>

            {/* Step 3: Schedule Session */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4.5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-amber-950">3. Schedule a Session</h3>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  Set up a library study pod session, workshop, or weekend board game night with RSVP and reminders.
                </p>
              </div>
              <button
                onClick={() => setIsCreateEventOpen(true)}
                className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
              >
                Schedule Session
              </button>
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

                  return (
                    <div
                      key={ev.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-sky-500"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                            {ev.category.replace('_', ' ')}
                          </span>
                          {ev.groupName && (
                            <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                              {ev.groupName}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">{ev.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-sky-600" />
                            {eventDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                            {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            {ev.locationDetails}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleRSVP(ev.id, isGoing ? 'cant_go' : 'going')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                            isGoing
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
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
                        className="flex-1 py-1.5 text-center text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition"
                      >
                        Message
                      </button>

                      {connStatus === 'connected' ? (
                        <span className="text-[11px] font-bold text-emerald-700 px-2 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Connected
                        </span>
                      ) : connStatus === 'pending_sent' ? (
                        <span className="text-[11px] font-semibold text-slate-500 px-2">Pending</span>
                      ) : (
                        <button
                          onClick={() => requestConnection(user.id)}
                          className="flex-1 py-1.5 text-center text-xs font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded-lg transition"
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
