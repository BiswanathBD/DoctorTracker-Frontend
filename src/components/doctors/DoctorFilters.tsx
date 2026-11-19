'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { Select } from '@/components/ui/Select';
import { DateRangeFilter } from '@/components/common/DateRangeFilter';
import {
  SlidersHorizontal,
  Search,
  Loader2,
  X,
  HeartPulse,
  Building2,
  ArrowUpDown,
  Filter,
  Calendar,
} from 'lucide-react';

export interface DoctorFiltersProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  debouncedSearch: string;
  isDebouncing: boolean;
  specialization: string;
  setSpecialization: (val: string) => void;
  specializationsList: string[];
  hospital: string;
  setHospital: (val: string) => void;
  hospitalsList: string[];
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  sortValue: string;
  setSortValue: (val: string) => void;
  total: number;
  loading: boolean;
  loadingFilters: boolean;
  onResetFilters: () => void;
  setPage: (page: number | ((prev: number) => number)) => void;
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  searchInput,
  setSearchInput,
  debouncedSearch,
  isDebouncing,
  specialization,
  setSpecialization,
  specializationsList,
  hospital,
  setHospital,
  hospitalsList,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortValue,
  setSortValue,
  total,
  loading,
  loadingFilters,
  onResetFilters,
  setPage,
}) => {
  const hasActiveFilters = Boolean(
    debouncedSearch ||
      specialization ||
      hospital ||
      startDate ||
      endDate ||
      sortValue !== 'createdAt-desc'
  );

  return (
    <Card className="p-4 sm:p-5 space-y-4 overflow-visible relative z-10 shadow-lg border border-border/80 bg-card/85 backdrop-blur-xl">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />

      {/* header, title and top-row search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border/50">
        {/* title & count */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-foreground">Directory Search & Filters</span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
            {loading ? 'Searching...' : `${total} ${total === 1 ? 'Doctor' : 'Doctors'} Found`}
          </span>
          {loadingFilters && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              Syncing database...
            </span>
          )}
        </div>

        {/* search input side-by-side with title */}
        <div className="flex items-center gap-2.5 w-full md:w-auto md:max-w-md md:flex-1 md:justify-end">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              {isDebouncing ? (
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5 text-primary" />
              )}
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by doctor name, specialization, hospital..."
              className="w-full h-10 pl-9 pr-9 text-xs rounded-2xl border border-border/80 bg-card text-foreground placeholder:text-muted-foreground/60 outline-none hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all shadow-2xs font-medium"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* filter grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-9 gap-3">
        {/* specialization */}
        <div className="lg:col-span-2">
          <Select
            value={specialization}
            onChange={(val) => {
              setSpecialization(val);
              setPage(1);
            }}
            options={[
              { label: 'All Specializations', value: '' },
              ...specializationsList.map((spec) => ({
                label: spec,
                value: spec,
                icon: <HeartPulse className="w-3 h-3 text-primary" />,
              })),
            ]}
            placeholder={
              specializationsList.length > 0
                ? `Specialization (${specializationsList.length})`
                : 'All Specializations'
            }
            icon={<HeartPulse className="w-3.5 h-3.5 text-primary" />}
            clearable
          />
        </div>

        {/* hospital (expanded width for long hospital names) */}
        <div className="lg:col-span-3">
          <Select
            value={hospital}
            onChange={(val) => {
              setHospital(val);
              setPage(1);
            }}
            options={[
              { label: 'All Hospitals', value: '' },
              ...hospitalsList.map((hosp) => ({
                label: hosp,
                value: hosp,
                icon: <Building2 className="w-3.5 h-3.5 text-primary" />,
              })),
            ]}
            placeholder={
              hospitalsList.length > 0
                ? `Hospital (${hospitalsList.length})`
                : 'All Hospitals'
            }
            icon={<Building2 className="w-3.5 h-3.5 text-primary" />}
            clearable
          />
        </div>

        {/* date range */}
        <div className="lg:col-span-2">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            label="Registration Date"
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
              setPage(1);
            }}
          />
        </div>

        {/* sort */}
        <div className="lg:col-span-2">
          <Select
            value={sortValue}
            onChange={(val) => {
              setSortValue(val || 'createdAt-desc');
              setPage(1);
            }}
            options={[
              { label: 'Newest Registered', value: 'createdAt-desc' },
              { label: 'Oldest Registered', value: 'createdAt-asc' },
              { label: 'Name (A → Z)', value: 'name-asc' },
              { label: 'Name (Z → A)', value: 'name-desc' },
              { label: 'Specialization (A → Z)', value: 'specialization-asc' },
              { label: 'Hospital (A → Z)', value: 'hospital-asc' },
            ]}
            placeholder="Sort By..."
            icon={<ArrowUpDown className="w-3.5 h-3.5 text-primary" />}
          />
        </div>
      </div>

      {/* active filter chips */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-primary" />
              Filters:
            </span>

            {debouncedSearch && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-[11px] transition-colors cursor-pointer group"
              >
                <span>Search: &ldquo;{debouncedSearch}&rdquo;</span>
                <X className="w-3 h-3 group-hover:scale-110" />
              </button>
            )}

            {specialization && (
              <button
                type="button"
                onClick={() => setSpecialization('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-[11px] transition-colors cursor-pointer group"
              >
                <span>Spec: {specialization}</span>
                <X className="w-3 h-3 group-hover:scale-110" />
              </button>
            )}

            {hospital && (
              <button
                type="button"
                onClick={() => setHospital('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-[11px] transition-colors cursor-pointer group border border-border"
              >
                <span>Hosp: {hospital}</span>
                <X className="w-3 h-3 group-hover:scale-110" />
              </button>
            )}

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setPage(1);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-[11px] transition-colors cursor-pointer group border border-primary/20"
              >
                <Calendar className="w-3 h-3 text-primary" />
                <span>
                  Date:{' '}
                  {startDate && endDate
                    ? startDate === endDate
                      ? startDate
                      : `${startDate} → ${endDate}`
                    : startDate
                    ? `From ${startDate}`
                    : `Until ${endDate}`}
                </span>
                <X className="w-3 h-3 group-hover:scale-110" />
              </button>
            )}

            {sortValue !== 'createdAt-desc' && (
              <button
                type="button"
                onClick={() => setSortValue('createdAt-desc')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-[11px] transition-colors cursor-pointer group"
              >
                <span>
                  Sort:{' '}
                  {sortValue === 'createdAt-asc'
                    ? 'Oldest'
                    : sortValue === 'name-asc'
                    ? 'Name A-Z'
                    : sortValue === 'name-desc'
                    ? 'Name Z-A'
                    : sortValue === 'specialization-asc'
                    ? 'Spec A-Z'
                    : 'Hospital A-Z'}
                </span>
                <X className="w-3 h-3 group-hover:scale-110" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="text-primary hover:underline font-bold text-xs cursor-pointer ml-auto shrink-0"
          >
            Clear all
          </button>
        </div>
      )}
    </Card>
  );
};
