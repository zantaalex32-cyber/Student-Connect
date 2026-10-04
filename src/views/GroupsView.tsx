import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GroupCategory } from '../types';
import { WORLDWIDE_APPROVED_UNIVERSITIES, getUniversityByName } from '../data/universities';
import { 
  Users2, 
  Plus, 
  Search, 
  BookOpen, 
  Briefcase, 
  Network, 
  HeartHandshake, 
  Lock, 
  Globe, 
  Globe2,
  FolderKanban, 
  Check, 
  ArrowRight,
  Pin
} from 'lucide-react';

export const GroupsView: React.FC = () => {
  const {
    groups,
    currentUser,
    users,
    setCurrentGroup,
    setActiveTab,
    setIsCreateGroupOpen,
    joinGroup,
    leaveGroup,
    filterUniversityOnly,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredGroups = groups.filter(g => {
    if (filterUniversityOnly && g.university !== currentUser.university && g.university !== 'Cross-University') {
      return false;
    }

    if (selectedCategory !== 'all' && g.category !== selectedCategory) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      const matchDesc = g.description.toLowerCase().includes(q);
      const matchTags = g.tags.some(t => t.toLowerCase().includes(q));
      const matchUni = g.university.toLowerCase().includes(q);
      return matchName || matchDesc || matchTags || matchUni;
    }

    return true;
  });

  const getCategoryIcon = (cat: GroupCategory) => {
    switch (cat) {
      case 'study_group':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'project_team':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'networking_circle':
        return <Network className="w-3.5 h-3.5" />;
      case 'friend_group':
        return <HeartHandshake className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Top Colorful Brand Stripes */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-emerald-500" />
          <div className="flex-1 bg-sky-500" />
          <div className="flex-1 bg-purple-600" />
          <div className="flex-1 bg-rose-500" />
          <div className="flex-1 bg-amber-400" />
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Study Groups, Teams & Circles
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Dedicated collaborative workspaces for coursework, capstone projects, career networks, and social friend circles.
              </p>
            </div>

            <button
              onClick={() => setIsCreateGroupOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Circle</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Communities ({groups.length})
            </button>

            <button
              onClick={() => setSelectedCategory('study_group')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                selectedCategory === 'study_group'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Study Groups</span>
            </button>

            <button
              onClick={() => setSelectedCategory('project_team')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                selectedCategory === 'project_team'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Project Teams</span>
            </button>

            <button
              onClick={() => setSelectedCategory('networking_circle')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                selectedCategory === 'networking_circle'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Networking Circles</span>
            </button>

            <button
              onClick={() => setSelectedCategory('friend_group')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                selectedCategory === 'friend_group'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Friend Circles</span>
            </button>

            <button
              onClick={() => setActiveTab('universities')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 flex items-center gap-1.5 shadow-2xs sm:ml-auto"
              title="Explore approved worldwide universities"
            >
              <Globe2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Worldwide Campuses ({WORLDWIDE_APPROVED_UNIVERSITIES.length}+)</span>
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities by title, tags, or coursework..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Groups Grid or Empty State */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-300">
            <Users2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Groups Found</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
            Create a dedicated collaborative workspace for your course revision, team capstone, or private friends.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto my-6 text-left">
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
              <span className="text-[10px] font-bold text-sky-800 uppercase block">Study Groups</span>
              <p className="text-[11px] text-sky-950 font-medium mt-1">Exam prep & problem sets</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Project Teams</span>
              <p className="text-[11px] text-emerald-950 font-medium mt-1">Capstones & hackathons</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">Networking</span>
              <p className="text-[11px] text-purple-950 font-medium mt-1">Societies & career circles</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Friend Circles</span>
              <p className="text-[11px] text-amber-950 font-medium mt-1">Trips, hiking & games</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsCreateGroupOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Group</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroups.map((group) => {
            const isMember = group.members.some(m => m.userId === currentUser.id);
            const memberUsers = group.members
              .map(m => users.find(u => u.id === m.userId))
              .filter(Boolean);

            return (
              <div
                key={group.id}
                className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between border-l-4"
                style={{ borderLeftColor: group.solidBadgeColor }}
              >
                <div>
                  {/* Header & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: group.solidBadgeColor }}
                          >
                            {getCategoryIcon(group.category)}
                            {group.category.replace('_', ' ')}
                          </span>

                          {(() => {
                            const approvedUni = getUniversityByName(group.university);
                            return (
                              <span className="text-[10px] text-slate-700 font-semibold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                                {approvedUni ? (
                                  <span title={`${approvedUni.country} - Worldwide Approved`}>
                                    {approvedUni.flag}
                                  </span>
                                ) : null}
                                <span className="truncate">{group.university}</span>
                              </span>
                            );
                          })()}
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                          {group.name}
                        </h3>
                        {group.course && (
                          <p className="text-[11px] font-medium text-slate-500">{group.course}</p>
                        )}
                      </div>
                    </div>
                  </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {group.description}
                </p>

                {/* Pinned Announcement */}
                {group.pinnedNotice && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                    <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{group.pinnedNotice}</span>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {group.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Members & Action CTA */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                {/* Member avatars */}
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {memberUsers.slice(0, 3).map((u, i) => (
                      <img
                        key={u?.id || i}
                        src={u?.avatar}
                        alt={u?.name}
                        title={u?.name}
                        className="w-6 h-6 rounded-full border border-white object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-600 font-bold">
                    {group.members.length} members
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isMember ? (
                    <>
                      <button
                        onClick={() => {
                          setCurrentGroup(group);
                          setActiveTab('workspace');
                        }}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition flex items-center gap-1 shadow-xs"
                      >
                        <FolderKanban className="w-3.5 h-3.5" />
                        <span>Workspace</span>
                      </button>
                      <button
                        onClick={() => leaveGroup(group.id)}
                        className="px-2 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition"
                        title="Leave group"
                      >
                        Leave
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => joinGroup(group.id)}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 shadow-xs"
                    >
                      <span>Join Community</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
