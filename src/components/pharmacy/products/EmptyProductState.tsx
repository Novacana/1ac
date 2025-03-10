
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyProductStateProps {
  searchQuery: string;
  colSpan: number;
}

const EmptyProductState: React.FC<EmptyProductStateProps> = ({ searchQuery, colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32 text-center">
        {searchQuery 
          ? "Keine Produkte gefunden für diesen Suchbegriff." 
          : "Keine Produkte vorhanden."}
      </TableCell>
    </TableRow>
  );
};

export default EmptyProductState;
