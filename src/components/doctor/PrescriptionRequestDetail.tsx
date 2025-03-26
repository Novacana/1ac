import React, { useState } from 'react';
import { PrescriptionRequest } from '@/types/prescription';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updatePrescriptionRequest } from '@/data/prescriptions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FileText, Check, X, HelpCircle, ShoppingCart } from 'lucide-react';

// Import the tab components
import PatientDetailsTab from './prescription-detail/PatientDetailsTab';
import SymptomsTab from './prescription-detail/SymptomsTab';
import PrescriptionTab from './prescription-detail/PrescriptionTab';
import CartItemsTab from './prescription-detail/CartItemsTab';

interface PrescriptionRequestDetailProps {
  request: PrescriptionRequest;
  onUpdate: (updatedRequest: PrescriptionRequest) => void;
}

const PrescriptionRequestDetail: React.FC<PrescriptionRequestDetailProps> = ({
  request,
  onUpdate
}) => {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'needs_more_info'>(request.status);
  const [doctorNotes, setDoctorNotes] = useState(request.doctorNotes || '');
  const [prescription, setPrescription] = useState(request.prescription || {
    id: `presc-${Date.now()}`,
    product: '',
    dosage: '',
    duration: '',
    instructions: '',
    dateIssued: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 Tage Gültigkeit
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('details');

  // Rezept aktualisieren
  const handlePrescriptionChange = (field: string, value: string) => {
    setPrescription(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle signature change
  const handleSignatureChange = (signatureData: {
    doctorName: string;
    dateSigned: string;
    signatureImage?: string;
  }) => {
    setPrescription(prev => ({
      ...prev,
      signature: signatureData
    }));
  };

  // Handle status change with proper type casting
  const handleStatusChange = (value: string) => {
    // Cast the string value to the specific status type
    setStatus(value as 'pending' | 'approved' | 'rejected' | 'needs_more_info');
  };

  // Set status to approved and navigate to symptoms tab
  const handleApproveStatus = () => {
    setStatus('approved');
    setActiveTab('symptoms');
  };

  // Anfrage aktualisieren
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const updates: Partial<PrescriptionRequest> = {
        status,
        doctorNotes
      };
      
      // Wenn Status auf "genehmigt" gesetzt ist, füge Rezept hinzu
      if (status === 'approved') {
        updates.prescription = prescription;
      }
      
      const updatedRequest = await updatePrescriptionRequest(request.id, updates);
      onUpdate(updatedRequest);
      
      // Ändere Tab nach dem Speichern basierend auf dem Status
      if (status === 'approved') {
        setActiveTab('prescription');
      }

      toast.success('Anfrage erfolgreich aktualisiert');
    } catch (error) {
      toast.error('Fehler beim Aktualisieren der Anfrage');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Rezeptanfrage Details
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="details">Patientendetails</TabsTrigger>
            <TabsTrigger value="symptoms">Symptome</TabsTrigger>
            <TabsTrigger value="cart">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Warenkorb
            </TabsTrigger>
            <TabsTrigger value="prescription">Rezept</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <PatientDetailsTab request={request} />
          </TabsContent>
          
          <TabsContent value="symptoms">
            <SymptomsTab 
              symptoms={request.symptoms}
              doctorNotes={doctorNotes}
              status={status}
              onNotesChange={setDoctorNotes}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
          
          <TabsContent value="cart">
            <CartItemsTab cartItems={request.cartItems} />
          </TabsContent>
          
          <TabsContent value="prescription">
            <PrescriptionTab 
              status={status}
              prescription={prescription}
              cartItems={request.cartItems}
              onPrescriptionChange={handlePrescriptionChange}
              onStatusChange={handleApproveStatus}
              onSignatureChange={handleSignatureChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="px-6 py-4 border-t flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="destructive"
            onClick={() => {
              setStatus('rejected');
              handleSubmit();
            }}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Ablehnen
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              setStatus('needs_more_info');
              handleSubmit();
            }}
            disabled={isSubmitting}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Info anfordern
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Speichern
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrescriptionRequestDetail;
