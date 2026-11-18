'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, Search } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  variant?: 'primary' | 'secondary';
  placement?: 'auto' | 'top' | 'bottom';
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  searchPlaceholder,
  className = '',
  triggerClassName = '',
  icon,
  disabled = false,
  clearable = false,
  searchable = true,
  variant = 'primary',
  placement = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [maxHeight, setMaxHeight] = useState(260);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isSecondary = variant === 'secondary';

  // normalize options to SelectOption[]
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  // find selected option
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // filter options by search query
  const query = searchQuery.toLowerCase().trim();
  const filteredOptions = !query
    ? normalizedOptions
    : normalizedOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(query) ||
          opt.value.toLowerCase().includes(query)
      );

  // calculate placement and maximum available height
  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = viewportHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;

    const preferUpward =
      placement === 'top' ||
      (placement !== 'bottom' && spaceBelow < 300 && spaceAbove > spaceBelow);

    setOpenUpward(preferUpward);

    const availableSpace = preferUpward ? spaceAbove : spaceBelow;
    setMaxHeight(Math.max(140, Math.min(260, availableSpace)));
  };

  // calculate placement when opening
  const handleToggleOpen = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePosition();
      setSearchQuery('');
      const selectedIdx = normalizedOptions.findIndex((opt) => opt.value === value);
      setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
    } else {
      setSearchQuery('');
      setActiveIndex(-1);
    }
    setIsOpen((prev) => !prev);
  };

  // focus search input when opened
  useEffect(() => {
    if (isOpen && searchable) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  // auto scroll active option into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  // close on click outside or escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setActiveIndex(-1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // handle selection
  const handleSelect = (val: string) => {
    onChange(val);
    setSearchQuery('');
    setIsOpen(false);
  };

  // handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
    setIsOpen(false);
  };

  // handle keyboard navigation inside search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filteredOptions.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        setActiveIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
        handleSelect(filteredOptions[activeIndex].value);
      } else if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0].value);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  // handle keyboard trigger opening
  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        handleToggleOpen();
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${isOpen ? 'z-50' : 'z-10'} ${className}`}>
      {/* trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggleOpen}
        onKeyDown={handleTriggerKeyDown}
        className={`w-full h-10 flex items-center justify-between gap-2 px-3.5 text-xs font-medium rounded-2xl border transition-all select-none cursor-pointer text-left ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-muted/30 border-border text-muted-foreground'
            : isOpen
            ? isSecondary
              ? 'border-secondary ring-2 ring-secondary/15 bg-card text-foreground shadow-xs'
              : 'border-primary ring-2 ring-primary/15 bg-card text-foreground shadow-xs'
            : isSecondary
            ? 'border-border/80 bg-card text-foreground hover:bg-muted/40 hover:border-secondary/50'
            : 'border-border/80 bg-card text-foreground hover:bg-muted/40 hover:border-primary/50'
        } ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
          {selectedOption ? (
            <span className="truncate text-foreground font-semibold">
              {selectedOption.label}
            </span>
          ) : (
            <span className="truncate text-muted-foreground/70">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {clearable && value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? (isSecondary ? 'rotate-180 text-secondary' : 'rotate-180 text-primary') : ''
            }`}
          />
        </div>
      </button>

      {/* dropdown popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 4 : -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: `${maxHeight}px` }}
            className={`absolute left-0 right-0 ${
              openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            } z-50 rounded-2xl border border-border bg-card/98 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col`}
          >
            {/* search input header (shadcn / heroui style) */}
            {searchable && (
              <div className="p-2 border-b border-border/70 bg-card shrink-0">
                <div className="relative flex items-center">
                  <Search
                    className={`w-3.5 h-3.5 absolute left-2.5 pointer-events-none transition-colors ${
                      isSecondary ? 'text-secondary/70' : 'text-primary/70'
                    }`}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={searchPlaceholder || 'Search options...'}
                    className={`w-full bg-muted/50 text-foreground text-xs rounded-xl pl-8 pr-7 py-1.5 outline-none placeholder:text-muted-foreground/60 border border-transparent transition-all ${
                      isSecondary
                        ? 'focus:border-secondary/40 focus:bg-card'
                        : 'focus:border-primary/40 focus:bg-card'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => {
                        setSearchQuery('');
                        setActiveIndex(0);
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-2 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* options list */}
            <div
              ref={listRef}
              className="p-1.5 overflow-y-auto flex-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-0.5"
            >
              {filteredOptions.length === 0 ? (
                <div className="py-6 px-3 text-center text-xs text-muted-foreground space-y-1">
                  <Search className="w-4 h-4 mx-auto text-muted-foreground/40" />
                  <p className="font-semibold text-foreground/80">No options found</p>
                  {searchQuery && (
                    <p className="text-[11px] text-muted-foreground truncate">
                      No match for &ldquo;{searchQuery}&rdquo;
                    </p>
                  )}
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isActive = idx === activeIndex;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer text-left ${
                        isSelected
                          ? isSecondary
                            ? 'bg-secondary/10 text-secondary font-bold'
                            : 'bg-primary/10 text-primary font-bold'
                          : isActive
                          ? isSecondary
                            ? 'bg-secondary/15 text-foreground font-medium'
                            : 'bg-primary/15 text-foreground font-medium'
                          : 'text-foreground hover:bg-muted/70 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 shrink-0 ml-2 ${
                            isSecondary ? 'text-secondary' : 'text-primary'
                          }`}
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
