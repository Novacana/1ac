
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Building2, ListPlus, Trash2, Edit } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Partner, PartnerType } from "../PartnerConfig";

interface PartnerListProps {
  partners: Partner[];
  onAddPartnerClick: () => void;
  onToggleStatus: (id: string) => void;
  onRemovePartner: (id: string) => void;
  onViewDetails: (partner: Partner) => void;
}

const PartnerList: React.FC<PartnerListProps> = ({ 
  partners, 
  onAddPartnerClick, 
  onToggleStatus, 
  onRemovePartner, 
  onViewDetails 
}) => {
  const getPartnerTypeLabel = (type: PartnerType) => {
    switch (type) {
      case "pharmacy": return "Apotheke";
      case "growshop": return "Growshop";
      case "seedshop": return "Seedshop";
      case "doctor": return "Arzt";
    }
  };

  const getPartnerTypeBadgeVariant = (type: PartnerType) => {
    switch (type) {
      case "pharmacy": return "default";
      case "growshop": return "secondary";
      case "seedshop": return "outline";
      case "doctor": return "destructive";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Shop-Partner</h3>
          <p className="text-sm text-muted-foreground">
            Verwalten Sie alle angeschlossenen Partner und deren Status
          </p>
        </div>
        <Button 
          onClick={onAddPartnerClick} 
          className="flex items-center gap-2"
        >
          <ListPlus size={16} />
          Partner hinzufügen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partnerliste</CardTitle>
          <CardDescription>
            Alle angeschlossenen Partner und deren aktueller Status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Beitrittsdatum</TableHead>
                <TableHead>Umsatz</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Keine Partner gefunden. Fügen Sie neue Partner hinzu.
                  </TableCell>
                </TableRow>
              ) : (
                partners.map(partner => (
                  <TableRow key={partner.id} className="cursor-pointer hover:bg-muted/80" onClick={() => onViewDetails(partner)}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {partner.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPartnerTypeBadgeVariant(partner.type)}>
                        {getPartnerTypeLabel(partner.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>{partner.joinDate}</TableCell>
                    <TableCell>
                      {partner.revenue ? `${partner.revenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}` : '0,00 €'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={partner.active}
                          onCheckedChange={() => {
                            onToggleStatus(partner.id);
                          }}
                          onClick={(e) => {
                            // Prevent the row click from triggering
                            e.stopPropagation();
                          }}
                        />
                        <span className={partner.active ? "text-green-600" : "text-gray-400"}>
                          {partner.active ? "Aktiv" : "Inaktiv"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(partner);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemovePartner(partner.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default PartnerList;
