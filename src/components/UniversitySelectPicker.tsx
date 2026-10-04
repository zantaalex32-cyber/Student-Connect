import React, { useState, useRef, useEffect } from 'react';
import { 
  WORLDWIDE_APPROVED_UNIVERSITIES, 
  WORLDWIDE_REGIONS, 
  ApprovedUniversity,
  WorldwideRegion 
} from '../data/universities';
import { Search, ChevronDown, Check, Globe, ShieldCheck, X } from 'lucide-react';

interface UniversitySelectPickerProps {
  value: string;
  onChange: (universityName: string) => void;
  disabled?: boolean;
  allowCrossUniversity?: boolean;
  label?: string;
  placeholder?: string;
}

export const UniversitySelectPicker: React.FC<UniversitySelectPickerProps> = ({
  value,
  onChange,
  disabled = false,
  allowCrossUniversity = false,
  label = 'University / College',
  placeholder = 'Select worldwide approved university...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<WorldwideRegion>('All Regions');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedUni = WORLDWIDE_APPROVED_UNIVERSITIES.find(
    (u) => u.name.toLowerCase() === value.toLowerCase()
  );

  const filtered = WORLDWIDE_APPROVED_UNIVERSITIES.filter((u) => {
    if (selectedRegion !== 'All Regions' && u.region !== selectedRegion) {
      return false;
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.shortName && u.shortName.toLowerCase().includes(q)) ||
      u.country.toLowerCase().includes(q) ||
      u.domain.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left text-xs rounded-xl border p-2.5 bg-slate-50 transition flex items-center justify-between gap-2 shadow-xs ${
          isOpen ? 'ring-2 ring-sky-500 border-sky-400 bg-white' : 'border-slate-200 hover:border-slate-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2 truncate">
          {value === 'Cross-University' ? (
            <>
              <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-bold text-indigo-900">Cross-University / Worldwide</span>
            </>
          ) : selectedUni ? (
            <>
              <span className="text-base shrink-0">{selectedUni.flag}</span>
              <div className="truncate">
                <span className="font-bold text-slate-900 truncate block">{selectedUni.name}</span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {selectedUni.country} &bull; {selectedUni.domain}
                </span>
              </div>
            </>
          ) : (
            <span className="text-slate-500 truncate">{value || placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Searchable Dropdown Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border-2 border-slate-200 z-50 overflow-hidden flex flex-col max-h-80 text-slate-900">
          {/* Search Box */}
          <div className="p-2.5 border-b border-slate-200 bg-slate-50/70">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search worldwide universities..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-0.5 text-[10px]">
              {WORLDWIDE_REGIONS.map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-2 py-0.5 rounded-md font-bold transition shrink-0 ${
                    selectedRegion === reg
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {reg === 'United Kingdom & Europe' ? 'UK & Europe' : reg === 'Asia & Middle East' ? 'Asia' : reg}
                </button>
              ))}
            </div>
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1">
            {allowCrossUniversity && (
              <button
                type="button"
                onClick={() => {
                  onChange('Cross-University');
                  setIsOpen(false);
                }}
                className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs transition ${
                  value === 'Cross-University' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Cross-University / Worldwide Collaboration</span>
                    <span className="text-[10px] text-slate-400 block">Open to students from all accredited campuses</span>
                  </div>
                </div>
                {value === 'Cross-University' && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
              </button>
            )}

            {filtered.map((u) => {
              const isSelected = value.toLowerCase() === u.name.toLowerCase();
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    onChange(u.name);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs transition ${
                    isSelected ? 'bg-sky-50 text-sky-950 font-bold' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base shrink-0">{u.flag}</span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="truncate">{u.name}</span>
                        <span title="Accredited Institution" className="inline-flex shrink-0">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate font-normal">
                        {u.country} &bull; <span className="font-mono text-slate-400">{u.domain}</span>
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-sky-600 shrink-0 ml-2" />}
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                No approved universities match &ldquo;{search}&rdquo;
              </div>
            )}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Accredited Worldwide Universities ({WORLDWIDE_APPROVED_UNIVERSITIES.length})
            </span>
            <span>{selectedRegion}</span>
          </div>
        </div>
      )}
    </div>
  );
};
