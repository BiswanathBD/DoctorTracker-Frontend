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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-medium rounded-xl border transition-all select-none cursor-pointer text-left ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-muted/30 border-border text-muted-foreground'
            : isOpen
            ? 'border-primary ring-4 ring-ring/15 bg-card text-foreground shadow-xs'
            : 'border-input bg-card text-foreground hover:bg-muted/40 hover:border-border'
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
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </div>
      </button>

      {/* dropdown popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-60 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-border bg-card/95 backdrop-blur-md p-1.5 shadow-2xl space-y-0.5"
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
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-foreground hover:bg-muted/70 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />}
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
