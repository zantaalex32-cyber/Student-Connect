import React, { useState, useMemo } from 'react';
import { 
  WORLDWIDE_APPROVED_UNIVERSITIES, 
  WORLDWIDE_REGIONS, 
  WorldwideRegion,
  ApprovedUniversity 
} from '../data/universities';
import { useApp } from '../context/AppContext';
import { 
  Globe2, 
  Search, 
  ShieldCheck, 
  Building2, 
  Check, 
  ExternalLink, 
  Users, 
  Copy, 
  CheckCheck,
  Compass,
  School,
  Sparkles,
  MessageCircle,
  HelpCircle,
  X
} from 'lucide-react';

export const UniversitiesView: React.FC = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    setActiveTab, 
    setFilterUniversityOnly,
    setIsWhatsAppSupportOpen,
    users,
    groups
  } = useApp();

  const [selectedRegion, setSelectedRegion] = useState<WorldwideRegion>('All Regions');
  const [selectedCountry, setSelectedCountry] = useState<string>('All Countries');
  const [search, setSearch] = useState('');
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const [viewFilter, setViewFilter] = useState<'all' | 'with_students'>('all');

  // Compute unique countries
  const countries = useMemo(() => {
    const list = Array.from(new Set(WORLDWIDE_APPROVED_UNIVERSITIES.map((u) => u.country))).sort();
    return ['All Countries', ...list];
  }, []);

  // Filter universities
  const filteredUniversities = useMemo(() => {
    return WORLDWIDE_APPROVED_UNIVERSITIES.filter((u) => {
      // Region filter
      if (selectedRegion !== 'All Regions' && u.region !== selectedRegion) {
        return false;
      }

      // Country filter
      if (selectedCountry !== 'All Countries' && u.country !== selectedCountry) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchShort = u.shortName?.toLowerCase().includes(q) ?? false;
        const matchCountry = u.country.toLowerCase().includes(q);
        const matchDomain = u.domain.toLowerCase().includes(q);
        if (!matchName && !matchShort && !matchCountry && !matchDomain) {
          return false;
        }
      }

      // Filter by universities that have existing registered students in the app
      if (viewFilter === 'with_students') {
        const hasStudents = users.some(
          (user) => user.university.toLowerCase() === u.name.toLowerCase()
        );
        if (!hasStudents) return false;
      }

      return true;
    });
  }, [selectedRegion, selectedCountry, search, viewFilter, users]);

  const handleCopyDomain = (domain: string) => {
    navigator.clipboard?.writeText?.(domain);
    setCopiedDomain(domain);
    setTimeout(() => setCopiedDomain(null), 2000);
  };

  const handleSelectCampus = (uni: ApprovedUniversity) => {
    updateUserProfile({ university: uni.name });
  };

  const handleViewCampusPeers = (uni: ApprovedUniversity) => {
    updateUserProfile({ university: uni.name });
    setFilterUniversityOnly(true);
    setActiveTab('discover');
  };

  const handleViewCampusGroups = (uni: ApprovedUniversity) => {
    updateUserProfile({ university: uni.name });
    setFilterUniversityOnly(true);
    setActiveTab('groups');
  };

  // Region badge color mapping (solid, vibrant, strictly no gradients)
  const getRegionBadge = (region: ApprovedUniversity['region']) => {
    switch (region) {
      case 'United Kingdom & Europe':
        return 'bg-sky-600 text-white';
      case 'North America':
        return 'bg-purple-600 text-white';
      case 'Asia & Middle East':
        return 'bg-amber-500 text-white';
      case 'Africa':
        return 'bg-emerald-600 text-white';
      case 'Oceania':
        return 'bg-teal-600 text-white';
      case 'Latin America':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header and Hero Banner */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Top Colorful Brand Stripes */}
        <div className="h-2 w-full flex">
          <div className="flex-1 bg-sky-500" />
          <div className="flex-1 bg-emerald-500" />
          <div className="flex-1 bg-amber-400" />
          <div className="flex-1 bg-rose-500" />
          <div className="flex-1 bg-purple-600" />
          <div className="flex-1 bg-indigo-600" />
          <div className="flex-1 bg-teal-500" />
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Worldwide Approved Universities
                  </h1>
                  <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Accredited Global Directory
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Verified degree-granting universities across Europe, North America, Asia, Africa, Oceania, and Latin America. Switch campuses with one click or explore global cross-academic student networks.
                </p>
              </div>
            </div>

            {/* Support / Add campus button */}
            <button
              onClick={() => setIsWhatsAppSupportOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 shadow-xs shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Campus Hotline (0114488963)</span>
            </button>
          </div>

          {/* Quick Stat Counters (Solid Vibrant Colors) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
            <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-3 flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                <School className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-teal-800 font-extrabold uppercase tracking-wider block">Approved Campuses</span>
                <span className="text-lg font-black text-teal-950 leading-tight">{WORLDWIDE_APPROVED_UNIVERSITIES.length}+</span>
              </div>
            </div>

            <div className="bg-sky-50 border-2 border-sky-300 rounded-xl p-3 flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0">
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-sky-800 font-extrabold uppercase tracking-wider block">World Regions</span>
                <span className="text-lg font-black text-sky-950 leading-tight">6 Continents</span>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider block">Nations Represented</span>
                <span className="text-lg font-black text-amber-950 leading-tight">{countries.length - 1}+ Countries</span>
              </div>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3 flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider block">Accreditation</span>
                <span className="text-lg font-black text-emerald-950 leading-tight">100% Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Search Bar & Country Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search worldwide universities by name, short name, country, or domain (e.g. Imperial, Toronto, Tokyo, .edu)..."
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Country Selector */}
          <div className="w-full sm:w-60">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full py-2.5 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold cursor-pointer"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Toggle: All vs Campuses with active peers */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-stretch sm:self-auto">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                viewFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Approved ({WORLDWIDE_APPROVED_UNIVERSITIES.length})
            </button>
            <button
              onClick={() => setViewFilter('with_students')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                viewFilter === 'with_students'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Campuses
            </button>
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100">
          <span className="text-[10px] font-extrabold uppercase text-slate-600 tracking-wider shrink-0 mr-1">
            Continents / Regions:
          </span>
          {WORLDWIDE_REGIONS.map((region) => {
            const count =
              region === 'All Regions'
                ? WORLDWIDE_APPROVED_UNIVERSITIES.length
                : WORLDWIDE_APPROVED_UNIVERSITIES.filter((u) => u.region === region).length;
            const isActive = selectedRegion === region;
            return (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{region}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Showing Count Information */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-600">
        <p>
          Showing <span className="font-bold text-slate-900">{filteredUniversities.length}</span> accredited universities
          {selectedRegion !== 'All Regions' && <span> in <span className="font-bold text-teal-700">{selectedRegion}</span></span>}
          {selectedCountry !== 'All Countries' && <span> ({selectedCountry})</span>}
        </p>

        {currentUser.university && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500">Your Current Campus:</span>
            <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {currentUser.university}
            </span>
          </div>
        )}
      </div>

      {/* Universities Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUniversities.map((uni) => {
          const isCurrentCampus = currentUser.university.toLowerCase() === uni.name.toLowerCase();
          const enrolledPeers = users.filter(
            (u) => u.university.toLowerCase() === uni.name.toLowerCase()
          );
          const campusGroups = groups.filter(
            (g) => g.university.toLowerCase() === uni.name.toLowerCase()
          );

          return (
            <div
              key={uni.id}
              className={`p-4 rounded-2xl border-2 transition bg-white flex flex-col justify-between shadow-xs ${
                isCurrentCampus
                  ? 'border-sky-500 ring-2 ring-sky-200'
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div>
                {/* Top Country & Flag Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl leading-none" title={uni.country}>
                      {uni.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                          {uni.country}
                        </span>
                        <span className="text-[10px] text-slate-300">&bull;</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getRegionBadge(uni.region)}`}>
                          {uni.region.split(' & ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isCurrentCampus ? (
                    <span className="text-[10px] font-bold bg-sky-600 text-white px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 shadow-xs">
                      <Check className="w-3 h-3" />
                      Your Campus
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Accredited
                    </span>
                  )}
                </div>

                {/* University Name */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {uni.name}
                  </h3>
                  {uni.shortName && uni.shortName !== uni.name && (
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded inline-block mt-1">
                      {uni.shortName}
                    </span>
                  )}
                </div>

                {/* Meta details: Domain, Established */}
                <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px]">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1 border border-slate-200">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    {uni.domain}
                  </span>

                  {uni.established && (
                    <span className="text-slate-500 text-[11px] font-medium">
                      Est. {uni.established}
                    </span>
                  )}

                  {enrolledPeers.length > 0 && (
                    <span className="bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <Users className="w-3 h-3 text-purple-700" />
                      {enrolledPeers.length} active {enrolledPeers.length === 1 ? 'student' : 'students'}
                    </span>
                  )}

                  {campusGroups.length > 0 && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                      {campusGroups.length} {campusGroups.length === 1 ? 'circle' : 'circles'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <button
                    onClick={() => handleCopyDomain(uni.domain)}
                    className="font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition"
                  >
                    {copiedDomain === uni.domain ? (
                      <>
                        <CheckCheck className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Domain</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleViewCampusPeers(uni)}
                      title={`View students from ${uni.name}`}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-[10px] flex items-center gap-1"
                    >
                      <Compass className="w-3 h-3 text-slate-500" />
                      <span>Peers</span>
                    </button>
                    {campusGroups.length > 0 && (
                      <button
                        onClick={() => handleViewCampusGroups(uni)}
                        title={`View study groups from ${uni.name}`}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-lg transition text-[10px] flex items-center gap-1"
                      >
                        <Users className="w-3 h-3 text-emerald-600" />
                        <span>Groups</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary Campus Selector */}
                {isCurrentCampus ? (
                  <button
                    onClick={() => handleViewCampusPeers(uni)}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Your Active Campus</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectCampus(uni)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Connect as My Campus</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredUniversities.length === 0 && (
        <div className="text-center py-16 px-4 bg-white border-2 border-slate-200 rounded-2xl shadow-xs">
          <Globe2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No approved universities match your search</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            Try searching with broader terms or resetting region and country filters to view all worldwide accredited institutions.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearch('');
                setSelectedRegion('All Regions');
                setSelectedCountry('All Countries');
                setViewFilter('all');
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => setIsWhatsAppSupportOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Request University Onboarding</span>
            </button>
          </div>
        </div>
      )}

      {/* Worldwide Accreditation Assurance & Campus Ambassador Footnote */}
      <div className="p-6 bg-white border-2 border-teal-200 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Global Higher Education Accreditation Verification
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-2xl">
              All listed campuses meet statutory degree-granting accreditation criteria recognized by ministries of education, the Bologna Process (Europe), regional higher learning commissions (US/Canada), and national accreditation bodies across Asia, Africa, Oceania, and Latin America.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsWhatsAppSupportOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 shrink-0 self-start md:self-auto"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Campus Ambassador Hotline (0114488963)</span>
        </button>
      </div>
    </div>
  );
};
