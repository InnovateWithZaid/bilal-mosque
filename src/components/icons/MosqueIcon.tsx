import React from 'react';

interface MosqueIconProps {
  size?: number;
  className?: string;
}

const MosqueIcon: React.FC<MosqueIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left minaret */}
      <rect x="2" y="10" width="3" height="12" rx="0.5" />
      <path d="M3.5 10 L3.5 8 L3.5 7" />
      <circle cx="3.5" cy="6.5" r="0.8" fill="currentColor" />
      
      {/* Right minaret */}
      <rect x="19" y="10" width="3" height="12" rx="0.5" />
      <path d="M20.5 10 L20.5 8 L20.5 7" />
      <circle cx="20.5" cy="6.5" r="0.8" fill="currentColor" />
      
      {/* Main dome */}
      <path d="M7 22 L7 14 Q12 6 17 14 L17 22" />
      
      {/* Dome crescent */}
      <path d="M12 8 L12 6" />
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      
      {/* Door */}
      <path d="M10 22 L10 18 Q12 16 14 18 L14 22" />
      
      {/* Base */}
      <line x1="1" y1="22" x2="23" y2="22" />
    </svg>
  );
};

export default MosqueIcon;
