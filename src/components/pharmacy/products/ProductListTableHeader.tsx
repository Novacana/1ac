
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

interface ProductListTableHeaderProps {
  selectAll: boolean;
  onSelectAllChange: () => void;
}

const ProductListTableHeader: React.FC<ProductListTableHeaderProps> = ({
  selectAll,
  onSelectAllChange
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <div className="flex items-center">
            <Switch
              id="select-all"
              checked={selectAll}
              onCheckedChange={onSelectAllChange}
            />
          </div>
        </TableHead>
        <TableHead>Produkt</TableHead>
        <TableHead>Kategorie</TableHead>
        <TableHead>Preis</TableHead>
        <TableHead>Bestand</TableHead>
        <TableHead>Quelle</TableHead>
        <TableHead>Im Shop</TableHead>
        <TableHead className="text-right">Aktionen</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ProductListTableHeader;
