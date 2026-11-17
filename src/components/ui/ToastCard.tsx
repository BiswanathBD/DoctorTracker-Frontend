'use client';

import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { Check, Trash2, Info, AlertTriangle, X } from 'lucide-react';

interface ToastCardProps {
  id: string | number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

export const ToastCard: React.FC<ToastCardProps> = ({ id, type, title, description }) => {
  const config = {
    success: {
      gradient: 'from-success/25 via-success/10 to-transparent',
      iconBox: 'bg-success/20 text-success border border-success/30 shadow-success/20',
      icon: <Check className="w-5 h-5 stroke-[2.5]" />,
      titleColor: 'text-card-foreground',
    },
    error: {
      gradient: 'from-destructive/30 via-destructive/10 to-transparent',
      iconBox: 'bg-destructive/20 text-destructive border border-destructive/30 shadow-destructive/20',
      icon: <Trash2 className="w-5 h-5 stroke-[2.2]" />,
      titleColor: 'text-destructive',
    },
    info: {
      gradient: 'from-primary/30 via-primary/10 to-transparent',
      iconBox: 'bg-primary/20 text-primary border border-primary/30 shadow-primary/20',
      icon: <Info className="w-5 h-5 stroke-[2.2]" />,
      titleColor: 'text-card-foreground',
    },
    warning: {
      gradient: 'from-warning/30 via-warning/10 to-transparent',
      iconBox: 'bg-warning/20 text-warning border border-warning/30 shadow-warning/20',
      icon: <AlertTriangle className="w-5 h-5 stroke-[2.2]" />,
      titleColor: 'text-warning',
    },
  }[type];

  return (
    <div className="relative w-full sm:min-w-[340px] max-w-sm rounded-[20px] p-3.5 pr-4 bg-card text-card-foreground border border-border shadow-2xl overflow-hidden backdrop-blur-xl flex items-center justify-between gap-3.5 transition-all">
      {/* ambient left glowing splash from the reference image */}
      <div
        className={`absolute -left-6 -top-6 -bottom-6 w-32 bg-gradient-to-r ${config.gradient} blur-xl pointer-events-none`}
      />

      {/* left iconic rounded badge */}
      <div
        className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${config.iconBox}`}
      >
        {config.icon}
      </div>

      {/* title & description text block */}
      <div className="relative z-10 flex-1 min-w-0 pr-1">
        <h4 className={`text-sm font-bold tracking-tight leading-snug ${config.titleColor}`}>
          {title}
        </h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed truncate">
            {description}
          </p>
        )}
      </div>

      {/* close button */}
      <button
        onClick={() => sonnerToast.dismiss(id)}
        className="relative z-10 p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted/80 rounded-xl transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

type ToastOptions = string | { description?: string } | undefined;

const parseDescription = (options?: ToastOptions): string | undefined => {
  if (typeof options === 'string') return options;
  if (typeof options === 'object' && options?.description) return options.description;
  return undefined;
};

// modern stylish toast triggers matching the reference image
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
