
import React from 'react';

interface TerpeneTotalProps {
  totalPercentage: string;
}

const TerpeneTotal: React.FC<TerpeneTotalProps> = ({ totalPercentage }) => {
  return (
    <div className="flex justify-between items-center mb-4 relative z-10">
      <h4 className="text-base md:text-lg font-semibold bg-background/80 px-2 py-1 rounded-md border border-border/40 shadow-sm">Terpene</h4>
      <span className="text-base md:text-lg font-semibold bg-background/80 px-2 py-1 rounded-md border border-border/40 shadow-sm">{totalPercentage}%</span>
    </div>
  );
};

export default TerpeneTotal;
