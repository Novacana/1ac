
import React from 'react';

interface TerpeneTotalProps {
  totalPercentage: string;
}

const TerpeneTotal: React.FC<TerpeneTotalProps> = ({ totalPercentage }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-sm font-medium">Terpene</h4>
      <span className="text-sm font-medium">{totalPercentage}%</span>
    </div>
  );
};

export default TerpeneTotal;
