'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon, ChevronDown, X, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';

export interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  label?: string;
  title?: string;
  className?: string;
}

// parse and format dates
const toIsoDateString = (d?: Date): string => {
  if (!d || isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseIsoDate = (str: string): Date | undefined => {
  if (!str) return undefined;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
};

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onChange,
  label = 'Date Range',
  title,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // temporary calendar range
  const [range, setRange] = useState<DateRange | undefined>(() => ({
    from: parseIsoDate(startDate),
    to: parseIsoDate(endDate),
  }));

  const handleToggle = () => {
    if (!isOpen) {
      setRange({
        from: parseIsoDate(startDate),
        to: parseIsoDate(endDate),
      });
    }
    setIsOpen(!isOpen);
  };

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const hasActiveDate = Boolean(startDate || endDate);

  // format display label
  const getDisplayLabel = () => {
    if (!startDate && !endDate) return label;

    const formatShort = (isoStr: string) => {
      const d = parseIsoDate(isoStr);
      if (!d) return isoStr;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    if (startDate && endDate) {
      if (startDate === endDate) return formatShort(startDate);
      return `${formatShort(startDate)} – ${formatShort(endDate)}`;
    }
    if (startDate) return `From ${formatShort(startDate)}`;
    return `Until ${formatShort(endDate)}`;
  };

  // quick presets
  const handlePreset = (preset: 'today' | '7days' | '30days' | 'thisMonth') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let from: Date = today;
    const to: Date = today;

    if (preset === 'today') {
      from = today;
    } else if (preset === '7days') {
      from = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    } else if (preset === '30days') {
      from = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
    } else if (preset === 'thisMonth') {
      from = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    setRange({ from, to });
    onChange(toIsoDateString(from), toIsoDateString(to));
    setIsOpen(false);
  };

  // apply selected range
  const handleApply = () => {
    const fromStr = toIsoDateString(range?.from);
    const toStr = toIsoDateString(range?.to || range?.from);
    onChange(fromStr, toStr);
    setIsOpen(false);
  };

  // clear range
  const handleClear = () => {
    setRange(undefined);
    onChange('', '');
    setIsOpen(false);
  };

  // reset or cancel picker
  const handleResetCancel = () => {
    if (
      hasActiveDate &&
      toIsoDateString(range?.from) === startDate &&
      toIsoDateString(range?.to) === endDate
    ) {
      handleClear();
    } else {
      setRange({
        from: parseIsoDate(startDate),
        to: parseIsoDate(endDate),
      });
      setIsOpen(false);
    }
  };

  const headerTitle =
    title ||
    (label.toLowerCase().includes('date') ? `${label} Range` : `${label} Date Range`);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* trigger field */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={`w-full h-10 px-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer select-none ${
          hasActiveDate
            ? 'bg-primary/10 border-primary/60 text-primary font-semibold shadow-2xs'
            : 'bg-card border-border/80 text-foreground hover:border-primary/50'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          <CalendarIcon
            className={`w-3.5 h-3.5 shrink-0 ${
              hasActiveDate ? 'text-primary' : 'text-muted-foreground'
            }`}
          />
          <span className="truncate">{getDisplayLabel()}</span>
        </div>

        {hasActiveDate ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="p-1 rounded-full hover:bg-primary/20 text-primary transition-colors cursor-pointer shrink-0"
            title="Clear date filter"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        ) : (
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        )}
      </div>

      {/* calendar popover */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 rounded-3xl bg-card border border-border shadow-2xl p-4 z-50 space-y-3 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150 max-w-[calc(100vw-2rem)]">
          {/* popover header */}
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-primary" />
              {headerTitle}
            </span>
          </div>

          {/* side by side layout */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3.5">
            {/* calendar */}
            <div className="flex-1 flex justify-center">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                disabled={{ after: new Date() }}
                endMonth={new Date()}
                className="rounded-2xl border border-border/60 bg-muted/20"
              />
            </div>

            <div className="w-px bg-border/60 hidden sm:block self-stretch" />

            {/* presets and actions */}
            <div className="flex flex-col justify-between w-full sm:w-40 shrink-0 border-t sm:border-t-0 border-border/60 pt-3 sm:pt-0">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Quick Presets
                </span>
                <div className="flex flex-col gap-1.5 [&_button]:w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreset('today')}
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreset('7days')}
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreset('30days')}
                  >
                    Last 30 Days
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreset('thisMonth')}
                  >
                    This Month
                  </Button>
                </div>
              </div>

              {/* action buttons */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-1.5 mt-3">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  capsule={false}
                  onClick={handleResetCancel}
                  title="Cancel & Reset"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleApply}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
