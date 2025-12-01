import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-12" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 300 130" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-auto h-full overflow-visible"
        aria-label="Lab4 Logo"
      >
        {/* Background Shape: Extended significantly to the left (negative control points implied by curve) */}
        <path 
          d="M 90 10 C 190 10 280 40 280 65 C 280 90 190 120 90 120 C 0 120 0 10 90 10 Z" 
          fill="#8000FF" 
        />
        
        {/* 'lab' text - Positioned inside the widened shape */}
        <text 
          x="35" 
          y="90" 
          fontFamily="'Times New Roman', serif" 
          fontWeight="900" 
          fontSize="85" 
          fill="white" 
          letterSpacing="-4"
        >
          lab
        </text>
        
        {/* '4' text - Pink and bold */}
        <text 
          x="165" 
          y="90" 
          fontFamily="Arial, sans-serif" 
          fontWeight="900" 
          fontSize="85" 
          fill="#FF2E63"
        >
          4
        </text>
      </svg>
    </div>
  );
};