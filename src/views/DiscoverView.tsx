import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UNIVERSITIES_LIST, STUDY_YEARS } from '../data/mockData';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  MapPin, 
  BookOpen, 
  MessageSquareLock, 
  UserPlus, 
  Check, 
  MoreVertical, 
  AlertTriangle, 
  Ban,
  School,
  Sparkles,
  Heart
} from 'lucide-react';

export const DiscoverView: React.FC = () => {
  const {
    currentUser,
    users,
    filterUniversityOnly,
    setFilterUniversityOnly,
    setSelectedChatId,
    setActiveTab,
    requestConnection,
    getConnectionStatus,
    blockUser,
    setReportTarget,
    setIsReportModalOpen,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedInterest, setSelectedInterest] = useState<string>('all');
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  // Extract all unique interests and skills
  const allInterests = Array.from(
    new Set(users.flatMap(u => [...u.interests, ...u.skills]))
  ).slice(0, 12);

  // Filter students
  const filteredUsers = users.filter(user => {
    // Exclude current user
    if (user.id === currentUser.id) return false;
    // Exclude blocked users
    if (currentUser.blockedUserIds?.includes(user.id)) return false;

    // University toggle
    if (filterUniversityOnly && user.university !== currentUser.university) {
      return false;
    }
    if (selectedUniversity !== 'all' && user.university !== selectedUniversity) {
      return false;
    }

    // Year filter
    if (selectedYear !== 'all' && user.yearOfStudy !== selectedYear) {
      return false;
    }

    // Interest/Skill filter
    if (selectedInterest !== 'all') {
      const hasInterest = user.interests.includes(selectedInterest) || user.skills.includes(selectedInterest);
      if (!hasInterest) return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = user.name.toLowerCase().includes(q);
      const matchCourse = user.course.toLowerCase().includes(q);
      const matchUni = user.university.toLowerCase().includes(q);
      const matchInterests = user.interests.some(i => i.toLowerCase().includes(q));
      const matchSkills = user.skills.some(s => s.toLowerCase().includes(q));
      const matchHobbies = user.hobbies.some(h => h.toLowerCase().includes(q));
      return matchName || matchCourse || matchUni || matchInterests || matchSkills || matchHobbies;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Discover University Students
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Connect with study partners, project teammates, and peer mentors across campuses.
            </p>
          </div>

          {/* Campus scope toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterUniversityOnly(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                !filterUniversityOnly
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Universities
            </button>
            <button
              onClick={() => setFilterUniversityOnly(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterUniversityOnly
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              My Campus ({currentUser.university.split(' ')[0]})
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, course, or skills..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Universities & Colleges</option>
              {UNIVERSITIES_LIST.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Years of Study</option>
              {STUDY_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Interest Tag Filter Pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Topics:
          </span>
          <button
            onClick={() => setSelectedInterest('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 ${
              selectedInterest === 'all'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {allInterests.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedInterest(selectedInterest === item ? 'all' : item)}
              className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 ${
                selectedInterest === item
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              #{item}
            </button>
          ))}
        </div>
      </div>

      {/* Students Results Grid */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <p className="text-sm font-semibold text-slate-800">No students match your criteria</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing filters or switching between campus and global view.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user, idx) => {
            const connStatus = getConnectionStatus(user.id);
            const isMenuOpen = activeMenuUserId === user.id;

            const schoolColors = [
              'border-l-sky-500',
              'border-l-emerald-500',
              'border-l-amber-500',
              'border-l-purple-500',
              'border-l-rose-500',
              'border-l-teal-500',
            ];
            const borderCol = schoolColors[idx % schoolColors.length];

            return (
              <div
                key={user.id}
                className={`bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between relative border-l-4 ${borderCol}`}
              >
                <div>
                  {/* Top Card Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          user.status === 'online' ? 'bg-emerald-500' : user.status === 'studying' ? 'bg-amber-500' : 'bg-purple-500'
                        }`} title={`Status: ${user.status}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900 truncate">{user.name}</h3>
                          {user.verified && (
                            <span title="Verified Campus Student">
                              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">{user.course}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <School className="w-3 h-3 text-sky-600" />
                          <span className="truncate">{user.university} &bull; {user.yearOfStudy}</span>
                        </p>
                      </div>
                    </div>

                    {/* Overflow menu for Safety & Moderation (Block, Report) */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuUserId(isMenuOpen ? null : user.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        aria-label="User options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 text-xs">
                          <button
                            onClick={() => {
                              setActiveMenuUserId(null);
                              setReportTarget({ type: 'user', id: user.id, name: user.name });
                              setIsReportModalOpen(true);
                            }}
                            className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Report Student</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuUserId(null);
                              blockUser(user.id);
                            }}
                            className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Block User</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {user.bio}
                    </p>
                  )}

                  {/* Academic Interests & Skills */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="flex flex-wrap gap-1">
                      {user.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                      {user.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {user.hobbies.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                        <Heart className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">Hobbies: {user.hobbies.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedChatId(`dm-${user.id}`);
                      setActiveTab('messages');
                    }}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquareLock className="w-3.5 h-3.5 text-slate-600" />
                    <span>Encrypted Chat</span>
                  </button>

                  {connStatus === 'connected' ? (
                    <span className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Connected</span>
                    </span>
                  ) : connStatus === 'pending_sent' ? (
                    <span className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl bg-slate-50 text-slate-500 border border-slate-200 text-center">
                      Request Pending
                    </span>
                  ) : (
                    <button
                      onClick={() => requestConnection(user.id)}
                      className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
