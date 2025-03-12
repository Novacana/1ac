
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
import DoctorCalendar from '@/components/doctor/DoctorCalendar';
import { getPrescriptionRequests } from '@/data/prescriptionRequests';
import { PrescriptionRequest } from '@/types/prescription';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { InboxIcon, FileText, Users, Calendar, Video } from 'lucide-react';

const DoctorDashboard = () => {
  const { user, isDoctor } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [mainSection, setMainSection] = useState<'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar'>('prescriptions');

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
        <div className="flex flex-col space-y-6">
          {/* Header with horizontal navigation */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl font-bold">Arzt Dashboard</h1>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                <Button 
                  variant={mainSection === 'open_requests' ? "default" : "outline"} 
                  className="flex items-center gap-2"
                  onClick={() => setMainSection('open_requests')}
                >
                  <InboxIcon className="h-4 w-4" />
                  Offene Anfragen
                </Button>
                <Button 
                  variant={mainSection === 'prescriptions' ? "default" : "outline"} 
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                  onClick={() => setMainSection('prescriptions')}
                >
                  <FileText className="h-4 w-4" />
                  Rezeptverwaltung
                </Button>
                <Button 
                  variant={mainSection === 'patients' ? "default" : "outline"} 
                  className="flex items-center gap-2"
                  onClick={() => setMainSection('patients')}
                >
                  <Users className="h-4 w-4" />
                  Patientenverwaltung
                </Button>
                <Button 
                  variant={mainSection === 'calendar' ? "default" : "outline"} 
                  className="flex items-center gap-2"
                  onClick={() => setMainSection('calendar')}
                >
                  <Calendar className="h-4 w-4" />
                  Kalender
                </Button>
                <Button 
                  variant={mainSection === 'video' ? "default" : "outline"} 
                  className="flex items-center gap-2"
                  onClick={() => setMainSection('video')}
                >
                  <Video className="h-4 w-4" />
                  Videosprechstunde
                </Button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4 hidden md:block">
              <DoctorSidebar 
                user={user} 
                onNavChange={(section) => setMainSection(section)}
                activeSection={mainSection}
              />
            </div>
            
            <div className="lg:w-3/4 flex-1">
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
              ) : mainSection === 'calendar' ? (
                <DoctorCalendar />
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
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
