
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getPrescriptionRequests, 
  updatePrescriptionRequest, 
  assignDoctorToRequest 
} from '@/data/prescriptions';
import { PrescriptionRequest } from '@/types/prescription';
import { toast } from 'sonner';
import { logGdprActivity } from '@/utils/fhirCompliance';
import { convertToFHIRMedicationRequest } from '@/utils/fhir/resources/medicationRequest';

export const usePrescriptionRequests = (userId?: string) => {
  const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [mainSection, setMainSection] = useState<'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar'>('open_requests');

  // Fetch prescription requests
  const fetchRequests = useCallback(async () => {
    if (loading) {
      try {
        const data = await getPrescriptionRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching prescription requests:', error);
        toast.error('Fehler beim Laden der Anfragen');
      } finally {
        setLoading(false);
      }
    }
  }, [loading]);

  // Handle request selection
  const handleRequestSelect = useCallback((requestId: string) => {
    setSelectedRequestId(requestId);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Handle section change
  const handleSectionChange = useCallback((section: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar') => {
    setMainSection(section);
  }, []);

  // Handle request approval
  const handleApprove = useCallback(async (requestId: string) => {
    if (!userId) return;
    
    try {
      // Update request status in database would happen here
      // For demo purposes, we'll just update the local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, status: 'approved' as const } : req
        )
      );
      
      toast.success('Rezept wurde freigegeben');
      
      // Log GDPR activity for prescription approval
      await logGdprActivity(
        userId,
        'prescription_approval',
        `Doctor approved prescription request ${requestId}`
      );
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Fehler bei der Freigabe des Rezepts');
    }
  }, [userId]);

  // Handle request rejection
  const handleReject = useCallback(async (requestId: string) => {
    if (!userId) return;
    
    try {
      // Update request status in database would happen here
      // For demo purposes, we'll just update the local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, status: 'rejected' as const } : req
        )
      );
      
      toast.success('Rezept wurde abgelehnt');
      
      // Log GDPR activity for prescription rejection
      await logGdprActivity(
        userId,
        'prescription_rejection',
        `Doctor rejected prescription request ${requestId}`
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Fehler bei der Ablehnung des Rezepts');
    }
  }, [userId]);
  
  // Handle request update
  const handleRequestUpdate = useCallback((updatedRequest: PrescriptionRequest) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === updatedRequest.id ? updatedRequest : req
      )
    );
  }, []);
  
  // Handle doctor assignment - now automatically navigates to prescription tab
  const handleAssignDoctor = useCallback(async (requestId: string): Promise<{success: boolean, message: string}> => {
    if (!userId) return { success: false, message: 'Kein angemeldeter Arzt' };
    
    try {
      // Assign doctor to request
      const updatedRequest = await assignDoctorToRequest(requestId, userId);
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, assignedDoctorId: userId } : req
        )
      );
      
      // Select the request automatically
      setSelectedRequestId(requestId);
      
      // Switch to prescriptions tab with status "pending"
      setActiveTab('pending');
      
      // Switch to prescriptions section (this is the new addition)
      setMainSection('prescriptions');
      
      // Log GDPR activity
      await logGdprActivity(
        userId,
        'patient_assignment',
        `Doctor assigned to patient request ${requestId}`
      );
      
      // Create FHIR-compliant resource for compliance tracking
      const request = requests.find(req => req.id === requestId);
      if (request) {
        const fhirRequest = convertToFHIRMedicationRequest({
          id: request.id,
          patientName: request.patientName,
          patientId: `patient-${requestId}`,
          requesterId: userId,
          requesterName: "Doctor",
          status: "pending"
        });
        
        console.log("FHIR MedicationRequest created for compliance:", fhirRequest);
      }
      
      return { success: true, message: 'Sie wurden dieser Anfrage zugewiesen' };
    } catch (error) {
      console.error("Error assigning doctor:", error);
      return { success: false, message: 'Fehler bei der Zuweisung' };
    }
  }, [userId, requests, setMainSection, setActiveTab, setSelectedRequestId]);

  // Memoize filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      if (activeTab === 'pending') {
        return req.status === 'pending';
      } else if (activeTab === 'approved') {
        return req.status === 'approved';
      } else if (activeTab === 'rejected') {
        return req.status === 'rejected';
      } else if (activeTab === 'needs_info') {
        return req.status === 'needs_more_info';
      }
      return true; // For 'all' tab
    });
  }, [requests, activeTab]);

  // Memoize selected request
  const selectedRequest = useMemo(() => 
    requests.find(req => req.id === selectedRequestId), 
    [requests, selectedRequestId]
  );

  // Trigger fetch on mount
  useEffect(() => {
    if (loading) {
      fetchRequests();
    }
  }, [fetchRequests, loading]);

  return {
    requests,
    loading,
    selectedRequestId,
    activeTab,
    mainSection,
    selectedRequest,
    filteredRequests,
    handleRequestSelect,
    handleTabChange,
    handleSectionChange,
    handleApprove,
    handleReject,
    handleRequestUpdate,
    handleAssignDoctor,
    fetchRequests
  };
};
