
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { usePharmacyProducts } from "./hooks/usePharmacyProducts";
import ProductListSearchBar from "./products/ProductListSearchBar";
import ProductListTableHeader from "./products/ProductListTableHeader";
import ProductListTableRow from "./products/ProductListTableRow";
import EmptyProductState from "./products/EmptyProductState";

const PharmacyProductsList: React.FC = () => {
  const {
    filteredProducts,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedProducts,
    toggleProductSelection,
    offeredInShop,
    inventoryLevels,
    selectAll,
    handleSelectAll,
    isAnyProductSelected,
    toggleOfferedInShop,
    deleteSelectedProducts,
    deleteProduct,
    handleUpdateStock
  } = usePharmacyProducts();

  // Product action handlers
  const handleViewProduct = (product: Product) => {
    toast.info(`Produkt ansehen: ${product.name}`);
    window.open(`/product/${product.id}`, '_blank');
  };

  const handleEditProduct = (product: Product) => {
    toast.info(`Produkt bearbeiten: ${product.name}`);
  };

  return (
    <div className="space-y-4">
      <ProductListSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isAnyProductSelected={isAnyProductSelected}
        onDeleteSelected={deleteSelectedProducts}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <ProductListTableHeader
              selectAll={selectAll}
              onSelectAllChange={handleSelectAll}
            />
            <TableBody>
              {filteredProducts.length === 0 ? (
                <EmptyProductState searchQuery={searchQuery} colSpan={8} />
              ) : (
                filteredProducts.map((product) => (
                  <ProductListTableRow
                    key={product.id}
                    product={product}
                    isSelected={!!selectedProducts[product.id]}
                    onToggleSelection={toggleProductSelection}
                    inventoryLevel={inventoryLevels[product.id] || 0}
                    isOffered={!!offeredInShop[product.id]}
                    onToggleOffered={toggleOfferedInShop}
                    onView={handleViewProduct}
                    onEdit={handleEditProduct}
                    onDelete={deleteProduct}
                    onUpdateStock={handleUpdateStock}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PharmacyProductsList;
