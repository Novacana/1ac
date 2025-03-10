import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DoctorSidebar from '@/components/doctor/DoctorSidebar';
import PrescriptionRequestsList from '@/components/doctor/PrescriptionRequestsList';
import PrescriptionRequestDetail from '@/components/doctor/PrescriptionRequestDetail';
import PatientManagement from '@/components/doctor/PatientManagement';
import OpenRequestsPanel from '@/components/doctor/OpenRequestsPanel';
import VideoConsultation from '@/components/doctor/VideoConsultation';
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
  const [mainSection, setMainSection] = useState<'prescriptions' | 'patients' | 'open_requests' | 'video'>('prescriptions');

  useEffect(() => {
    if (!isDoctor) {
      navigate('/login');
      toast.error('Zugriff verweigert');
    }
  }, [isDoctor, navigate]);

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

  const filteredRequests = requests.filter(req => {
    if (mainSection === 'open_requests') {
      return req.status === 'pending' && !req.assignedDoctorId;
    }
    
    if (activeTab === 'pending') return req.status === 'pending' && req.assignedDoctorId === user?.id;
    if (activeTab === 'approved') return req.status === 'approved' && req.assignedDoctorId === user?.id;
    if (activeTab === 'needs_info') return req.status === 'needs_more_info' && req.assignedDoctorId === user?.id;
    if (activeTab === 'rejected') return req.status === 'rejected' && req.assignedDoctorId === user?.id;
    return req.assignedDoctorId === user?.id; // 'all' tab
  });

  const selectedRequest = requests.find(req => req.id === selectedRequestId);
  
  const handleRequestUpdate = (updatedRequest: PrescriptionRequest) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === updatedRequest.id ? updatedRequest : req
      )
    );
    toast.success('Rezeptanfrage aktualisiert');
  };

  const handleAssignDoctor = (requestId: string) => {
    if (!user?.id) {
      toast.error('Fehler: Kein Arzt angemeldet');
      return;
    }
    
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId 
          ? { ...req, assignedDoctorId: user.id } 
          : req
      )
    );
    
    setSelectedRequestId(requestId);
    setMainSection('prescriptions');
    setActiveTab('pending');
    toast.success('Patient übernommen');
  };

  return (
    <Layout>
      <div className="container px-4 mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Arzt Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <DoctorSidebar 
              user={user} 
              onNavChange={(section) => setMainSection(section)}
              activeSection={mainSection}
            />
          </div>
          
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
                    <div className="lg:w-1/2">
                      <PrescriptionRequestsList 
                        requests={filteredRequests}
                        loading={loading}
                        selectedRequestId={selectedRequestId}
                        onSelectRequest={setSelectedRequestId}
                      />
                    </div>
                    
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
            ) : mainSection === 'patients' ? (
              <PatientManagement />
            ) : mainSection === 'video' ? (
              <VideoConsultation />
            ) : (
              <OpenRequestsPanel 
                requests={filteredRequests}
                loading={loading}
                onAssignDoctor={handleAssignDoctor}
                selectedRequestId={selectedRequestId}
                onSelectRequest={setSelectedRequestId}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
