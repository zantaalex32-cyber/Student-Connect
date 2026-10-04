import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProfileVisibility, YearOfStudy } from '../types';
import { STUDY_YEARS, getUniversityByName } from '../data/mockData';
import { WORLDWIDE_APPROVED_UNIVERSITIES } from '../data/universities';
import { UniversitySelectPicker } from '../components/UniversitySelectPicker';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Mail, 
  School, 
  Save, 
  Check, 
  Ban, 
  Download, 
  Trash2, 
  MessageCircle, 
  Shield, 
  ExternalLink,
  Globe2
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    users,
    updateUserProfile,
    unblockUser,
    setActiveTab,
    setIsWhatsAppSupportOpen,
    setIsWorldwideUniModalOpen,
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [university, setUniversity] = useState(currentUser.university);
  const [school, setSchool] = useState(currentUser.school);
  const [course, setCourse] = useState(currentUser.course);
  const [yearOfStudy, setYearOfStudy] = useState<YearOfStudy>(currentUser.yearOfStudy);
  const [visibility, setVisibility] = useState<ProfileVisibility>(currentUser.visibility);
  const [allowDMs, setAllowDMs] = useState(currentUser.allowDMs);
  const [showEmail, setShowEmail] = useState(currentUser.showEmail);
  const [interestsInput, setInterestsInput] = useState(currentUser.interests.join(', '));
  const [skillsInput, setSkillsInput] = useState(currentUser.skills.join(', '));
  const [hobbiesInput, setHobbiesInput] = useState(currentUser.hobbies.join(', '));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const interests = interestsInput.split(',').map(s => s.trim()).filter(Boolean);
    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const hobbies = hobbiesInput.split(',').map(s => s.trim()).filter(Boolean);

    updateUserProfile({
      name,
      bio,
      university,
      school,
      course,
      yearOfStudy,
      visibility,
      allowDMs,
      showEmail,
      interests,
      skills,
      hobbies,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(currentUser, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudentsConnect_Profile_${currentUser.name.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  // Blocked users details
  const blockedUsers = (currentUser.blockedUserIds || [])
    .map(id => users.find(u => u.id === id))
    .filter(Boolean);

  const currentApprovedUni = getUniversityByName(currentUser.university);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Profile Banner */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Top Colorful Brand Stripes */}
        <div className="h-2 w-full flex">
          <div className="flex-1 bg-sky-500" />
          <div className="flex-1 bg-emerald-500" />
          <div className="flex-1 bg-amber-400" />
          <div className="flex-1 bg-rose-500" />
          <div className="flex-1 bg-purple-600" />
          <div className="flex-1 bg-indigo-600" />
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-sky-200 border-2 border-white shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
                <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5 font-medium">{currentUser.course} &bull; {currentUser.yearOfStudy}</p>
              
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs text-sky-950 font-bold bg-sky-100 border border-sky-300 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
                  {currentApprovedUni ? <span>{currentApprovedUni.flag}</span> : <School className="w-3.5 h-3.5 text-sky-700" />}
                  <span>{currentUser.university}</span>
                </span>
                {currentApprovedUni && (
                  <span className="text-[10px] text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Accredited Worldwide ({currentApprovedUni.country})
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsWhatsAppSupportOpen(true)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Campus Ambassador (0114488963)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Profile Settings Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Academic Profile Information
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('universities')}
                className="text-xs text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1.5 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-300 transition shadow-2xs"
              >
                <Globe2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Worldwide Campuses ({WORLDWIDE_APPROVED_UNIVERSITIES.length}+)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Worldwide Approved University</label>
                <button
                  type="button"
                  onClick={() => setIsWorldwideUniModalOpen(true)}
                  className="text-[11px] text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1"
                >
                  <Globe2 className="w-3 h-3" />
                  <span>Browse All</span>
                </button>
              </div>
              <UniversitySelectPicker
                value={university}
                onChange={setUniversity}
                label=""
                placeholder="Select worldwide approved university..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty / School</label>
              <input
                type="text"
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. Faculty of Engineering"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Degree</label>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. B.Eng. Computing"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Study</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value as YearOfStudy)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {STUDY_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Email</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other students what you are studying or working on..."
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
            />
          </div>
        </div>

        {/* Interests, Skills, Hobbies */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
            Interests, Skills & Hobbies
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic & Research Interests (comma separated)
              </label>
              <input
                type="text"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                placeholder="e.g. Artificial Intelligence, Distributed Systems, Quantum Computing"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Technical & Soft Skills (comma separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Python, TypeScript, Docker, Algorithms, Public Speaking"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Social Hobbies & Extracurriculars (comma separated)
              </label>
              <input
                type="text"
                value={hobbiesInput}
                onChange={(e) => setHobbiesInput(e.target.value)}
                placeholder="e.g. Table Tennis, Film Photography, Bouldering, Chess"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Privacy & Safety Controls */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-600" />
            <span>Privacy & Safety Controls</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Profile Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as ProfileVisibility)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="public">Public (Visible across all universities and student searches)</option>
                <option value="university_only">Campus Only (Only verified students at {currentUser.university})</option>
                <option value="friends_only">Connected Friends & Study Group Members Only</option>
                <option value="private">Private (Hidden from global student directory)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowDMs}
                  onChange={(e) => setAllowDMs(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span>Allow direct encrypted messages from any student in my university</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEmail}
                  onChange={(e) => setShowEmail(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span>Display my campus academic email on my public student card</span>
              </label>
            </div>
          </div>
        </div>

        {/* E2EE Security Keys */}
        <div className="p-4 bg-slate-900 text-white rounded-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Cryptographic End-to-End Key Pair
            </h4>
          </div>
          <p className="text-xs text-slate-300 mb-2">
            Your client device holds a Curve25519 identity key used to negotiate encrypted study channels.
          </p>
          <div className="p-2 bg-slate-800 rounded font-mono text-[11px] text-sky-200 break-all select-all">
            Identity Fingerprint: {currentUser.e2eeFingerprint}
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            {savedSuccess && <><Check className="w-4 h-4" /> Profile saved successfully!</>}
          </span>

          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Privacy</span>
          </button>
        </div>
      </form>

      {/* Safety & Account Management Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Safety & Account Data</h3>

        {/* Blocked Users */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-2">Blocked Students</h4>
          {blockedUsers.length === 0 ? (
            <p className="text-xs text-slate-500">You haven't blocked any student accounts.</p>
          ) : (
            <div className="space-y-2">
              {blockedUsers.map(bUser => (
                <div key={bUser?.id} className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{bUser?.name} ({bUser?.university})</span>
                  <button
                    onClick={() => bUser && unblockUser(bUser.id)}
                    className="text-sky-600 hover:underline font-semibold"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data export */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Export Student Data</h4>
            <p className="text-[11px] text-slate-500">Download a complete copy of your profile and settings as JSON.</p>
          </div>
          <button
            onClick={handleExportData}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
