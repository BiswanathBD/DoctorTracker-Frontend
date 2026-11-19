import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  hideTextOnMobile?: boolean;
  size?: LogoSize;
  name?: string;
  tag?: string;
  href?: string;
}

const sizeMap: Record<LogoSize, { icon: number; title: string; tag: string }> = {
  sm: { icon: 34, title: 'text-base sm:text-lg', tag: 'text-[9px]' },
  md: { icon: 42, title: 'text-lg sm:text-xl', tag: 'text-[10px]' },
  lg: { icon: 52, title: 'text-xl sm:text-2xl', tag: 'text-xs' },
};

// standalone clean logo icon
export const LogoIcon: React.FC<{ size?: LogoSize | number; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const dimension = typeof size === 'number' ? size : sizeMap[size].icon;

  return (
    <Image
      src="/logo.svg"
      alt="Doctor Tracking"
      width={dimension}
      height={dimension}
      unoptimized
      priority
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
    />
  );
};

// standalone clean logo text (h1 title & subtitle tag)
export const LogoText: React.FC<{
  name?: string;
  tag?: string;
  size?: LogoSize;
  hideOnMobile?: boolean;
  className?: string;
}> = ({
  name = 'Doctor Tracking',
  tag = 'Doctor and Patient Directory',
  size = 'md',
  hideOnMobile = false,
  className = '',
}) => {
  const { title, tag: tagStyle } = sizeMap[size];
  const [firstWord, ...rest] = name.trim().split(' ');
  const restWord = rest.join(' ');

  const mobileDisplayClass = hideOnMobile ? 'hidden sm:flex' : 'flex';

  return (
    <div className={`${mobileDisplayClass} flex-col leading-none ${className}`}>
      <h1 className={`font-extrabold text-foreground tracking-tight leading-none ${title}`}>
        {firstWord || 'Doctor'}
        {restWord && (
          <span className="ml-1 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            {restWord}
          </span>
        )}
      </h1>
      {tag && (
        <p className={`font-semibold uppercase tracking-[0.14em] text-muted-foreground mt-1 ${tagStyle}`}>
          {tag}
        </p>
      )}
    </div>
  );
};

// main unified clean logo
export const Logo: React.FC<LogoProps> = ({
  className = '',
  showIcon = true,
  showText = true,
  hideTextOnMobile = true,
  size = 'md',
  name = 'Doctor Tracking',
  tag = 'Doctor and Patient Directory',
  href = '/',
}) => {
  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {showIcon && <LogoIcon size={size} />}
      {showText && (
        <LogoText
          name={name}
          tag={tag}
          size={size}
          hideOnMobile={hideTextOnMobile}
        />
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  ) : (
    content
  );
};
