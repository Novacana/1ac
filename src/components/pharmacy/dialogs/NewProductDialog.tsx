
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface NewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  setProductName: (name: string) => void;
  productCategory: string;
  setProductCategory: (category: string) => void;
  productPrice: string;
  setProductPrice: (price: string) => void;
  productDescription: string;
  setProductDescription: (description: string) => void;
}

const NewProductDialog: React.FC<NewProductDialogProps> = ({
  open,
  onOpenChange,
  productName,
  setProductName,
  productCategory,
  setProductCategory,
  productPrice,
  setProductPrice,
  productDescription,
  setProductDescription,
}) => {
  const handleNewProductSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!productName || !productCategory || !productPrice) {
      toast.error("Bitte alle Pflichtfelder ausfüllen");
      return;
    }
    
    toast.success(`Produkt "${productName}" wurde hinzugefügt`);
    
    // Reset form fields
    setProductName("");
    setProductCategory("");
    setProductPrice("");
    setProductDescription("");
    
    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Neues Produkt hinzufügen</DialogTitle>
          <DialogDescription>
            Fügen Sie die Details für das neue Produkt hinzu
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleNewProductSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Produktname *</Label>
              <Input
                id="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="z.B. CBD Öl 5%"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategorie *</Label>
              <Select
                value={productCategory}
                onValueChange={setProductCategory}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oils">Öle</SelectItem>
                  <SelectItem value="flowers">Blüten</SelectItem>
                  <SelectItem value="edibles">Esswaren</SelectItem>
                  <SelectItem value="cosmetics">Kosmetik</SelectItem>
                  <SelectItem value="accessories">Zubehör</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Preis (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="19.99"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Produktbeschreibung hier eingeben..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Produkt hinzufügen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProductDialog;
