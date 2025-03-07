
import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
    </div>
  );
};

export default LoadingState;
