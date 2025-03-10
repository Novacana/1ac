
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Euro, Percent, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PLATFORM_COMMISSION_RATE = 4.2; // 4.20%

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  processingFee: number;
  apiKey?: string;
}

interface Commission {
  month: string;
  orders: number;
  prescriptions: number;
  totalAmount: number;
  commissionAmount: number;
  paid: boolean;
}

const PaymentConfig: React.FC = () => {
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "stripe", name: "Stripe", enabled: true, processingFee: 2.9 },
    { id: "paypal", name: "PayPal", enabled: false, processingFee: 3.4 },
    { id: "klarna", name: "Klarna", enabled: false, processingFee: 2.49 },
    { id: "mollie", name: "Mollie", enabled: false, processingFee: 1.8 },
    { id: "invoice", name: "Rechnung", enabled: true, processingFee: 0 },
  ]);
  
  // Commission history state
  const [commissions, setCommissions] = useState<Commission[]>([
    {
      month: "März 2024",
      orders: 56,
      prescriptions: 23,
      totalAmount: 8430.75,
      commissionAmount: 354.09,
      paid: true
    },
    {
      month: "Februar 2024",
      orders: 42,
      prescriptions: 18,
      totalAmount: 6745.50,
      commissionAmount: 283.31,
      paid: true
    },
    {
      month: "Januar 2024",
      orders: 38,
      prescriptions: 15,
      totalAmount: 5890.25,
      commissionAmount: 247.39,
      paid: false
    }
  ]);

  // Payment API keys state
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState("");
  const [mollieApiKey, setMollieApiKey] = useState("");
  const [mollieProfileId, setMollieProfileId] = useState("");

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
    
    const method = paymentMethods.find(m => m.id === id);
    toast.success(`Zahlungsmethode "${method?.name}" ${method?.enabled ? 'deaktiviert' : 'aktiviert'}`);
  };

  const saveStripeConfig = () => {
    if (!stripeApiKey || !stripeWebhookSecret) {
      toast.error("Bitte füllen Sie alle Felder aus");
      return;
    }

    // Save the API key to the payment method
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === "stripe" ? { ...method, apiKey: stripeApiKey } : method
      )
    );

    toast.success("Stripe-Konfiguration gespeichert");
  };

  const saveMollieConfig = () => {
    if (!mollieApiKey) {
      toast.error("Bitte geben Sie den Mollie API-Schlüssel ein");
      return;
    }

    // Save the API key to the payment method
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === "mollie" ? { ...method, apiKey: mollieApiKey } : method
      )
    );

    toast.success("Mollie-Konfiguration gespeichert");
  };

  const markAsPaid = (month: string) => {
    setCommissions(prevCommissions =>
      prevCommissions.map(commission =>
        commission.month === month ? { ...commission, paid: true } : commission
      )
    );

    toast.success(`Provision für ${month} als bezahlt markiert`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Zahlungseinstellungen</h3>
        <p className="text-sm text-muted-foreground">
          Konfigurieren Sie die Zahlungsmethoden und verfolgen Sie Provisionen
        </p>
      </div>

      {/* Platform Commission Info Card */}
      <Card className="bg-primary/5 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Platform-Provision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">{PLATFORM_COMMISSION_RATE}%</div>
            <div className="text-sm text-muted-foreground">
              Aktuelle Provisions-Rate für alle Bestellungen und vermittelten Rezeptanfragen
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Diese Provision wird automatisch für jede verarbeitete Bestellung und 
            Rezeptanfrage auf der Plattform berechnet. Die monatliche Abrechnung erfolgt 
            zum Monatsende und kann unten eingesehen werden.</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Card */}
      <Card>
        <CardHeader>
          <CardTitle>Zahlungsmethoden</CardTitle>
          <CardDescription>
            Aktivieren oder deaktivieren Sie Zahlungsmethoden für Ihren Shop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zahlungsanbieter</TableHead>
                <TableHead>Gebühr</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">API Konfiguration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMethods.map(method => (
                <TableRow key={method.id}>
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell>
                    {method.processingFee > 0 ? (
                      <span>{method.processingFee}%</span>
                    ) : (
                      <span>Keine Gebühr</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={method.enabled}
                        onCheckedChange={() => togglePaymentMethod(method.id)}
                      />
                      <span className={method.enabled ? "text-green-600" : "text-gray-400"}>
                        {method.enabled ? "Aktiviert" : "Deaktiviert"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {method.id === "stripe" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => 
                          document.getElementById("stripe-config")?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        Konfigurieren
                      </Button>
                    )}
                    {method.id === "mollie" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => 
                          document.getElementById("mollie-config")?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        Konfigurieren
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stripe Configuration Card */}
      <Card id="stripe-config">
        <CardHeader>
          <CardTitle>Stripe Konfiguration</CardTitle>
          <CardDescription>
            Verbinden Sie Ihren Stripe-Account mit dem Shop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe-api-key">Stripe API Key</Label>
            <div className="relative">
              <Input 
                id="stripe-api-key" 
                type="password"
                value={stripeApiKey}
                onChange={(e) => setStripeApiKey(e.target.value)}
                placeholder="sk_test_..." 
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Finden Sie Ihren API-Schlüssel im Stripe Dashboard unter Entwickler &gt; API-Schlüssel</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stripe-webhook-secret">Webhook Secret</Label>
            <div className="relative">
              <Input 
                id="stripe-webhook-secret" 
                type="password"
                value={stripeWebhookSecret}
                onChange={(e) => setStripeWebhookSecret(e.target.value)}
                placeholder="whsec_..." 
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Das Webhook Secret finden Sie nach dem Erstellen eines Webhook-Endpunkts im Stripe Dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveStripeConfig}>Konfiguration speichern</Button>
        </CardFooter>
      </Card>

      {/* Mollie Configuration Card */}
      <Card id="mollie-config">
        <CardHeader>
          <CardTitle>Mollie Konfiguration</CardTitle>
          <CardDescription>
            Verbinden Sie Ihren Mollie-Account mit dem Shop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mollie-api-key">Mollie API Key</Label>
            <div className="relative">
              <Input 
                id="mollie-api-key" 
                type="password"
                value={mollieApiKey}
                onChange={(e) => setMollieApiKey(e.target.value)}
                placeholder="test_..." 
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Den API-Schlüssel finden Sie im Mollie Dashboard unter Entwickler &gt; API-Schlüssel</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mollie-profile-id">Profil ID (optional)</Label>
            <div className="relative">
              <Input 
                id="mollie-profile-id" 
                value={mollieProfileId}
                onChange={(e) => setMollieProfileId(e.target.value)}
                placeholder="pfl_..." 
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Die Profil-ID können Sie optional angeben, wenn Sie mehrere Profile in Ihrem Mollie-Account haben</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-2">
            <p className="text-sm text-blue-700">
              <strong>Hinweis zur DSGVO-Konformität:</strong> Mollie verarbeitet Zahlungsdaten gemäß der DSGVO. 
              Die Verarbeitung erfolgt auf Rechtsgrundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
              Personenbezogene Daten werden nur für die Dauer der gesetzlichen Aufbewahrungsfristen gespeichert.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveMollieConfig}>Konfiguration speichern</Button>
        </CardFooter>
      </Card>

      {/* Commission History Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Provisionsübersicht
          </CardTitle>
          <CardDescription>
            Monatliche Übersicht der Plattform-Provisionen ({PLATFORM_COMMISSION_RATE}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Monat</TableHead>
                <TableHead>Bestellungen</TableHead>
                <TableHead>Rezeptanfragen</TableHead>
                <TableHead>Umsatz</TableHead>
                <TableHead>Provision ({PLATFORM_COMMISSION_RATE}%)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.map(commission => (
                <TableRow key={commission.month}>
                  <TableCell className="font-medium">{commission.month}</TableCell>
                  <TableCell>{commission.orders}</TableCell>
                  <TableCell>{commission.prescriptions}</TableCell>
                  <TableCell>{formatCurrency(commission.totalAmount)}</TableCell>
                  <TableCell>{formatCurrency(commission.commissionAmount)}</TableCell>
                  <TableCell>
                    {commission.paid ? (
                      <span className="text-green-600 font-medium">Bezahlt</span>
                    ) : (
                      <span className="text-amber-600 font-medium">Ausstehend</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!commission.paid && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsPaid(commission.month)}
                      >
                        Als bezahlt markieren
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfig;
