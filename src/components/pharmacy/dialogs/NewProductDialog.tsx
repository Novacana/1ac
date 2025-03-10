
import React, { useState } from "react";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, FileUp, AlertCircle, X, Check, FileText } from "lucide-react";
import { parseProductSpecification, parseTerpeneCoA } from "../utils/documentParser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Definiere die Typen für unsere extrahierten Daten
interface ExtractedProductData {
  name?: string;
  thc?: string;
  cbd?: string;
  category?: string;
  packaging?: string;
  origin?: string;
  lab_tested?: boolean;
  terpenes?: { name: string; percentage: string }[];
  effects?: string[];
  description?: string;
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
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedProductData | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);

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
    setUploadedFiles([]);
    setExtractedData(null);
    setExtractionError(null);
    setActiveTab("manual");
    
    // Close dialog
    onOpenChange(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setUploadedFiles([...uploadedFiles, ...fileArray]);
      event.target.value = ""; // Reset the input value
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    
    // Reset extracted data if all files are removed
    if (newFiles.length === 0) {
      setExtractedData(null);
      setExtractionError(null);
    }
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Bitte laden Sie mindestens eine Datei hoch");
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setExtractedData(null);
    setExtractionError(null);

    try {
      let extractedData: ExtractedProductData = {};
      
      // Simulate progress updates
      const updateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setProcessingProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 100);
        return interval;
      };
      
      const progressInterval = updateProgress();
      
      // Process each file
      for (const file of uploadedFiles) {
        try {
          // Bestimme den Dateityp basierend auf dem Dateinamen oder Inhalt
          if (file.name.toLowerCase().includes('spec') || file.name.toLowerCase().includes('spezifikation')) {
            // Parse product specification
            const specData = await parseProductSpecification(file);
            extractedData = { ...extractedData, ...specData };
          } else if (file.name.toLowerCase().includes('coa') || file.name.toLowerCase().includes('terpene')) {
            // Parse CoA or terpene profile
            const terpeneData = await parseTerpeneCoA(file);
            extractedData = { 
              ...extractedData, 
              terpenes: [...(extractedData.terpenes || []), ...(terpeneData.terpenes || [])]
            };
          } else {
            // Versuche intelligent zu raten, welcher Dateityp es ist
            // Für jetzt einfach versuchen beide Parser und schauen, welcher Daten liefert
            const specData = await parseProductSpecification(file);
            const terpeneData = await parseTerpeneCoA(file);
            
            if (specData && Object.keys(specData).length > 0) {
              extractedData = { ...extractedData, ...specData };
            }
            
            if (terpeneData && terpeneData.terpenes && terpeneData.terpenes.length > 0) {
              extractedData = { 
                ...extractedData, 
                terpenes: [...(extractedData.terpenes || []), ...(terpeneData.terpenes || [])]
              };
            }
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
        }
      }

      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      // Wenn der Produktname nicht extrahiert wurde, den Dateinamen als Fallback verwenden
      if (!extractedData.name && uploadedFiles.length > 0) {
        const fileName = uploadedFiles[0].name;
        extractedData.name = fileName.split('.')[0].replace(/_/g, ' ');
      }
      
      // Daten in das Formular übertragen
      if (extractedData.name) setProductName(extractedData.name);
      if (extractedData.category) setProductCategory(extractedData.category.toLowerCase());
      if (extractedData.description) setProductDescription(extractedData.description);
      
      // Extrahierte Daten speichern
      setExtractedData(extractedData);
      
      if (Object.keys(extractedData).length === 0) {
        setExtractionError("Es konnten keine relevanten Daten aus den hochgeladenen Dateien extrahiert werden.");
      } else {
        toast.success("Daten erfolgreich aus Dokumenten extrahiert");
      }
    } catch (error) {
      console.error("Error processing files:", error);
      setExtractionError("Fehler beim Verarbeiten der Dateien. Bitte überprüfen Sie das Format und versuchen Sie es erneut.");
      toast.error("Fehler bei der Dokumentenanalyse");
    } finally {
      setIsProcessing(false);
      setProcessingProgress(100);
    }
  };

  const applyExtractedData = () => {
    if (!extractedData) return;
    
    if (extractedData.name) setProductName(extractedData.name);
    
    // Kategorie gemäß Produkttyp setzen
    if (extractedData.category) {
      const categoryMap: Record<string, string> = {
        "cannabis flos": "flowers",
        "öl": "oils",
        "oil": "oils",
        "extrakt": "oils",
        "extract": "oils",
        "blüte": "flowers",
        "flower": "flowers"
      };
      
      const mappedCategory = categoryMap[extractedData.category.toLowerCase()] || "flowers";
      setProductCategory(mappedCategory);
    }
    
    // Beschreibung zusammenstellen
    let description = extractedData.description || "";
    
    if (extractedData.thc || extractedData.cbd) {
      description += description ? "\n\n" : "";
      description += "Gehalt:";
      if (extractedData.thc) description += `\n- THC: ${extractedData.thc}`;
      if (extractedData.cbd) description += `\n- CBD: ${extractedData.cbd}`;
    }
    
    if (extractedData.terpenes && extractedData.terpenes.length > 0) {
      description += description ? "\n\n" : "";
      description += "Terpenprofil:";
      
      // Sortiere Terpene nach Prozentgehalt (absteigend)
      const sortedTerpenes = [...extractedData.terpenes].sort((a, b) => {
        const percentA = parseFloat(a.percentage);
        const percentB = parseFloat(b.percentage);
        return percentB - percentA;
      });
      
      // Füge die Top 5 Terpene zur Beschreibung hinzu
      const topTerpenes = sortedTerpenes.slice(0, 5);
      topTerpenes.forEach(terpene => {
        description += `\n- ${terpene.name}: ${terpene.percentage}%`;
      });
    }
    
    setProductDescription(description);
    
    toast.success("Extrahierte Daten wurden auf das Formular angewendet");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neues Produkt hinzufügen</DialogTitle>
          <DialogDescription>
            Fügen Sie die Details für das neue Produkt hinzu oder laden Sie Produktspezifikationen hoch
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="manual" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manuell</TabsTrigger>
            <TabsTrigger value="document">Dokument-Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="pt-4">
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
                    rows={5}
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
          </TabsContent>
          
          <TabsContent value="document" className="pt-4 space-y-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 text-center hover:border-primary/50 transition-colors">
                <Label 
                  htmlFor="document-upload" 
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <FileUp className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Klicken Sie, um Produktspezifikationen oder CoAs hochzuladen
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Unterstützte Formate: PDF, JPG, PNG
                  </span>
                </Label>
                <Input
                  id="document-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                />
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Hochgeladene Dateien:</Label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 border rounded-md bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={processFiles} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Upload className="h-4 w-4 animate-pulse" />
                        Verarbeitung...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Dokumente analysieren
                      </span>
                    )}
                  </Button>
                  
                  {isProcessing && (
                    <Progress value={processingProgress} className="h-2" />
                  )}
                </div>
              )}
              
              {extractionError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Fehler bei der Extraktion</AlertTitle>
                  <AlertDescription>{extractionError}</AlertDescription>
                </Alert>
              )}
              
              {extractedData && Object.keys(extractedData).length > 0 && (
                <div className="border rounded-md p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Extrahierte Produktdaten</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={applyExtractedData}
                      className="text-xs"
                    >
                      Daten übernehmen
                    </Button>
                  </div>
                  
                  <div className="grid gap-2 text-sm">
                    {extractedData.name && (
                      <div className="flex justify-between items-start border-b pb-1">
                        <span className="font-medium">Name:</span>
                        <span className="text-right">{extractedData.name}</span>
                      </div>
                    )}
                    
                    {extractedData.category && (
                      <div className="flex justify-between items-start border-b pb-1">
                        <span className="font-medium">Kategorie:</span>
                        <span className="text-right">{extractedData.category}</span>
                      </div>
                    )}
                    
                    {extractedData.thc && (
                      <div className="flex justify-between items-start border-b pb-1">
                        <span className="font-medium">THC:</span>
                        <span className="text-right">{extractedData.thc}</span>
                      </div>
                    )}
                    
                    {extractedData.cbd && (
                      <div className="flex justify-between items-start border-b pb-1">
                        <span className="font-medium">CBD:</span>
                        <span className="text-right">{extractedData.cbd}</span>
                      </div>
                    )}
                    
                    {extractedData.terpenes && extractedData.terpenes.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-medium">Terpene:</span>
                        <div className="max-h-40 overflow-y-auto text-xs pl-2 border-l-2 ml-2">
                          {extractedData.terpenes
                            .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
                            .slice(0, 10)
                            .map((terpene, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span>{terpene.name}</span>
                                <span>{terpene.percentage}%</span>
                              </div>
                            ))}
                          {extractedData.terpenes.length > 10 && (
                            <div className="text-muted-foreground text-center mt-1">
                              +{extractedData.terpenes.length - 10} weitere
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <form onSubmit={handleNewProductSubmit}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="doc-name">Produktname *</Label>
                      <Input
                        id="doc-name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="z.B. CBD Öl 5%"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="doc-category">Kategorie *</Label>
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
                      <Label htmlFor="doc-price">Preis (€) *</Label>
                      <Input
                        id="doc-price"
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
                      <Label htmlFor="doc-description">Beschreibung</Label>
                      <Textarea
                        id="doc-description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Produktbeschreibung hier eingeben..."
                        rows={5}
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                      Abbrechen
                    </Button>
                    <Button type="submit">Produkt hinzufügen</Button>
                  </DialogFooter>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewProductDialog;
