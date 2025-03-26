
import React, { useState, useRef, useEffect } from 'react';
import { FilePen, AlertCircle, PenLine, Trash2, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PrescriptionCartItem } from '@/types/prescription';
import { sendPrescriptionToPharmacies, getAvailablePharmacies } from '@/utils/fhir/resources/pharmacy';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface PrescriptionTabProps {
  status: 'pending' | 'approved' | 'rejected' | 'needs_more_info';
  prescription: {
    id: string;
    product: string;
    dosage: string;
    duration: string;
    instructions: string;
    dateIssued: string;
    expiryDate: string;
    signature?: {
      doctorName: string;
      dateSigned: string;
      signatureImage?: string;
    };
  };
  cartItems?: PrescriptionCartItem[];
  onPrescriptionChange: (field: string, value: string) => void;
  onStatusChange: () => void;
  onSignatureChange?: (signatureData: { doctorName: string; dateSigned: string; signatureImage?: string }) => void;
}

const PrescriptionTab: React.FC<PrescriptionTabProps> = ({
  status,
  prescription,
  cartItems,
  onPrescriptionChange,
  onStatusChange,
  onSignatureChange
}) => {
  const { user } = useAuth();
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState<string | undefined>(prescription.signature?.signatureImage);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [doctorName, setDoctorName] = useState(prescription.signature?.doctorName || (user?.name || ''));
  const [isSendingToPharmacy, setIsSendingToPharmacy] = useState(false);
  const [pharmacySent, setPharmacySent] = useState(false);
  const [availablePharmacies, setAvailablePharmacies] = useState<Array<{id: string, name: string, address: string}>>([]);
  
  // Lade verfügbare Apotheken
  useEffect(() => {
    const loadPharmacies = async () => {
      const pharmacies = await getAvailablePharmacies();
      setAvailablePharmacies(pharmacies);
    };
    
    loadPharmacies();
  }, []);
  
  // Automatically populate product information from cart items
  useEffect(() => {
    if (cartItems && cartItems.length > 0 && !prescription.product) {
      // Combine product names if multiple items exist
      const productNames = cartItems.map(item => `${item.name} (${item.quantity}x)`).join(', ');
      onPrescriptionChange('product', productNames);
    }
  }, [cartItems, prescription.product, onPrescriptionChange]);

  // Beim ersten Laden automatisch auf "Genehmigt" setzen, wenn das Rezept im Pending-Status ist
  useEffect(() => {
    if (status === 'pending' && onStatusChange) {
      onStatusChange();
    }
  }, [status, onStatusChange]);

  // FHIR-kompatibles Rezept an Apotheke senden
  const handleSendToPharmacy = async () => {
    if (!prescription.signature) {
      toast.error("Bitte unterschreiben Sie das Rezept, bevor es an Apotheken gesendet wird");
      return;
    }
    
    setIsSendingToPharmacy(true);
    
    try {
      const prescriptionData = {
        ...prescription,
        patientId: "unknown", // In echtem System würde dies aus der Datenbank kommen
        patientName: "Patient Name", // Ebenso hier
        doctorId: user?.id || "unknown"
      };
      
      const { success, pharmacyIds } = await sendPrescriptionToPharmacies(prescriptionData, cartItems);
      
      if (success) {
        setPharmacySent(true);
        toast.success(`Rezept erfolgreich an ${pharmacyIds.length} Apotheke(n) gesendet`);
      } else {
        toast.error("Fehler beim Senden des Rezepts an Apotheken");
      }
    } catch (error) {
      console.error("Fehler beim Senden an Apotheke:", error);
      toast.error("Ein Fehler ist aufgetreten");
    } finally {
      setIsSendingToPharmacy(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling on touch
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const signatureImage = canvas.toDataURL('image/png');
        setSignature(signatureImage);
        
        if (onSignatureChange) {
          onSignatureChange({
            doctorName,
            dateSigned: new Date().toISOString(),
            signatureImage
          });
        }
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(undefined);
    
    if (onSignatureChange) {
      onSignatureChange({
        doctorName,
        dateSigned: new Date().toISOString(),
        signatureImage: undefined
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctorName(e.target.value);
    
    if (onSignatureChange && signature) {
      onSignatureChange({
        doctorName: e.target.value,
        dateSigned: new Date().toISOString(),
        signatureImage: signature
      });
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FilePen className="h-5 w-5 text-primary" />
        <div className="font-medium text-lg">Rezept ausstellen</div>
      </div>
      
      <div className="space-y-4">
        {cartItems && cartItems.length > 0 && (
          <div className="bg-secondary/30 p-4 rounded-md mb-4">
            <h3 className="text-sm font-medium mb-2">Produkte im Warenkorb des Patienten:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {cartItems.map(item => (
                <li key={item.id}>{item.name} ({item.quantity}x)</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="product">Produkt</Label>
          <Input
            id="product"
            value={prescription.product}
            onChange={(e) => onPrescriptionChange('product', e.target.value)}
            placeholder="z.B. CBD-Öl 5%"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosierung</Label>
          <Input
            id="dosage"
            value={prescription.dosage}
            onChange={(e) => onPrescriptionChange('dosage', e.target.value)}
            placeholder="z.B. 10mg, 2x täglich"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Dauer</Label>
          <Input
            id="duration"
            value={prescription.duration}
            onChange={(e) => onPrescriptionChange('duration', e.target.value)}
            placeholder="z.B. 3 Monate"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructions">Anweisungen</Label>
          <Textarea
            id="instructions"
            value={prescription.instructions}
            onChange={(e) => onPrescriptionChange('instructions', e.target.value)}
            placeholder="z.B. 5 Tropfen morgens und abends unter die Zunge"
            className="min-h-[80px]"
          />
        </div>

        {availablePharmacies.length > 0 && (
          <div className="space-y-2 mt-4">
            <Label>Verfügbare Apotheken</Label>
            <div className="grid grid-cols-1 gap-2">
              {availablePharmacies.map(pharmacy => (
                <div key={pharmacy.id} className="border rounded-md p-3 bg-secondary/10">
                  <div className="font-medium">{pharmacy.name}</div>
                  <div className="text-sm text-muted-foreground">{pharmacy.address}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <PenLine className="h-5 w-5 text-primary" />
            <div className="font-medium">Elektronische Signatur</div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Name des Arztes</Label>
              <Input
                id="doctorName"
                value={doctorName}
                onChange={handleNameChange}
                placeholder="Dr. med. Max Mustermann"
              />
            </div>

            <div className="space-y-2">
              <Label className="block mb-2">Signatur</Label>
              <div className="border rounded-md bg-white relative">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={150}
                  className="w-full h-[150px] border rounded-md touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!signature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground">
                    Hier zeichnen, um zu signieren
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearSignature}
                  type="button"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Signatur löschen
                </Button>
              </div>
            </div>

            {/* Apothekensendungs-Button */}
            <div className="pt-4 border-t">
              <Button
                className="w-full flex items-center justify-center"
                onClick={handleSendToPharmacy}
                disabled={isSendingToPharmacy || pharmacySent || !signature}
              >
                {isSendingToPharmacy ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {pharmacySent ? 'An Apotheke gesendet' : 'An Apotheke senden'}
                  </>
                )}
              </Button>
              
              {pharmacySent && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <AlertDescription className="text-green-700">
                    Das Rezept wurde erfolgreich an die zuständige Apotheke gesendet.
                    Der Patient wird benachrichtigt, wenn die Medikamente bereit sind.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* DSGVO-Hinweis für die elektronische Signatur */}
            <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-md mt-2">
              Mit der elektronischen Signatur bestätigen Sie die Richtigkeit des Rezepts gemäß den ärztlichen Richtlinien.
              Die Signatur wird gemäß der DSGVO sicher gespeichert und nur zum Zweck der Rezeptverifizierung verwendet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionTab;
