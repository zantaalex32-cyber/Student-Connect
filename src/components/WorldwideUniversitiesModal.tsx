import React, { useState } from 'react';
import { 
  WORLDWIDE_APPROVED_UNIVERSITIES, 
  WORLDWIDE_REGIONS, 
  WorldwideRegion,
  ApprovedUniversity 
} from '../data/universities';
import { 
  Globe2, 
  X, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  School, 
  Check, 
  MapPin, 
  Building2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface WorldwideUniversitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUniversity?: (uniName: string) => void;
}

export const WorldwideUniversitiesModal: React.FC<WorldwideUniversitiesModalProps> = ({
  isOpen,
  onClose,
  onSelectUniversity,
}) => {
  const { currentUser, updateUserProfile, setActiveTab, setFilterUniversityOnly } = useApp();
  const [selectedRegion, setSelectedRegion] = useState<WorldwideRegion>('All Regions');
  const [search, setSearch] = useState('');
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredUniversities = WORLDWIDE_APPROVED_UNIVERSITIES.filter((u) => {
    if (selectedRegion !== 'All Regions' && u.region !== selectedRegion) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchShort = u.shortName?.toLowerCase().includes(q) ?? false;
      const matchCountry = u.country.toLowerCase().includes(q);
      const matchDomain = u.domain.toLowerCase().includes(q);
      return matchName || matchShort || matchCountry || matchDomain;
    }
    return true;
  });

  const handleChooseCampus = (uni: ApprovedUniversity) => {
    if (onSelectUniversity) {
      onSelectUniversity(uni.name);
      onClose();
      return;
    }

    // Otherwise set as student's primary university and switch to campus view
    updateUserProfile({ university: uni.name });
    setFilterUniversityOnly(true);
    setActiveTab('discover');
    onClose();
  };

  const handleCopyDomain = (domain: string) => {
    navigator.clipboard?.writeText?.(domain);
    setCopiedDomain(domain);
    setTimeout(() => setCopiedDomain(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border-2 border-slate-200 text-slate-900 relative my-6 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Colorful Brand Stripes */}
        <div className="h-2 w-full flex shrink-0">
          <div className="flex-1 bg-sky-500" />
          <div className="flex-1 bg-emerald-500" />
          <div className="flex-1 bg-amber-400" />
          <div className="flex-1 bg-rose-500" />
          <div className="flex-1 bg-purple-600" />
          <div className="flex-1 bg-indigo-600" />
        </div>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/50 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Worldwide Approved Universities
                  </h2>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" />
                    Global Accreditation Standard
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Verified degree-granting institutions recognized across Europe, North America, Asia, Africa, Oceania, and Latin America.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200 transition shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-indigo-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search worldwide universities by name, country, or domain (e.g. Imperial, Tokyo, Nairobi, .edu)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium shadow-xs"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
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
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{region}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Universities List Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredUniversities.map((uni) => {
              const isCurrentUni = currentUser.university.toLowerCase() === uni.name.toLowerCase();

              return (
                <div
                  key={uni.id}
                  className={`p-4 rounded-2xl border-2 transition bg-white flex flex-col justify-between shadow-xs ${
                    isCurrentUni
                      ? 'border-indigo-600 ring-2 ring-indigo-100'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" title={uni.country}>
                          {uni.flag}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              {uni.country}
                            </span>
                            <span className="text-[10px] text-slate-400">&bull;</span>
                            <span className="text-[10px] text-indigo-700 font-semibold">
                              {uni.region}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                            {uni.name}
                          </h3>
                        </div>
                      </div>

                      {isCurrentUni && (
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                          <Check className="w-3 h-3 text-indigo-600" />
                          Your Campus
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono flex items-center gap-1 border border-slate-200">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {uni.domain}
                      </span>
                      {uni.established && (
                        <span className="text-slate-500 text-[10px]">
                          Est. {uni.established}
                        </span>
                      )}
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Accredited
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyDomain(uni.domain)}
                      className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <span>{copiedDomain === uni.domain ? 'Copied Domain!' : 'Copy Domain'}</span>
                    </button>

                    <button
                      onClick={() => handleChooseCampus(uni)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1 ${
                        isCurrentUni
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <span>{onSelectUniversity ? 'Select University' : isCurrentUni ? 'View Campus Peers' : 'Connect as Campus'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUniversities.length === 0 && (
            <div className="text-center py-12 px-4">
              <Globe2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No universities match your search</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching by country or clearing the region filter.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All {WORLDWIDE_APPROVED_UNIVERSITIES.length}+ institutions meet worldwide higher education accreditation standards.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-xs self-end sm:self-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
