
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Upload, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface PharmacyHeaderProps {
  onImport: () => void;
  onAddProduct: () => void;
}

const PharmacyHeader: React.FC<PharmacyHeaderProps> = ({ onImport, onAddProduct }) => {
  const handleExport = () => {
    toast.success("Produkte wurden exportiert");
    
    // In a real app, this would trigger a file download
    // For now we'll simulate it with a timeout
    setTimeout(() => {
      const dummyLink = document.createElement('a');
      dummyLink.href = 'data:text/csv;charset=utf-8,Product,Category,Price,Stock\nCBD Öl 5%,Öle,29.99,50\nCBD Tropfen,Öle,19.99,30';
      dummyLink.download = 'pharmacy-products.csv';
      document.body.appendChild(dummyLink);
      dummyLink.click();
      document.body.removeChild(dummyLink);
    }, 500);
  };

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <Link to="/">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zum Shop
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Apotheken-Management</h1>
        <p className="text-muted-foreground mt-2">
          Verwalten Sie Ihre Produkte und Integrationen für Ihre Apotheke
        </p>
      </div>
      
      <div className="flex gap-2 mt-4 md:mt-0">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onImport}
        >
          <Upload className="h-4 w-4" />
          Importieren
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Exportieren
        </Button>
        <Button 
          className="flex items-center gap-2"
          onClick={onAddProduct}
        >
          <Plus className="h-4 w-4" />
          Neues Produkt
        </Button>
      </div>
    </div>
  );
};

export default PharmacyHeader;
