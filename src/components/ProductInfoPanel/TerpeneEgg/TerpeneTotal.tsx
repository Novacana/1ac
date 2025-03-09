
import React from 'react';

interface TerpeneTotalProps {
  totalPercentage: string;
}

const TerpeneTotal: React.FC<TerpeneTotalProps> = ({ totalPercentage }) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <h4 className="text-sm font-medium">Terpene</h4>
      <span className="text-sm font-medium bg-background/60 px-2 py-0.5 rounded-md border border-border/30">
        {totalPercentage}%
      </span>
    </div>
  );
};

export default TerpeneTotal;
