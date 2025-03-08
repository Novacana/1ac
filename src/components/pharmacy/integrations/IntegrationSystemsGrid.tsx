
import React from "react";
import IntegrationSystemCard, { IntegrationSystem } from "./IntegrationSystemCard";

interface IntegrationSystemsGridProps {
  systems: IntegrationSystem[];
  onToggleConnection: (systemId: string) => void;
}

const IntegrationSystemsGrid: React.FC<IntegrationSystemsGridProps> = ({
  systems,
  onToggleConnection,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {systems.map((system) => (
        <IntegrationSystemCard
          key={system.id}
          system={system}
          onToggleConnection={onToggleConnection}
        />
      ))}
    </div>
  );
};

export default IntegrationSystemsGrid;
