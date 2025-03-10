
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Product } from "@/types/product";
import { getSourceLabel } from "../utils/productDisplayUtils";

interface ProductListTableRowProps {
  product: Product;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  inventoryLevel: number;
  isOffered: boolean;
  onToggleOffered: (id: string, name: string) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onUpdateStock: (product: Product) => void;
}

const ProductListTableRow: React.FC<ProductListTableRowProps> = ({
  product,
  isSelected,
  onToggleSelection,
  inventoryLevel,
  isOffered,
  onToggleOffered,
  onView,
  onEdit,
  onDelete,
  onUpdateStock
}) => {
  return (
    <TableRow key={product.id}>
      <TableCell>
        <Switch
          id={`select-${product.id}`}
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(product.id)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-muted-foreground">ID: {product.id}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{product.category}</Badge>
      </TableCell>
      <TableCell>{product.price.toFixed(2)} €</TableCell>
      <TableCell>
        <div className="flex items-center">
          <span 
            className={`font-medium ${inventoryLevel <= 5 ? 'text-red-500' : ''}`}
            onClick={() => onUpdateStock(product)}
          >
            {inventoryLevel}
          </span>
          {inventoryLevel <= 5 && (
            <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 text-xs">
              Niedrig
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-xs">
          {getSourceLabel(product)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Switch
            id={`offer-${product.id}`}
            checked={isOffered}
            onCheckedChange={() => onToggleOffered(product.id, product.name)}
          />
          <Label htmlFor={`offer-${product.id}`} className="text-xs">
            {isOffered ? (
              <span className="flex items-center text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Angeboten
              </span>
            ) : (
              <span className="flex items-center text-muted-foreground">
                <XCircle className="h-3 w-3 mr-1" />
                Nicht angeboten
              </span>
            )}
          </Label>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onView(product)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductListTableRow;
