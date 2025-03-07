
import React, { useState } from 'react';
import { PrescriptionRequest } from '@/types/prescription';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updatePrescriptionRequest } from '@/data/prescriptionRequests';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FilePen, FileText, User, Calendar, MessageSquare, Check, X, AlertCircle, HelpCircle } from 'lucide-react';

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

  // Datum formatieren
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Status Mapping
  const statusOptions = [
    { value: 'pending', label: 'Ausstehend' },
    { value: 'approved', label: 'Genehmigt' },
    { value: 'rejected', label: 'Abgelehnt' },
    { value: 'needs_more_info', label: 'Weitere Informationen benötigt' }
  ];

  // Rezept aktualisieren
  const handlePrescriptionChange = (field: string, value: string) => {
    setPrescription(prev => ({
      ...prev,
      [field]: value
    }));
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
    } catch (error) {
      toast.error('Fehler beim Aktualisieren der Anfrage');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle status change with proper type casting
  const handleStatusChange = (value: string) => {
    // Cast the string value to the specific status type
    setStatus(value as 'pending' | 'approved' | 'rejected' | 'needs_more_info');
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
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="details">Patientendetails</TabsTrigger>
            <TabsTrigger value="symptoms">Symptome</TabsTrigger>
            <TabsTrigger value="prescription">Rezept</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="p-6 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="font-medium">Patient</div>
              </div>
              <div className="pl-6 text-lg">{request.patientName}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div className="font-medium">Kontakt</div>
              </div>
              <div className="pl-6">
                <div>{request.patientEmail}</div>
                {request.patientPhone && <div>{request.patientPhone}</div>}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="font-medium">Eingereicht am</div>
              </div>
              <div className="pl-6">{formatDate(request.dateSubmitted)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <div className="font-medium">Fragebogen</div>
              </div>
              <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between gap-2 bg-muted/20 p-2 rounded">
                  <span>Chronische Schmerzen:</span>
                  <span className="font-medium">{request.questionnaire.pain === 'yes' ? 'Ja' : 'Nein'}</span>
                </div>
                <div className="flex justify-between gap-2 bg-muted/20 p-2 rounded">
                  <span>Schlafprobleme:</span>
                  <span className="font-medium">{request.questionnaire.sleep === 'yes' ? 'Ja' : 'Nein'}</span>
                </div>
                <div className="flex justify-between gap-2 bg-muted/20 p-2 rounded">
                  <span>Angstzustände:</span>
                  <span className="font-medium">{request.questionnaire.anxiety === 'yes' ? 'Ja' : 'Nein'}</span>
                </div>
                <div className="flex justify-between gap-2 bg-muted/20 p-2 rounded">
                  <span>Vorbehandlungen:</span>
                  <span className="font-medium">{request.questionnaire.previous_treatment === 'yes' ? 'Ja' : 'Nein'}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="symptoms" className="p-6 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <div className="font-medium">Beschwerden & Symptome</div>
              </div>
              <div className="p-4 border rounded-md bg-muted/10 whitespace-pre-wrap">
                {request.symptoms}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doctorNotes">Arztnotizen</Label>
              <Textarea
                id="doctorNotes"
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Notizen zur Anfrage hinzufügen..."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status aktualisieren</Label>
              <Select 
                value={status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Status auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="prescription" className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FilePen className="h-5 w-5 text-primary" />
              <div className="font-medium text-lg">Rezept ausstellen</div>
            </div>
            
            {status === 'approved' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Produkt</Label>
                  <Input
                    id="product"
                    value={prescription.product}
                    onChange={(e) => handlePrescriptionChange('product', e.target.value)}
                    placeholder="z.B. CBD-Öl 5%"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosierung</Label>
                  <Input
                    id="dosage"
                    value={prescription.dosage}
                    onChange={(e) => handlePrescriptionChange('dosage', e.target.value)}
                    placeholder="z.B. 10mg, 2x täglich"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Dauer</Label>
                  <Input
                    id="duration"
                    value={prescription.duration}
                    onChange={(e) => handlePrescriptionChange('duration', e.target.value)}
                    placeholder="z.B. 3 Monate"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Anweisungen</Label>
                  <Textarea
                    id="instructions"
                    value={prescription.instructions}
                    onChange={(e) => handlePrescriptionChange('instructions', e.target.value)}
                    placeholder="z.B. 5 Tropfen morgens und abends unter die Zunge"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 border rounded-md text-center bg-muted/10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Um ein Rezept auszustellen, setzen Sie den Status auf "Genehmigt"
                </p>
                <div className="mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setStatus('approved');
                      setActiveTab('symptoms');
                    }}
                  >
                    Status auf "Genehmigt" setzen
                  </Button>
                </div>
              </div>
            )}
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
