
import React from "react";

const EmptyProductState: React.FC = () => {
  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <p className="text-xl text-muted-foreground">No products found in this category</p>
    </div>
  );
};

export default EmptyProductState;
