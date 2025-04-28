import React from 'react';

interface DinoLogoProps {
  size?: number;
  className?: string;
}

const DinoLogo: React.FC<DinoLogoProps> = ({ size = 24, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
        fill="currentColor" 
      />
      <path 
        d="M7 10C7.55228 10 8 9.55228 8 9C8 8.44772 7.55228 8 7 8C6.44772 8 6 8.44772 6 9C6 9.55228 6.44772 10 7 10Z" 
        fill="white" 
      />
      <path 
        d="M15 7H17V10H15V7Z" 
        fill="white" 
      />
      <path 
        d="M8 14L10 17H14L16 14V12H8V14Z" 
        fill="white" 
      />
    </svg>
  );
};

export default DinoLogo;