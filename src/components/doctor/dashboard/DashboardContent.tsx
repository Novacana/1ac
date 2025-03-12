
import React from 'react';
import DoctorSidebar from '@/components/doctor/DoctorSidebar';
import PrescriptionRequestsList from '@/components/doctor/PrescriptionRequestsList';
import PrescriptionRequestDetail from '@/components/doctor/PrescriptionRequestDetail';
import PatientManagement from '@/components/doctor/PatientManagement';
import OpenRequestsPanel from '@/components/doctor/OpenRequestsPanel';
import VideoConsultation from '@/components/doctor/VideoConsultation';
import DoctorCalendar from '@/components/doctor/DoctorCalendar';
import { User } from '@/types/auth';
import { PrescriptionRequest } from '@/types/prescription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardContentProps {
  user: User | null;
  mainSection: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar';
  activeTab: string;
  selectedRequest: PrescriptionRequest | undefined;
  filteredRequests: PrescriptionRequest[];
  loading: boolean;
  selectedRequestId: string | null;
  onSectionChange: (section: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar') => void;
  onTabChange: (value: string) => void;
  onSelectRequest: (id: string) => void;
  onRequestUpdate: (updatedRequest: PrescriptionRequest) => void;
  onAssignDoctor: (requestId: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  user,
  mainSection,
  activeTab,
  selectedRequest,
  filteredRequests,
  loading,
  selectedRequestId,
  onSectionChange,
  onTabChange,
  onSelectRequest,
  onRequestUpdate,
  onAssignDoctor
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {!isMobile && (
        <div className="lg:w-1/4 hidden md:block">
          <DoctorSidebar 
            user={user} 
            onNavChange={onSectionChange}
            activeSection={mainSection}
          />
        </div>
      )}
      
      <div className={`${isMobile ? "w-full" : "lg:w-3/4"} flex-1`}>
        {mainSection === 'prescriptions' ? (
          <Tabs defaultValue="pending" value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className={`grid ${isMobile ? 'grid-cols-3 overflow-x-auto' : 'grid-cols-5'} mb-6`}>
              {!isMobile && <TabsTrigger value="all">Alle</TabsTrigger>}
              <TabsTrigger value="pending">Ausstehend</TabsTrigger>
              <TabsTrigger value="approved">Genehmigt</TabsTrigger>
              {!isMobile && <TabsTrigger value="needs_info">Info benötigt</TabsTrigger>}
              {isMobile && <TabsTrigger value="needs_info">Info</TabsTrigger>}
              <TabsTrigger value="rejected">Abgelehnt</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className={`${isMobile ? 'w-full' : 'lg:w-1/2'}`}>
                  <PrescriptionRequestsList 
                    requests={filteredRequests}
                    loading={loading}
                    selectedRequestId={selectedRequestId}
                    onSelectRequest={onSelectRequest}
                  />
                </div>
                
                {(selectedRequest || !isMobile) && (
                  <div className={`${isMobile ? 'w-full mt-4' : 'lg:w-1/2'}`}>
                    {selectedRequest ? (
                      <PrescriptionRequestDetail 
                        request={selectedRequest} 
                        onUpdate={onRequestUpdate}
                      />
                    ) : (
                      <div className="bg-muted/30 p-6 rounded-md border text-center h-96 flex items-center justify-center">
                        <p className="text-muted-foreground">
                          Wählen Sie eine Anfrage aus der Liste aus, um die Details anzuzeigen
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
            onAssignDoctor={onAssignDoctor}
            selectedRequestId={selectedRequestId}
            onSelectRequest={onSelectRequest}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
