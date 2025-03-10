
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Patient } from '@/types/patient';
import { getPatients } from '@/data/patients';
import { format } from 'date-fns';
import { Plus, Search, User, FileText, PenSquare } from 'lucide-react';
import PatientDetail from './PatientDetail';
import NewPatientForm from './NewPatientForm';

const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [addPatientOpen, setAddPatientOpen] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Fehler beim Laden der Patienten:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.phone && patient.phone.includes(searchTerm))
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Patientenverwaltung</h2>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Patient suchen..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={addPatientOpen} onOpenChange={setAddPatientOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Neuer Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Neuen Patienten hinzufügen</DialogTitle>
              </DialogHeader>
              <NewPatientForm onSuccess={() => setAddPatientOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <p className="text-muted-foreground">Patienten werden geladen...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Patientenliste</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Kontakt</TableHead>
                      <TableHead>Letzter Besuch</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map(patient => (
                        <TableRow 
                          key={patient.id}
                          className={selectedPatientId === patient.id ? "bg-primary/5" : ""}
                          onClick={() => setSelectedPatientId(patient.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {patient.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{patient.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(patient.dateOfBirth), 'dd.MM.yyyy')}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{patient.email}</p>
                            <p className="text-xs text-muted-foreground">{patient.phone}</p>
                          </TableCell>
                          <TableCell>
                            {patient.lastVisit ? (
                              format(new Date(patient.lastVisit), 'dd.MM.yyyy')
                            ) : (
                              <span className="text-muted-foreground text-sm">Kein Besuch</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPatientId(patient.id);
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center">
                          <p className="text-muted-foreground">Keine Patienten gefunden</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="h-auto lg:h-[600px] overflow-auto">
            {selectedPatient ? (
              <PatientDetail patient={selectedPatient} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Kein Patient ausgewählt</h3>
                <p className="text-muted-foreground max-w-md">
                  Wählen Sie einen Patienten aus der Liste aus, um dessen Details anzuzeigen und zu bearbeiten.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
