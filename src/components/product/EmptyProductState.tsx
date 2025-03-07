
import React from "react";

const EmptyProductState: React.FC = () => {
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center">
      <p className="text-xl text-muted-foreground mb-4">No products found in this category</p>
      <div className="bg-muted p-4 rounded-md">
        <code className="text-sm">Check the product filters or try another category</code>
      </div>
    </div>
  );
};

export default EmptyProductState;
