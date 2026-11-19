'use client';

import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { Check, Trash2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastCardProps {
  id: string | number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

export const ToastCard: React.FC<ToastCardProps> = ({ id, type, title, description }) => {
  const config = {
    success: {
      container: 'bg-card text-success shadow-lg',
      iconColor: 'text-success',
      icon: <Check className="w-6 h-6 stroke-[2.5] mr-1 ml-2" />,
      bodyBg: 'bg-success text-success-foreground',
    },
    error: {
      container: 'bg-card text-destructive shadow-lg',
      iconColor: 'text-destructive',
      icon: <Trash2 className="w-6 h-6 stroke-[2.5] mr-1 ml-2" />,
      bodyBg: 'bg-destructive text-destructive-foreground',
    },
    info: {
      container: 'bg-card text-primary shadow-lg',
      iconColor: 'text-primary',
      icon: <Info className="w-6 h-6 stroke-[2.5] mr-1 ml-2" />,
      bodyBg: 'bg-primary text-primary-foreground',
    },
    warning: {
      container: 'bg-card text-warning shadow-lg',
      iconColor: 'text-warning',
      icon: <AlertTriangle className="w-6 h-6 stroke-[2.5] mr-1 ml-2" />,
      bodyBg: 'bg-warning text-warning-foreground',
    },
  }[type];

  return (
    <div
      className={cn(
        'group inline-flex items-stretch w-full sm:min-w-85 max-w-md rounded-full p-0 overflow-hidden select-none transition-all shadow-xl backdrop-blur-md',
        config.container
      )}
    >
      {/* 1. Left Icon Section (container background with colored icon) */}
      <div
        className={cn(
          'flex items-center justify-center shrink-0 transition-colors p-3.5',
          config.iconColor
        )}
      >
        {config.icon}
      </div>

      {/* 2. Right Text Section (solid colored background with white text) */}
      <div
        className={cn(
          'flex-1 flex items-center justify-between gap-3 px-4 py-2.5 sm:py-3 min-w-0 transition-colors font-medium',
          config.bodyBg
        )}
      >
        <div className="min-w-0 flex-1 space-y-0.5">
          <h4 className="text-xs sm:text-sm font-bold tracking-tight truncate leading-tight text-white">
            {title}
          </h4>
          {description && (
            <p className="text-[11px] sm:text-xs leading-snug truncate font-medium text-white/90">
              {description}
            </p>
          )}
        </div>

        {/* 3. Dismiss Button */}
        <button
          type="button"
          onClick={() => sonnerToast.dismiss(id)}
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white/80 hover:text-white hover:bg-black/15 transition-colors cursor-pointer"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

type ToastOptions = string | { description?: string } | undefined;

const parseDescription = (options?: ToastOptions): string | undefined => {
  if (typeof options === 'string') return options;
  if (typeof options === 'object' && options?.description) return options.description;
  return undefined;
};

// modern stylish toast triggers matching capsule button design
export const toast = {
  success: (title: string, options?: ToastOptions) => {
    const description = parseDescription(options);
    sonnerToast.custom((id) => (
      <ToastCard id={id} type="success" title={title} description={description} />
    ));
  },
  error: (title: string, options?: ToastOptions) => {
    const description = parseDescription(options);
    sonnerToast.custom((id) => (
      <ToastCard id={id} type="error" title={title} description={description} />
    ));
  },
  info: (title: string, options?: ToastOptions) => {
    const description = parseDescription(options);
    sonnerToast.custom((id) => (
      <ToastCard id={id} type="info" title={title} description={description} />
    ));
  },
  warning: (title: string, options?: ToastOptions) => {
    const description = parseDescription(options);
    sonnerToast.custom((id) => (
      <ToastCard id={id} type="warning" title={title} description={description} />
    ));
  },
};

export default toast;
