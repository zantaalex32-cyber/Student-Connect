import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GroupCategory, GroupPrivacy } from '../types';
import { UniversitySelectPicker } from './UniversitySelectPicker';
import { Users, X, BookOpen, Briefcase, Network, HeartHandshake, Shield } from 'lucide-react';

export const CreateGroupModal: React.FC = () => {
  const { isCreateGroupOpen, setIsCreateGroupOpen, createGroup, currentUser, setActiveTab } = useApp();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GroupCategory>('study_group');
  const [privacy, setPrivacy] = useState<GroupPrivacy>('public');
  const [university, setUniversity] = useState(currentUser.university);
  const [isCrossUni, setIsCrossUni] = useState(false);
  const [course, setCourse] = useState(currentUser.course);
  const [tagsInput, setTagsInput] = useState('');

  if (!isCreateGroupOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const solidBadgeColors = {
      study_group: '#0284c7', // light blue
      project_team: '#059669', // emerald
      networking_circle: '#7c3aed', // purple
      friend_group: '#d97706', // amber
    };

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const defaultImages = {
      study_group: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80',
      project_team: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80',
      networking_circle: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80',
      friend_group: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
    };

    createGroup({
      name,
      description,
      category,
      privacy,
      university: isCrossUni ? 'Cross-University' : university,
      course: course || undefined,
      avatar: defaultImages[category],
      solidBadgeColor: solidBadgeColors[category],
      tags: tags.length > 0 ? tags : ['Study', 'Campus', 'Collaboration'],
    });

    setIsCreateGroupOpen(false);
    setActiveTab('workspace');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-slate-900 relative my-8">
        <button
          onClick={() => setIsCreateGroupOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Create Group or Circle</h3>
            <p className="text-xs text-slate-500">Study groups, project teams, networking, or friend circles</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Community Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('study_group')}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition ${
                  category === 'study_group'
                    ? 'border-sky-500 bg-sky-50 text-sky-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Study Group</div>
                  <div className="text-[11px] text-slate-500">Exam prep & revision</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('project_team')}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition ${
                  category === 'project_team'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Project Team</div>
                  <div className="text-[11px] text-slate-500">Capstone & hackathons</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('networking_circle')}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition ${
                  category === 'networking_circle'
                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Network className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Networking Circle</div>
                  <div className="text-[11px] text-slate-500">Careers & societies</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('friend_group')}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition ${
                  category === 'friend_group'
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Friend Circle</div>
                  <div className="text-[11px] text-slate-500">Hangouts & trips</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Group Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Advanced Machine Learning Paper Discussions"
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Objectives
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this group about? What will members collaborate on?"
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Campus / University
                </label>
                <label className="text-[11px] text-sky-700 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCrossUni}
                    onChange={(e) => setIsCrossUni(e.target.checked)}
                    className="w-3 h-3 text-sky-600 rounded"
                  />
                  <span>Cross-University</span>
                </label>
              </div>
              <UniversitySelectPicker
                value={isCrossUni ? 'Cross-University' : university}
                onChange={setUniversity}
                disabled={isCrossUni}
                label=""
                placeholder="Select worldwide approved university..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Access & Privacy
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value as GroupPrivacy)}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="public">Public (Any student can join)</option>
                <option value="university_only">University Only (Verified campus domain)</option>
                <option value="request_to_join">Request to Join (Moderator approval)</option>
                <option value="private_invite">Private Circle (Invite only)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Associated Course / Major (Optional)
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. Computing, Biomedical Sciences, Law"
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tags / Topics (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. AI, Neural Networks, PyTorch, ExamReview"
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateGroupOpen(false)}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition shadow-sm"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
