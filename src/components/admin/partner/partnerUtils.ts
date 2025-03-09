
import { PartnerType } from "../PartnerConfig";

export const getPartnerTypeLabel = (type: PartnerType): string => {
  switch (type) {
    case "pharmacy": return "Apotheke";
    case "growshop": return "Growshop";
    case "seedshop": return "Seedshop";
    case "doctor": return "Arzt";
  }
};

export const getPartnerTypeBadgeVariant = (type: PartnerType): string => {
  switch (type) {
    case "pharmacy": return "default";
    case "growshop": return "secondary";
    case "seedshop": return "outline";
    case "doctor": return "destructive";
  }
};

// Format currency according to German locale
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
};

// Calculate total payments for a partner by status
export const calculatePaymentTotal = (payments: {amount: number, status: string}[] = [], status?: string): number => {
  return payments
    .filter(payment => !status || payment.status === status)
    .reduce((total, payment) => total + payment.amount, 0);
};
