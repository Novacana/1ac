
import React, { useState } from 'react';
import { 
  CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Patient, MedicalHistoryEntry, Medication } from '@/types/patient';
import { format } from 'date-fns';
import { 
  ClipboardList, CalendarClock, Pill, 
  AlertCircle, PenSquare, Calendar 
} from 'lucide-react';

interface PatientDetailProps {
  patient: Patient;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{patient.name}</CardTitle>
            <CardDescription>
              {`${format(new Date(patient.dateOfBirth), 'dd.MM.yyyy')} • ${
                patient.gender === 'male' ? 'Männlich' : 
                patient.gender === 'female' ? 'Weiblich' : 'Divers'
              }`}
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <PenSquare className="h-3.5 w-3.5" />
            Bearbeiten
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4 mx-6">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="history">Krankenakte</TabsTrigger>
            <TabsTrigger value="medications">Medikamente</TabsTrigger>
            <TabsTrigger value="documents">Dokumente</TabsTrigger>
          </TabsList>
          
          <div className="px-6 pb-6">
            <TabsContent value="overview" className="mt-0 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Kontaktdaten</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">E-Mail</p>
                    <p className="text-sm">{patient.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Telefon</p>
                    <p className="text-sm">{patient.phone || 'Nicht angegeben'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Adresse</h3>
                {patient.address ? (
                  <div>
                    <p className="text-sm">{patient.address.street}</p>
                    <p className="text-sm">{`${patient.address.zipCode} ${patient.address.city}`}</p>
                    <p className="text-sm">{patient.address.country}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Keine Adresse angegeben</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Versicherung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Anbieter</p>
                    <p className="text-sm">{patient.insuranceProvider || 'Nicht angegeben'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Versicherungsnummer</p>
                    <p className="text-sm">{patient.insuranceNumber || 'Nicht angegeben'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Allergien</h3>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.map((allergy, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Keine Allergien bekannt</p>
                )}
              </div>
              
              {patient.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Anmerkungen</h3>
                  <p className="text-sm">{patient.notes}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Krankengeschichte</h3>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Neuer Eintrag
                  </Button>
                </div>
                
                {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                  <div className="space-y-3">
                    {patient.medicalHistory.map((entry) => (
                      <HistoryEntry key={entry.id} entry={entry} />
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center">
                    <ClipboardList className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Keine Krankengeschichte vorhanden</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="medications" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Aktuelle Medikation</h3>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Medikament hinzufügen
                  </Button>
                </div>
                
                {patient.medications && patient.medications.length > 0 ? (
                  <div className="space-y-3">
                    {patient.medications.map((medication) => (
                      <MedicationCard key={medication.id} medication={medication} />
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center">
                    <Pill className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Keine Medikamente vorhanden</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-0 h-[280px] flex items-center justify-center">
              <div className="text-center">
                <CalendarClock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Dokumentenverwaltung kommt bald</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end border-t p-4">
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Termin vereinbaren
          </Button>
          <Button>Rezept ausstellen</Button>
        </div>
      </CardFooter>
    </>
  );
};

// Hilfkomponenten
const HistoryEntry: React.FC<{ entry: MedicalHistoryEntry }> = ({ entry }) => {
  return (
    <div className="border rounded-md p-3">
      <div className="flex justify-between items-start mb-2">
        <p className="font-medium">{entry.diagnosis}</p>
        <span className="text-xs text-muted-foreground">
          {format(new Date(entry.date), 'dd.MM.yyyy')}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-1">Behandlung: {entry.treatment}</p>
      {entry.notes && <p className="text-xs text-muted-foreground">{entry.notes}</p>}
    </div>
  );
};

const MedicationCard: React.FC<{ medication: Medication }> = ({ medication }) => {
  return (
    <div className="border rounded-md p-3">
      <div className="flex justify-between items-start mb-1">
        <p className="font-medium">{medication.name}</p>
        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
          medication.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {medication.isActive ? 'Aktiv' : 'Inaktiv'}
        </span>
      </div>
      <p className="text-sm">{medication.dosage}, {medication.frequency}</p>
      <p className="text-xs text-muted-foreground mt-1">
        Seit: {format(new Date(medication.startDate), 'dd.MM.yyyy')}
        {medication.endDate && ` • Bis: ${format(new Date(medication.endDate), 'dd.MM.yyyy')}`}
      </p>
    </div>
  );
};

// Hilfsfunktion für das Icon
function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default PatientDetail;
