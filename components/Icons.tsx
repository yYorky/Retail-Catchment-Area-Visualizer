
import React from 'react';

export const SpinnerIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`animate-spin ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const WalkIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.5 5.5A2 2 0 0 0 10 7.5v0a2 2 0 0 0 2.5 2"/>
    <path d="M17.5 5.5A2 2 0 0 1 20 7.5v0a2 2 0 0 1-2.5 2"/>
    <path d="M15 9.5a2 2 0 0 0-2.5 2v4.5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V11.5a2 2 0 0 0-1.5-2Z"/>
    <path d="M10 9.5a2 2 0 0 1 2.5 2v4.5a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V11.5a2 2 0 0 1 1.5-2Z"/>
    <path d="M4 18a1 1 0 0 0 1.8 0L7 13l2 2 2.5-5"/>
    <path d="m9 16.5 2-2 2.5 2.5"/>
  </svg>
);

export const CarIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
    <path d="M7 17a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/>
    <path d="M19 17a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/>
    <path d="M14 17H9"/>
    <path d="M16.5 10.5 15 7H7l-2 3.5"/>
  </svg>
);

export const TransitIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/>
    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/>
    <path d="M12 12a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/>
  </svg>
);

export const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/>
  </svg>
);
