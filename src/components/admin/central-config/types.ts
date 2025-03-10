
import { z } from "zod";

// Form schema for central administration settings
export const centralAdminSchema = z.object({
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

export type CentralAdminFormValues = z.infer<typeof centralAdminSchema>;

// Default values for the form
export const defaultValues: Partial<CentralAdminFormValues> = {
  companyName: "Cannabis Platform GmbH",
  businessType: "platform",
  platformFee: "4.20",
  gdprOfficer: "Max Mustermann",
  gdprEmail: "datenschutz@cannabis-platform.de",
  gdprConsent: true,
  legalText: "Gemäß der Datenschutz-Grundverordnung (DSGVO) werden alle Daten vertraulich behandelt und nur für die Zwecke der Plattform verwendet. Es werden 4,20% Plattformgebühr für jede Bestellung oder vermittelte Rezeptanfrage erhoben.",
  partnerProductsText: "Unsere Plattform stellt ausschließlich Produkte von verifizierten Partnern bereit. Die Verarbeitung von Produktdaten erfolgt gemäß Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung. Partnerdaten werden nach Art. 13 DSGVO transparent verarbeitet und für maximal 3 Jahre nach Vertragsende aufbewahrt, wie in unserer Datenschutzerklärung erläutert."
};
