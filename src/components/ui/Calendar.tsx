'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-day-picker/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// reusable calendar component
export function Calendar({
  className = '',
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className={`p-2 select-none calendar-themed relative ${className}`}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        components={{
          Chevron: ({ orientation }) =>
            orientation === 'left' ? (
              <ChevronLeft className="w-4 h-4 text-primary" />
            ) : (
              <ChevronRight className="w-4 h-4 text-primary" />
            ),
        }}
        styles={{
          nav: {
            position: 'absolute',
            top: '0.25rem',
            left: 0,
            right: 0,
            width: '100%',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
            pointerEvents: 'none',
            zIndex: 10,
          },
        }}
        classNames={{
          root: 'rdp-root text-foreground relative',
          month: 'space-y-3',
          month_caption: 'flex justify-center h-8 relative items-center mb-1',
          caption_label: 'text-xs font-bold text-foreground',
          nav: 'rdp-nav',
          button_previous:
            'pointer-events-auto h-7 w-7 rounded-xl bg-card border border-border/80 hover:bg-muted text-foreground flex items-center justify-center transition-colors cursor-pointer shadow-2xs disabled:opacity-30 disabled:pointer-events-none',
          button_next:
            'pointer-events-auto h-7 w-7 rounded-xl bg-card border border-border/80 hover:bg-muted text-foreground flex items-center justify-center transition-colors cursor-pointer shadow-2xs disabled:opacity-30 disabled:pointer-events-none',
          month_grid: 'mt-4 w-full border-collapse space-y-1',
          weekdays: 'flex justify-between',
          weekday:
            'text-muted-foreground rounded-md w-8 font-semibold text-[10px] text-center uppercase tracking-wider',
          week: 'flex justify-between mt-1',
          day: 'h-8 w-8 text-center text-xs p-0 relative flex items-center justify-center',
          day_button:
            'h-8 w-8 p-0 font-medium rounded-xl hover:bg-primary/15 hover:text-primary transition-all flex items-center justify-center cursor-pointer text-xs',
          range_start:
            'rounded-l-xl bg-primary text-primary-foreground font-bold hover:bg-primary hover:text-primary-foreground',
          range_end:
            'rounded-r-xl bg-primary text-primary-foreground font-bold hover:bg-primary hover:text-primary-foreground',
          range_middle: 'bg-primary/15 text-primary rounded-none font-semibold hover:bg-primary/20',
          selected:
            'bg-primary text-primary-foreground font-bold hover:bg-primary hover:text-primary-foreground',
          today: 'font-bold text-primary underline underline-offset-4',
          outside: 'text-muted-foreground/30 opacity-40',
          disabled:
            'text-muted-foreground/25 opacity-25 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground/25 pointer-events-none',
          hidden: 'invisible',
          ...classNames,
        }}
        {...props}
      />
    </div>
  );
}
