
import React from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-sm -translate-x-1/2 transform rounded-lg bg-gray-800 text-sm text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 invisible group-hover:visible">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
