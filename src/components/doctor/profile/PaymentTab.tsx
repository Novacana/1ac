
import React from "react";
import { CreditCard, Shield, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PaymentTabProps {
  statistics: {
    prescriptionsCount: number;
    patientsCount: number;
    consultationsCount: number;
    totalRevenue: number;
  };
}

// Mocked transaction history data
const transactionHistory = [
  { id: 1, date: '2023-10-15', type: 'Auszahlung', amount: 780.00, status: 'Abgeschlossen' },
  { id: 2, date: '2023-09-15', type: 'Auszahlung', amount: 620.50, status: 'Abgeschlossen' },
  { id: 3, date: '2023-08-15', type: 'Auszahlung', amount: 550.00, status: 'Abgeschlossen' },
];

const PaymentTab: React.FC<PaymentTabProps> = ({ statistics }) => {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Alle Finanzdaten werden nach FHIR Chargeitem und Account Ressourcen konform gespeichert 
          und verarbeitet gemäß GDPR und HIPAA-Richtlinien.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Abrechnungsinformationen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Aktuelle Periode</span>
                <span>{new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Bearbeitete Rezepte</span>
                <span>{statistics.prescriptionsCount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Ausstehender Betrag</span>
                <span className="font-bold">€{(statistics.prescriptionsCount * 20).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Nächste Auszahlung</span>
                <span>{new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString('de-DE')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Zahlungsmethoden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-10 w-10 text-primary" />
                <div>
                  <p className="font-medium">SEPA-Bankverbindung</p>
                  <p className="text-sm text-muted-foreground">DE89 3704 0044 0532 0130 00</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Bearbeiten</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Transaktionsverlauf</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionHistory.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>€{transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Beleg
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Steuerinformationen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Jahresabrechnung 2023</p>
              <p className="text-sm text-muted-foreground">Generiert am 15.01.2024</p>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Herunterladen
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Steuerbescheinigung 2023</p>
              <p className="text-sm text-muted-foreground">Generiert am 15.01.2024</p>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Herunterladen
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button className="w-full md:w-auto">Zahlungsmethode hinzufügen</Button>
      </div>
    </div>
  );
};

export default PaymentTab;
