import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 40, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-xs' },
  };

  const { icon, text, sub } = sizeMap[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* emblem badge using theme gradients */}
      <div 
        style={{ width: icon, height: icon }}
        className="relative shrink-0 rounded-2xl bg-linear-to-br from-primary to-secondary p-2 shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200"
      >
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          {/* medical cross */}
          <rect x="16" y="8" width="8" height="24" rx="3" fill="#ffffff" opacity="0.95" />
          <rect x="8" y="16" width="24" height="8" rx="3" fill="#ffffff" opacity="0.95" />
          {/* ecg heartbeat line */}
          <path
            d="M6 20h8l2.5-6 5 12 3.5-8 2.5 3h6.5"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* tracker ping */}
          <circle cx="32" cy="8" r="3" fill="#38bdf8" />
          <circle cx="32" cy="8" r="5" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
        </svg>
      </div>

      {/* brand typography using theme tokens */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold text-foreground tracking-tight ${text}`}>
            Doctor<span className="text-primary">Tracker</span>
          </span>
          <span className={`font-semibold uppercase text-muted-foreground tracking-wider mt-1 ${sub}`}>
            Medical System
          </span>
        </div>
      )}
    </Link>
  );
};
