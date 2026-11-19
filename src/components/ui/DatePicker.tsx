'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import type { Matcher } from 'react-day-picker';
import { Calendar } from '@/components/ui/Calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: Matcher | Matcher[];
  endMonth?: Date;
  startMonth?: Date;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onSelect,
  placeholder = 'Pick a date',
  disabled,
  endMonth,
  startMonth,
  className,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs hover:border-secondary/60 focus:outline-hidden focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all cursor-pointer shadow-2xs',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="truncate">
              {date ? format(date, 'PPP') : placeholder}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-1.5 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1.5 z-100 shadow-2xl rounded-2xl bg-card border border-border" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onSelect?.(selectedDate);
            setOpen(false);
          }}
          disabled={disabled}
          endMonth={endMonth}
          startMonth={startMonth}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
