
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DoctorSidebar from '@/components/doctor/DoctorSidebar';
import PrescriptionRequestsList from '@/components/doctor/PrescriptionRequestsList';
import PrescriptionRequestDetail from '@/components/doctor/PrescriptionRequestDetail';
import PatientManagement from '@/components/doctor/PatientManagement';
import { getPrescriptionRequests } from '@/data/prescriptionRequests';
import { PrescriptionRequest } from '@/types/prescription';
import { toast } from 'sonner';

const DoctorDashboard = () => {
  const { user, isDoctor } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [mainSection, setMainSection] = useState<'prescriptions' | 'patients'>('prescriptions');

  // Überprüfen, ob der Benutzer ein Arzt ist
  useEffect(() => {
    if (!isDoctor) {
      navigate('/login');
      toast.error('Zugriff verweigert');
    }
  }, [isDoctor, navigate]);

  // Daten laden
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPrescriptionRequests();
        setRequests(data);
      } catch (error) {
        toast.error('Fehler beim Laden der Rezeptanfragen');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Nach Status gefilterte Anfragen
  const filteredRequests = requests.filter(req => {
    if (activeTab === 'pending') return req.status === 'pending';
    if (activeTab === 'approved') return req.status === 'approved';
    if (activeTab === 'needs_info') return req.status === 'needs_more_info';
    if (activeTab === 'rejected') return req.status === 'rejected';
    return true; // 'all' tab
  });

  const selectedRequest = requests.find(req => req.id === selectedRequestId);
  
  // Request nach Aktualisierung aktualisieren
  const handleRequestUpdate = (updatedRequest: PrescriptionRequest) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === updatedRequest.id ? updatedRequest : req
      )
    );
    toast.success('Rezeptanfrage aktualisiert');
  };

  return (
    <Layout>
      <div className="container px-4 mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Arzt Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar mit Arztinformationen */}
          <div className="md:w-1/4">
            <DoctorSidebar 
              user={user} 
              onNavChange={(section) => setMainSection(section)}
              activeSection={mainSection}
            />
          </div>
          
          {/* Hauptbereich */}
          <div className="md:w-3/4">
            {mainSection === 'prescriptions' ? (
              <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="all">Alle</TabsTrigger>
                  <TabsTrigger value="pending">Ausstehend</TabsTrigger>
                  <TabsTrigger value="approved">Genehmigt</TabsTrigger>
                  <TabsTrigger value="needs_info">Info benötigt</TabsTrigger>
                  <TabsTrigger value="rejected">Abgelehnt</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Liste der Anfragen */}
                    <div className="lg:w-1/2">
                      <PrescriptionRequestsList 
                        requests={filteredRequests}
                        loading={loading}
                        selectedRequestId={selectedRequestId}
                        onSelectRequest={setSelectedRequestId}
                      />
                    </div>
                    
                    {/* Detailansicht */}
                    <div className="lg:w-1/2">
                      {selectedRequest ? (
                        <PrescriptionRequestDetail 
                          request={selectedRequest} 
                          onUpdate={handleRequestUpdate}
                        />
                      ) : (
                        <div className="bg-muted/30 p-6 rounded-md border text-center h-96 flex items-center justify-center">
                          <p className="text-muted-foreground">
                            Wählen Sie eine Anfrage aus der Liste aus, um die Details anzuzeigen
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <PatientManagement />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
