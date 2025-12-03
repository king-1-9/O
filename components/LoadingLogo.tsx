import React from 'react';
import { LOGO_URL } from '../constants';

const LoadingLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <img 
        src={LOGO_URL} 
        alt="Loading..." 
        className="h-20 w-auto object-contain animate-logo-glow"
      />
    </div>
  );
};

export default LoadingLogo;