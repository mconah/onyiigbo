import React from 'react';

const PageSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse min-h-[50vh] flex flex-col items-center justify-start w-full pt-12 px-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header Block */}
        <div className="h-12 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl w-1/3 shadow-sm" />
        
        {/* Content Block */}
        <div className="space-y-4">
          <div className="h-4 bg-white/60 backdrop-blur-md rounded-xl w-3/4" />
          <div className="h-4 bg-white/60 backdrop-blur-md rounded-xl w-full" />
          <div className="h-4 bg-white/60 backdrop-blur-md rounded-xl w-5/6" />
        </div>
        
        {/* Grid Block for items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="h-48 bg-white/60 backdrop-blur-md border border-white/50 rounded-[24px] shadow-sm" />
          <div className="h-48 bg-white/60 backdrop-blur-md border border-white/50 rounded-[24px] shadow-sm" />
          <div className="h-48 bg-white/60 backdrop-blur-md border border-white/50 rounded-[24px] shadow-sm" />
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
