import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="60"
      height="40"
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-foreground', className)}
      {...props}
    >
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(45, 90%, 75%)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');`}
      </style>
      <text
        x="0"
        y="30"
        fontFamily="'Playfair Display', serif"
        fontSize="36"
        fontWeight="700"
        fill="url(#gold-gradient)"
      >
        EO
      </text>
    </svg>
  );
}
