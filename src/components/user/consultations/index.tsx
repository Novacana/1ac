
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { isGDPRCompliant, isHIPAACompliant } from '@/utils/fhirCompliance';
import ConsultationCard from './ConsultationCard';
import ConsultationDetailsDialog from './ConsultationDetailsDialog';
import EmptyConsultationsState from './EmptyConsultationsState';
import { mockConsultations } from './mockData';

const ConsultationsList: React.FC = () => {
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const handleViewDetails = (consultation) => {
    // Check GDPR and HIPAA compliance before showing medical data
    if (isGDPRCompliant(consultation) && isHIPAACompliant(consultation)) {
      setSelectedConsultation(consultation);
      setDetailsOpen(true);
    } else {
      console.error("Compliance check failed for medical data");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meine Beratungen</h2>
        <Button>Neue Beratung anfordern</Button>
      </div>
      
      {mockConsultations.length > 0 ? (
        <div className="space-y-4">
          {mockConsultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <EmptyConsultationsState />
      )}

      <ConsultationDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        consultation={selectedConsultation}
      />
    </div>
  );
};

export default ConsultationsList;
