'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';

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
  className?: string;
  triggerClassName?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  clearable?: boolean;
  variant?: 'primary' | 'secondary';
  placement?: 'auto' | 'top' | 'bottom';
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  className = '',
  triggerClassName = '',
  icon,
  disabled = false,
  clearable = false,
  variant = 'primary',
  placement = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSecondary = variant === 'secondary';

  // calculate placement when opening
  const handleToggleOpen = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      if (placement === 'top') {
        setOpenUpward(true);
      } else if (placement === 'bottom') {
        setOpenUpward(false);
      } else {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        setOpenUpward(spaceBelow < 240 && spaceAbove > spaceBelow);
      }
    }
    setIsOpen((prev) => !prev);
  };

  // normalize options to SelectOption[]
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  // find selected option
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${isOpen ? 'z-50' : 'z-10'} ${className}`}>
      {/* trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggleOpen}
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
              className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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
            className={`absolute left-0 right-0 ${
              openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            } z-50 max-h-56 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-border bg-card/95 backdrop-blur-md p-1.5 shadow-2xl space-y-0.5`}
          >
            {normalizedOptions.length === 0 ? (
              <div className="py-3 px-3 text-center text-xs text-muted-foreground">
                No options available
              </div>
            ) : (
              normalizedOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer text-left ${
                      isSelected
                        ? isSecondary
                          ? 'bg-secondary/10 text-secondary font-bold'
                          : 'bg-primary/10 text-primary font-bold'
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
