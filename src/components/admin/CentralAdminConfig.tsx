
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Building2, 
  Settings, 
  Users, 
  BarChart3, 
  Globe, 
  ShieldCheck,
  CheckCircle,
  Info
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Form schema for central administration settings
const centralAdminSchema = z.object({
  companyName: z.string().min(2, {
    message: "Der Unternehmensname muss mindestens 2 Zeichen lang sein.",
  }),
  businessType: z.string({
    required_error: "Bitte wählen Sie einen Geschäftstyp aus.",
  }),
  platformFee: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Bitte geben Sie einen gültigen Prozentsatz ein.",
  }),
  gdprOfficer: z.string().min(2, {
    message: "Bitte geben Sie den Namen des Datenschutzbeauftragten ein.",
  }),
  gdprEmail: z.string().email({
    message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  }),
  gdprConsent: z.boolean(),
  legalText: z.string().min(10, {
    message: "Der rechtliche Hinweistext sollte mindestens 10 Zeichen lang sein.",
  }),
  partnerProductsText: z.string().min(10, {
    message: "Die Datenschutzerklärung für Partner-Produkte sollte mindestens 10 Zeichen lang sein.",
  }),
});

type CentralAdminFormValues = z.infer<typeof centralAdminSchema>;

// Default values for the form
const defaultValues: Partial<CentralAdminFormValues> = {
  companyName: "Cannabis Platform GmbH",
  businessType: "platform",
  platformFee: "4.20",
  gdprOfficer: "Max Mustermann",
  gdprEmail: "datenschutz@cannabis-platform.de",
  gdprConsent: true,
  legalText: "Gemäß der Datenschutz-Grundverordnung (DSGVO) werden alle Daten vertraulich behandelt und nur für die Zwecke der Plattform verwendet. Es werden 4,20% Plattformgebühr für jede Bestellung oder vermittelte Rezeptanfrage erhoben.",
  partnerProductsText: "Unsere Plattform stellt ausschließlich Produkte von verifizierten Partnern bereit. Die Verarbeitung von Produktdaten erfolgt gemäß Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung. Partnerdaten werden nach Art. 13 DSGVO transparent verarbeitet und für maximal 3 Jahre nach Vertragsende aufbewahrt, wie in unserer Datenschutzerklärung erläutert."
};

const CentralAdminConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");

  // Initialize the form with react-hook-form
  const form = useForm<CentralAdminFormValues>({
    resolver: zodResolver(centralAdminSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = (data: CentralAdminFormValues) => {
    console.log("Form data submitted:", data);
    
    // Here we would typically send the data to a backend API
    // For now, just show a success toast
    toast.success("Zentrale Verwaltungseinstellungen gespeichert");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>Zentrale Verwaltung</CardTitle>
        </div>
        <CardDescription>
          Konfigurieren Sie die zentralen Einstellungen für den Betrieb der Plattform 
          und die Verwaltung aller angeschlossenen Shops und Dienstleister.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Allgemein</span>
            </TabsTrigger>
            <TabsTrigger value="platform" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Plattform</span>
            </TabsTrigger>
            <TabsTrigger value="gdpr" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">DSGVO</span>
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="general" className="space-y-4">
                <h3 className="text-lg font-medium">Allgemeine Einstellungen</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Die grundlegenden Einstellungen für Ihre Plattform.
                </p>

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unternehmensname</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Der offizielle Name Ihres Unternehmens.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Geschäftstyp</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={field.value === "platform" ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => form.setValue("businessType", "platform")}
                          >
                            <Globe className="mr-2 h-4 w-4" />
                            Plattform
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "marketplace" ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => form.setValue("businessType", "marketplace")}
                          >
                            <Building2 className="mr-2 h-4 w-4" />
                            Marktplatz
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "service" ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => form.setValue("businessType", "service")}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Dienstleister
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Wählen Sie den Hauptgeschäftstyp Ihrer Plattform.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="platform" className="space-y-4">
                <h3 className="text-lg font-medium">Plattform-Einstellungen</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Konfigurieren Sie die finanziellen Aspekte der Plattform.
                </p>

                <FormField
                  control={form.control}
                  name="platformFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plattformgebühr (%)</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <Badge variant="outline">%</Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">
                                Plattformgebühr in Prozent, die für jede Bestellung oder 
                                vermittelte Rezeptanfrage erhoben wird.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormDescription>
                        Der Prozentsatz, der für jede Transaktion erhoben wird. Standard: 4,20%.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
                  <div className="flex items-center gap-2 text-amber-800 mb-2">
                    <CheckCircle className="h-5 w-5 text-amber-600" />
                    <h4 className="font-medium">Angeschlossene Shop-Typen</h4>
                  </div>
                  <p className="text-sm text-amber-700 mb-3">
                    Die Plattform unterstützt die Verwaltung folgender Shop-Typen:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Apotheken
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Grow-Shops
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Seed-Shops
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      CBD-Shops
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Head-Shops
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gdpr" className="space-y-4">
                <h3 className="text-lg font-medium">DSGVO-Einstellungen</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Einstellungen zum Datenschutz gemäß der EU-Datenschutz-Grundverordnung.
                </p>

                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="gdprOfficer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datenschutzbeauftragter</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Name des Datenschutzbeauftragten Ihres Unternehmens.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gdprEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datenschutz-E-Mail</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          Kontakt-E-Mail für Datenschutzanfragen.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rechtlicher Hinweistext</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} />
                        </FormControl>
                        <FormDescription>
                          Dieser Text wird bei Zahlungen und Datenverarbeitung angezeigt.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partnerProductsText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner-Produkte Datenschutzerklärung</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} />
                        </FormControl>
                        <FormDescription>
                          DSGVO-konforme Erklärung zur Verarbeitung von Partner-Produktdaten.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gdprConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>DSGVO-Konformität aktivieren</FormLabel>
                          <FormDescription>
                            Alle Datenverarbeitungsvorgänge werden gemäß DSGVO protokolliert und Nutzer werden um explizite Zustimmung gebeten.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <Separator className="my-6" />

              <CardFooter className="flex justify-between px-0">
                <Button type="button" variant="outline">
                  Zurücksetzen
                </Button>
                <Button type="submit">Einstellungen speichern</Button>
              </CardFooter>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CentralAdminConfig;
