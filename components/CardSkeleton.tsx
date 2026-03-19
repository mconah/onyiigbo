import React from 'react';

interface CardSkeletonProps {
  count?: number;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 3 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {skeletons.map((idx) => (
        <div key={idx} className="animate-pulse bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl overflow-hidden flex flex-col min-h-[16rem]">
          {/* Top image or colored banner simulation */}
          <div className="h-32 bg-gray-200/60 w-full" />
          
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex gap-4 items-center mb-4">
              <div className="h-10 w-10 bg-gray-300 rounded-full shrink-0" />
              <div className="space-y-2 w-full">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-3 mt-auto">
              <div className="h-3 bg-gray-300 rounded w-full" />
              <div className="h-3 bg-gray-300 rounded w-5/6" />
              <div className="h-3 bg-gray-300 rounded w-4/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
