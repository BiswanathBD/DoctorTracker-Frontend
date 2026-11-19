'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { SearchService, type DoctorSearchItem, type PatientSearchItem } from '@/server/search.service';
import {
  Search,
  X,
  Loader2,
  Stethoscope,
  Users,
  Building2,
  ChevronRight,
  Command,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavbarGlobalSearchProps {
  variant?: 'desktop' | 'mobile';
  onSelectDoctor: (doctor: DoctorSearchItem) => void;
  onSelectPatient: (patient: PatientSearchItem) => void;
  className?: string;
}

export const NavbarGlobalSearch: React.FC<NavbarGlobalSearchProps> = ({
  variant = 'desktop',
  onSelectDoctor,
  onSelectPatient,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [doctors, setDoctors] = useState<DoctorSearchItem[]>([]);
  const [patients, setPatients] = useState<PatientSearchItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Debounce user input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Fetch search results when debounced query changes
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) return;

    let isMounted = true;
    const searchTimer = setTimeout(() => {
      if (isMounted) setIsSearching(true);
    }, 0);

    SearchService.globalSearch(trimmed, 5)
      .then((res) => {
        if (!isMounted) return;
        setDoctors(res.doctors || []);
        setPatients(res.patients || []);
        setHasSearched(true);
        setIsOpen(true);
      })
      .catch(() => {
        if (!isMounted) return;
        setDoctors([]);
        setPatients([]);
        setHasSearched(true);
      })
      .finally(() => {
        if (isMounted) setIsSearching(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(searchTimer);
    };
  }, [debouncedQuery]);

  // 3. Close suggestion dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4. Global keyboard shortcuts (Command+K to focus, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        if (searchQuery.trim().length >= 2) {
          setIsOpen(true);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setDoctors([]);
    setPatients([]);
    setHasSearched(false);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  // Open doctor detail drawer immediately (the drawer fetches by ID & shows skeleton)
  const handleDoctorClick = useCallback(
    (doctor: DoctorSearchItem) => {
      setIsOpen(false);
      onSelectDoctor(doctor);
    },
    [onSelectDoctor]
  );

  // Open patient detail drawer immediately (the drawer fetches by ID & shows skeleton)
  const handlePatientClick = useCallback(
    (patient: PatientSearchItem) => {
      setIsOpen(false);
      onSelectPatient(patient);
    },
    [onSelectPatient]
  );

  const totalResults = doctors.length + patients.length;

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Search Input Container */}
      <div className="relative w-full group">
        {/* Left search/spinner icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center">
          {isSearching ? (
            <Loader2
              className={cn(
                'w-4 h-4 animate-spin',
                variant === 'desktop' ? 'text-primary-foreground' : 'text-primary'
              )}
            />
          ) : (
            <Search
              className={cn(
                'w-4 h-4 transition-colors',
                variant === 'desktop'
                  ? 'text-primary-foreground group-focus-within:text-primary-foreground'
                  : 'text-muted-foreground group-focus-within:text-primary'
              )}
            />
          )}
        </div>

        {/* Actual Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onFocus={() => {
            if (searchQuery.trim().length >= 2) setIsOpen(true);
          }}
          onChange={(e) => {
            const val = e.target.value;
            setSearchQuery(val);
            if (val.trim().length >= 2) {
              setIsOpen(true);
            } else {
              setDoctors([]);
              setPatients([]);
              setIsSearching(false);
              setHasSearched(false);
              setIsOpen(false);
            }
          }}
          placeholder="Search specialists, patients, hospitals..."
          className={cn(
            'w-full pl-9.5 py-2 text-xs rounded-2xl outline-none transition-all font-medium',
            variant === 'desktop'
              ? 'pr-12 lg:pr-14 border border-primary-foreground/25 bg-primary-foreground/15 backdrop-blur-md text-primary-foreground placeholder:text-primary-foreground/75 focus:border-primary-foreground/60 focus:bg-primary-foreground/25 focus:ring-4 focus:ring-primary-foreground/15 shadow-xs'
              : 'pr-9 border border-border/80 bg-muted/40 hover:bg-muted/60 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground placeholder:text-muted-foreground shadow-2xs'
          )}
        />

        {/* Right action: clear button or shortcut badge */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
          {searchQuery ? (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'p-1 rounded-full transition-colors cursor-pointer',
                variant === 'desktop'
                  ? 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : variant === 'desktop' ? (
            <div className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg border border-primary-foreground/20 bg-primary-foreground/15 text-[10px] text-primary-foreground/80 select-none pointer-events-none shadow-xs font-medium">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Suggestion Dropdown List */}
      {isOpen && searchQuery.trim().length >= 2 && (
        <div
          className={cn(
            'absolute left-0 right-0 w-full top-full mt-2.5 z-50 rounded-3xl bg-card/95 backdrop-blur-2xl border border-border/80 shadow-2xl shadow-black/25 text-foreground overflow-hidden max-h-[75vh] flex flex-col'
          )}
        >
          {/* Header pill */}
          <div className="p-3 px-4 border-b border-border/60 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-bold flex items-center gap-1.5 text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Search Suggestions
            </span>
            <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {isSearching || debouncedQuery.trim() !== searchQuery.trim()
                ? 'Searching...'
                : `${totalResults} Result${totalResults === 1 ? '' : 's'}`}
            </span>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 sm:p-3 space-y-3">
            {isSearching || debouncedQuery.trim() !== searchQuery.trim() || !hasSearched ? (
              <div className="py-8 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                <p className="text-xs text-muted-foreground font-medium">
                  Searching across specialists and patients...
                </p>
              </div>
            ) : totalResults === 0 ? (
              <div className="py-8 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-foreground">No matches found</p>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                  No specialists or clinical patients matched &ldquo;<strong className="text-foreground">{debouncedQuery || searchQuery}</strong>&rdquo;.
                </p>
              </div>
            ) : (
              <>
                {/* 1. Doctors / Specialists Section */}
                {doctors.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Specialists ({doctors.length})</span>
                    </div>

                    <div className="space-y-1">
                      {doctors.map((doctor) => (
                        <button
                          key={doctor._id}
                          type="button"
                          onClick={() => handleDoctorClick(doctor)}
                          className="w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-primary/10 border border-transparent hover:border-primary/25 transition-all text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Doctor Avatar */}
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-primary/15 border border-primary/25 shrink-0 flex items-center justify-center text-primary">
                              {doctor.avatar?.url ? (
                                <Image
                                  src={doctor.avatar.url}
                                  alt={doctor.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <Stethoscope className="w-5 h-5 text-primary" />
                              )}
                            </div>

                            {/* Doctor Details */}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                {doctor.name.startsWith('Dr.') ? doctor.name : `Dr. ${doctor.name}`}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5 truncate">
                                <span className="font-semibold text-primary/90 bg-primary/10 px-1.5 py-0.2 rounded">
                                  {doctor.specialization}
                                </span>
                                <span className="flex items-center gap-1 truncate">
                                  <Building2 className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{doctor.hospital}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>View</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Patients Section */}
                {patients.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 border-t border-border/50 pt-2">
                      <Users className="w-3.5 h-3.5" />
                      <span>Patients ({patients.length})</span>
                    </div>

                    <div className="space-y-1">
                      {patients.map((patient) => (
                        <button
                          key={patient._id}
                          type="button"
                          onClick={() => handlePatientClick(patient)}
                          className="w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-secondary/10 border border-transparent hover:border-secondary/25 transition-all text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Patient Avatar */}
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-secondary/15 border border-secondary/25 shrink-0 flex items-center justify-center text-secondary">
                              {patient.avatar?.url ? (
                                <Image
                                  src={patient.avatar.url}
                                  alt={patient.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <Users className="w-5 h-5 text-secondary" />
                              )}
                            </div>

                            {/* Patient Details */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-foreground group-hover:text-secondary transition-colors truncate">
                                  {patient.name}
                                </p>
                                <span
                                  className={cn(
                                    'text-[9px] font-bold px-1.5 py-0.2 rounded-full',
                                    patient.isReleased
                                      ? 'bg-muted text-muted-foreground'
                                      : 'bg-success/15 text-success'
                                  )}
                                >
                                  {patient.isReleased ? 'Released' : 'Under Care'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5 truncate">
                                <span className="font-semibold text-warning/90 bg-warning/10 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <HeartPulse className="w-2.5 h-2.5" />
                                  {patient.condition}
                                </span>
                                {patient.doctorName && (
                                  <span className="truncate">
                                    {patient.doctorName.startsWith('Dr.')
                                      ? patient.doctorName
                                      : `Dr. ${patient.doctorName}`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>View</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer help tip */}
          <div className="p-2.5 px-4 border-t border-border/60 bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Click any result to open dossier</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/60 font-mono text-[9px]">
              ESC to close
            </kbd>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarGlobalSearch;
