
import React, { useState } from "react";
import { toast } from "sonner";
import PartnerList from "./partner/PartnerList";
import AddPartnerForm from "./partner/AddPartnerForm";
import PartnerDetails from "./PartnerDetails";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  // Demo data for partners
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: "p1",
      name: "Grüne Apotheke",
      type: "pharmacy",
      email: "kontakt@gruene-apotheke.de",
      address: "Hauptstraße 42, 10115 Berlin",
      active: true,
      joinDate: "2023-09-15",
      commissionPaid: true,
      revenue: 12580.50,
      payments: [
        { date: "2023-10-01", amount: 528.38, status: "paid" },
        { date: "2023-11-01", amount: 452.15, status: "paid" },
        { date: "2023-12-01", amount: 498.72, status: "paid" }
      ],
      contactPerson: "Dr. Maria Schmidt",
      phone: "+49 30 123456",
      vatId: "DE123456789",
      notes: "Zuverlässiger Partner seit Beginn"
    },
    {
      id: "p2",
      name: "Grow Experts GmbH",
      type: "growshop",
      email: "info@grow-experts.de",
      address: "Plantweg 20, 60313 Frankfurt",
      active: true,
      joinDate: "2023-10-22",
      commissionPaid: false,
      revenue: 8920.75,
      payments: [
        { date: "2023-11-01", amount: 374.67, status: "paid" },
        { date: "2023-12-01", amount: 412.20, status: "overdue" }
      ],
      contactPerson: "Thomas Müller",
      phone: "+49 69 987654",
      vatId: "DE987654321"
    },
    {
      id: "p3",
      name: "Seed Paradise",
      type: "seedshop",
      email: "hello@seedparadise.de",
      address: "Gartenstraße 15, 80331 München",
      active: false,
      joinDate: "2023-11-05",
      commissionPaid: true,
      revenue: 3450.25,
      payments: [
        { date: "2023-12-01", amount: 144.91, status: "paid" }
      ],
      contactPerson: "Laura Becker",
      phone: "+49 89 456123"
    },
    {
      id: "p4",
      name: "Dr. med. Weber",
      type: "doctor",
      email: "dr.weber@medizin.de",
      address: "Praxisweg 10, 40213 Düsseldorf",
      active: true,
      joinDate: "2023-08-10",
      commissionPaid: true,
      revenue: 9870.00,
      payments: [
        { date: "2023-09-01", amount: 414.54, status: "paid" },
        { date: "2023-10-01", amount: 386.82, status: "paid" },
        { date: "2023-11-01", amount: 399.12, status: "paid" },
        { date: "2023-12-01", amount: 425.25, status: "pending" }
      ],
      contactPerson: "Dr. Johannes Weber",
      phone: "+49 211 789456",
      vatId: "DE567891234",
      notes: "Spezialisiert auf Cannabistherapie"
    }
  ]);

  const [showAddPartner, setShowAddPartner] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const handleAddPartner = (newPartnerData: Omit<Partner, 'id' | 'active' | 'joinDate' | 'commissionPaid' | 'revenue' | 'payments'>) => {
    // Create new partner object
    const partner: Partner = {
      id: `p${partners.length + 1}`,
      name: newPartnerData.name,
      type: newPartnerData.type,
      email: newPartnerData.email,
      address: newPartnerData.address,
      contactPerson: newPartnerData.contactPerson,
      phone: newPartnerData.phone,
      vatId: newPartnerData.vatId,
      notes: newPartnerData.notes,
      active: true,
      joinDate: new Date().toISOString().split('T')[0],
      commissionPaid: false,
      revenue: 0,
      payments: []
    };

    setPartners([...partners, partner]);
    setShowAddPartner(false);
    toast.success(`Partner "${partner.name}" erfolgreich hinzugefügt`);
  };

  const togglePartnerStatus = (id: string) => {
    setPartners(partners.map(partner => 
      partner.id === id ? { ...partner, active: !partner.active } : partner
    ));

    const partner = partners.find(p => p.id === id);
    toast.success(`Partner "${partner?.name}" wurde ${!partner?.active ? 'aktiviert' : 'deaktiviert'}`);
  };

  const removePartner = (id: string) => {
    const partner = partners.find(p => p.id === id);
    
    toast.warning(`Partner "${partner?.name}" löschen?`, {
      action: {
        label: "Löschen",
        onClick: () => {
          setPartners(partners.filter(partner => partner.id !== id));
          toast.success(`Partner "${partner?.name}" erfolgreich gelöscht`);
        }
      },
      cancel: {
        label: "Abbrechen",
        onClick: () => {}
      }
    });
  };

  const viewPartnerDetails = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  const updatePartner = (updatedPartner: Partner) => {
    setPartners(partners.map(p => 
      p.id === updatedPartner.id ? updatedPartner : p
    ));
    toast.success(`Partner "${updatedPartner.name}" wurde aktualisiert`);
  };

  const backToList = () => {
    setSelectedPartner(null);
  };

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
