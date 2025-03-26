
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getPrescriptionRequests } from '@/data/prescriptionRequests';
import { PrescriptionRequest } from '@/types/prescription';
import { toast } from 'sonner';
import { logGdprActivity } from '@/utils/fhirCompliance';

export const usePrescriptionRequests = (userId?: string) => {
  const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

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
  
  // Handle doctor assignment
  const handleAssignDoctor = useCallback((requestId: string) => {
    if (!userId) return;
    
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, assignedDoctorId: userId } : req
      )
    );
    toast.success('Sie wurden dieser Anfrage zugewiesen');
  }, [userId]);

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
    selectedRequest,
    filteredRequests,
    handleRequestSelect,
    handleTabChange,
    handleApprove,
    handleReject,
    handleRequestUpdate,
    handleAssignDoctor,
    fetchRequests
  };
};
