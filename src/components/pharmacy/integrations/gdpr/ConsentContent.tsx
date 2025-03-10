
import React from "react";
import { Lock } from "lucide-react";

const ConsentContent: React.FC = () => {
  return (
    <div className="space-y-4 py-4">
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-5 text-sm">
        <h3 className="mb-3 font-medium text-base">Durch das Verbinden mit externen Diensten:</h3>
        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-2">
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">•</span>
            <span>Werden Ihre Daten mit Drittanbietern geteilt</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">•</span>
            <span>Können Produktdaten synchronisiert werden</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">•</span>
            <span>Können Bestandsdaten übertragen werden</span>
          </li>
        </ul>
        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          <Lock className="h-3 w-3 mr-1" />
          Ihre Daten werden gemäß unserer Datenschutzrichtlinie verarbeitet
        </div>
      </div>
    </div>
  );
};

export default ConsentContent;
