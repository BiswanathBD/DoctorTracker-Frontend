'use client';

import React from 'react';
import { Card, Button } from '@/components/ui';
import { Select } from '@/components/ui/Select';
import { DateRangeFilter } from '@/components/common/DateRangeFilter';
import type { Doctor } from '@/server/doctor.service';
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  Loader2,
  X,
  HeartPulse,
  Stethoscope,
  Users,
  ArrowUpDown,
  Filter,
  Calendar,
} from 'lucide-react';

export interface PatientFiltersProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  debouncedSearch: string;
  isDebouncing: boolean;
  condition: string;
  setCondition: (val: string) => void;
  conditionsList: string[];
  doctorId: string;
  setDoctorId: (val: string) => void;
  doctorsList: Doctor[];
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  sortValue: string;
  setSortValue: (val: string) => void;
  total: number;
  loading: boolean;
  loadingFilters: boolean;
  onResetFilters: () => void;
  setPage: (page: number | ((prev: number) => number)) => void;
}

export const PatientFilters: React.FC<PatientFiltersProps> = ({
  searchInput,
  setSearchInput,
  debouncedSearch,
  isDebouncing,
  condition,
  setCondition,
  conditionsList,
  doctorId,
  setDoctorId,
  doctorsList,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  gender,
  setGender,
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
      condition ||
      doctorId ||
      gender ||
      startDate ||
      endDate ||
      sortValue !== 'createdAt-desc'
  );

  return (
    <Card className="p-4 sm:p-5 space-y-4 overflow-visible relative z-30 shadow-lg border border-border/80 bg-card/85 backdrop-blur-xl">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-secondary/10 blur-2xl" />

      {/* header and summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-border/50">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-foreground">Directory Search & Filters</span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
            {loading ? 'Searching...' : `${total} ${total === 1 ? 'Patient' : 'Patients'} Found`}
          </span>
          {loadingFilters && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin text-secondary" />
              Syncing database...
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<RotateCcw className="w-3 h-3" />}
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* filter controls grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* search input */}
        <div className="lg:col-span-3 relative">
          <div className="relative flex items-center w-full h-10 rounded-2xl border border-border/80 bg-card transition-all hover:border-secondary/50 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/15">
            <div className="pl-3.5 pr-2 flex items-center justify-center text-muted-foreground pointer-events-none">
              {isDebouncing ? (
                <Loader2 className="w-3.5 h-3.5 text-secondary animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5 text-secondary" />
              )}
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by patient, condition, phone..."
              className="w-full h-full pr-8 text-xs bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none font-medium"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* condition select */}
        <div className="lg:col-span-2">
          <Select
            value={condition}
            onChange={(val) => {
              setCondition(val);
              setPage(1);
            }}
            options={[
              { label: 'All Conditions', value: '' },
              ...conditionsList.map((cond) => ({
                label: cond,
                value: cond,
                icon: <HeartPulse className="w-3.5 h-3.5 text-secondary" />,
              })),
            ]}
            placeholder={
              conditionsList.length > 0
                ? `Condition (${conditionsList.length})`
                : 'All Conditions'
            }
            icon={<HeartPulse className="w-3.5 h-3.5 text-secondary" />}
            clearable
          />
        </div>

        {/* attending doctor select */}
        <div className="lg:col-span-2">
          <Select
            value={doctorId}
            onChange={(val) => {
              setDoctorId(val);
              setPage(1);
            }}
            options={[
              { label: 'All Doctors', value: '' },
              ...doctorsList.map((doc) => ({
                label: `${doc.name} (${doc.specialization})`,
                value: doc._id,
                icon: <Stethoscope className="w-3.5 h-3.5 text-primary" />,
              })),
            ]}
            placeholder={
              doctorsList.length > 0
                ? `Doctor (${doctorsList.length})`
                : 'All Doctors'
            }
            icon={<Stethoscope className="w-3.5 h-3.5 text-primary" />}
            clearable
          />
        </div>

        {/* admission date range filter */}
        <div className="lg:col-span-2">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            label="Admission Date"
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
              setPage(1);
            }}
          />
        </div>

        {/* gender select */}
        <div className="lg:col-span-1">
          <Select
            value={gender}
            onChange={(val) => {
              setGender(val);
              setPage(1);
            }}
            options={[
              { label: 'All', value: '' },
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' },
            ]}
            placeholder="Gender"
            icon={<Users className="w-3.5 h-3.5 text-muted-foreground" />}
            clearable
          />
        </div>

        {/* sort by select */}
        <div className="lg:col-span-2">
          <Select
            value={sortValue}
            onChange={(val) => {
              setSortValue(val || 'createdAt-desc');
              setPage(1);
            }}
            options={[
              { label: 'Newest Admitted', value: 'createdAt-desc' },
              { label: 'Oldest Admitted', value: 'createdAt-asc' },
              { label: 'Name (A → Z)', value: 'name-asc' },
              { label: 'Name (Z → A)', value: 'name-desc' },
              { label: 'Age (Youngest)', value: 'age-asc' },
              { label: 'Age (Oldest)', value: 'age-desc' },
              { label: 'Admission (Recent)', value: 'admissionDate-desc' },
              { label: 'Admission (Oldest)', value: 'admissionDate-asc' },
            ]}
            placeholder="Sort By..."
            icon={<ArrowUpDown className="w-3.5 h-3.5 text-secondary" />}
          />
        </div>
      </div>

      {/* active filter chips */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-secondary" />
              Filters:
            </span>

            {debouncedSearch && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-[11px] transition-colors cursor-pointer group"
              >
                <span>Search: &ldquo;{debouncedSearch}&rdquo;</span>
                <X className="w-3 h-3 group-hover:scale-110" />
              </button>
            )}

            {condition && (
              <button
                type="button"
                onClick={() => setCondition('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-[11px] transition-colors cursor-pointer group"
              >
                <HeartPulse className="w-3 h-3 text-secondary" />
                <span>{condition}</span>
                <X className="w-3 h-3 group-hover:scale-110" />
              </button>
            )}

            {doctorId && (
              <button
                type="button"
                onClick={() => setDoctorId('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-[11px] transition-colors cursor-pointer group"
              >
                <Stethoscope className="w-3 h-3" />
                <span>
                  {doctorsList.find((d) => d._id === doctorId)?.name || 'Specific Doctor'}
                </span>
                <X className="w-3 h-3 group-hover:scale-110" />
              </button>
            )}

            {gender && (
              <button
                type="button"
                onClick={() => setGender('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-[11px] transition-colors cursor-pointer group"
              >
                <span>{gender}</span>
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
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-[11px] transition-colors cursor-pointer group border border-secondary/20"
              >
                <Calendar className="w-3 h-3 text-secondary" />
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
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-[11px] transition-colors cursor-pointer group"
              >
                <ArrowUpDown className="w-3 h-3 text-secondary" />
                <span>Sorted</span>
                <X className="w-3 h-3 group-hover:scale-110" />
              </button>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </Card>
  );
};
