
import React from "react";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { CentralAdminFormValues } from "./types";

interface GdprTabProps {
  form: UseFormReturn<CentralAdminFormValues>;
}

const GdprTab: React.FC<GdprTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default GdprTab;
