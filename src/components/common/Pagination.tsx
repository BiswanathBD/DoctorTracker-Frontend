'use client';

import React from 'react';
import { Card } from '@/components/ui';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  itemName?: string;
  variant?: 'primary' | 'secondary';
  hideOnSinglePage?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 9,
  itemName = 'records',
  variant = 'primary',
  hideOnSinglePage = true,
  className = '',
}) => {
  // hide pagination if single page or empty
  if (hideOnSinglePage && totalPages <= 1) {
    return null;
  }

  // calculate display ranges
  const safeTotal = totalItems ?? totalPages * pageSize;
  const from = safeTotal === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, safeTotal);

  // generate page number list with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, '…', totalPages];
    }
    if (page >= totalPages - 2) {
      return [1, '…', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '…', page - 1, page, page + 1, '…', totalPages];
  };

  const pages = getPageNumbers();
  const isSecondary = variant === 'secondary';

  const dotColor = isSecondary ? 'bg-secondary' : 'bg-primary';
  const activePageStyle = isSecondary
    ? 'bg-secondary text-secondary-foreground shadow-md shadow-secondary/25 scale-105'
    : 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105';
  const navHoverBorder = isSecondary
    ? 'hover:border-secondary/50'
    : 'hover:border-primary/50';

  return (
    <Card
      className={`p-3.5 sm:p-4.5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground bg-card/85 backdrop-blur-xl border border-border/80 shadow-md rounded-3xl ${className}`}
    >
      {/* counter indicator */}
      <div className="flex items-center gap-2">
        <span className={`flex h-2 w-2 rounded-full ${dotColor} animate-pulse`} />
        <p className="font-medium text-muted-foreground">
          Showing <strong className="text-foreground font-bold">{from}</strong> to{' '}
          <strong className="text-foreground font-bold">{to}</strong> of{' '}
          <strong className="text-foreground font-bold">{safeTotal}</strong> {itemName}
        </p>
      </div>

      {/* navigation controls */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* first page jump */}
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* previous page */}
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/70 ${navHoverBorder} text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs transition-all cursor-pointer`}
          title="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* page number buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) =>
            typeof p === 'number' ? (
              <button
                key={idx}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  p === page
                    ? activePageStyle
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-xs text-muted-foreground select-none">
                {p}
              </span>
            )
          )}
        </div>

        {/* next page */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/70 ${navHoverBorder} text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs transition-all cursor-pointer`}
          title="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* last page jump */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
};
