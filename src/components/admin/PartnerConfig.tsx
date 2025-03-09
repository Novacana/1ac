
import React from "react";
import PartnerList from "./partner/PartnerList";
import AddPartnerForm from "./partner/AddPartnerForm";
import PartnerDetails from "./PartnerDetails";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePartnerManagement } from "@/hooks/usePartnerManagement";

// Partner types, expanded to include doctors
export type PartnerType = "pharmacy" | "growshop" | "seedshop" | "doctor";

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  email: string;
  address: string;
  active: boolean;
  joinDate: string;
  commissionPaid: boolean;
  revenue?: number;
  payments?: {
    date: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
  }[];
  contactPerson?: string;
  phone?: string;
  vatId?: string;
  notes?: string;
}

const PartnerConfig: React.FC = () => {
  const {
    partners,
    showAddPartner,
    selectedPartner,
    setShowAddPartner,
    handleAddPartner,
    togglePartnerStatus,
    removePartner,
    viewPartnerDetails,
    updatePartner,
    backToList
  } = usePartnerManagement();

  // If a partner is selected, show the details view
  if (selectedPartner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={backToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zur Partnerliste
          </Button>
          <h3 className="text-lg font-medium">Partner: {selectedPartner.name}</h3>
        </div>
        <PartnerDetails 
          partner={selectedPartner} 
          onUpdate={updatePartner}
          onBack={backToList}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showAddPartner ? (
        <AddPartnerForm 
          onAddPartner={handleAddPartner}
          onCancel={() => setShowAddPartner(false)}
        />
      ) : (
        <PartnerList
          partners={partners}
          onAddPartnerClick={() => setShowAddPartner(true)}
          onToggleStatus={togglePartnerStatus}
          onRemovePartner={removePartner}
          onViewDetails={viewPartnerDetails}
        />
      )}
    </div>
  );
};

export default PartnerConfig;
