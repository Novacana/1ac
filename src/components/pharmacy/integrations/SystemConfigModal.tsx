
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { IntegrationSystem } from "./IntegrationSystemCard";
import { 
  configureWooCommerce, 
  isWooCommerceConfigured, 
  loadWooCommerceConfig 
} from "@/utils/woocommerce";
import { 
  configureShopify, 
  isShopifyConfigured, 
  loadShopifyConfig 
} from "@/utils/shopify";

// Import the extracted components
import WooCommerceConfigForm from "./config/WooCommerceConfigForm";
import ShopifyConfigForm from "./config/ShopifyConfigForm";
import GenericConfigForm from "./config/GenericConfigForm";
import NotificationsToggle from "./config/NotificationsToggle";
import NotesField from "./config/NotesField";
import GDPRConsent from "./config/GDPRConsent";
import DialogActions from "./config/DialogActions";

interface SystemConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  system: IntegrationSystem | null;
}

const SystemConfigModal: React.FC<SystemConfigModalProps> = ({
  open,
  onOpenChange,
  system
}) => {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [shopUrl, setShopUrl] = useState("");
  const [apiVersion, setApiVersion] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notes, setNotes] = useState("");
  const [dataProcessingConsent, setDataProcessingConsent] = useState(false);
  
  // DSGVO-konformer Hinweis
  const privacyNotice = {
    woocommerce: "Diese Integration wird Produktdaten aus Ihrem WooCommerce-Shop in unser System importieren. Die Daten werden gemäß unserer Datenschutzrichtlinie verarbeitet und auf unseren Servern in der EU gespeichert. Sie können die Verbindung jederzeit trennen.",
    shopify: "Diese Integration wird Produktdaten aus Ihrem Shopify-Shop in unser System importieren. Die Daten werden gemäß unserer Datenschutzrichtlinie verarbeitet und auf unseren Servern in der EU gespeichert. Sie können die Verbindung jederzeit trennen.",
    default: "Diese Integration wird Daten zwischen den Systemen austauschen. Die Daten werden gemäß unserer Datenschutzrichtlinie verarbeitet und auf unseren Servern in der EU gespeichert. Sie können die Verbindung jederzeit trennen."
  };
  
  // Load saved configuration when modal opens
  useEffect(() => {
    if (open && system) {
      // Reset consent
      setDataProcessingConsent(false);
      
      if (system.id === "woocommerce") {
        const config = loadWooCommerceConfig();
        if (config) {
          setShopUrl(config.url || "");
          setApiKey(config.consumerKey || "");
          setApiSecret(config.consumerSecret || "");
          setApiVersion(config.version || "wc/v3");
          setDataProcessingConsent(true); // Bereits konfiguriert, also Zustimmung gegeben
        } else {
          setShopUrl("");
          setApiKey("");
          setApiSecret("");
          setApiVersion("wc/v3");
        }
      } else if (system.id === "shopify") {
        const config = loadShopifyConfig();
        if (config) {
          setShopUrl(config.shopUrl || "");
          setApiKey(config.accessToken || "");
          setApiVersion(config.apiVersion || "2023-10");
          setDataProcessingConsent(true); // Bereits konfiguriert, also Zustimmung gegeben
        } else {
          setShopUrl("");
          setApiKey("");
          setApiVersion("2023-10");
        }
      } else {
        // Andere Integrationen
        setApiKey("");
        setApiSecret("");
        setWebhookUrl("");
        setShopUrl("");
        setApiVersion("");
      }
    }
  }, [open, system]);
  
  if (!system) return null;
  
  // Ermitteln Sie den Datenschutzhinweis basierend auf dem Systemtyp
  const getPrivacyNotice = () => {
    if (system.id === "woocommerce") return privacyNotice.woocommerce;
    if (system.id === "shopify") return privacyNotice.shopify;
    return privacyNotice.default;
  };
  
  const handleSave = () => {
    // Prüfen, ob die DSGVO-Zustimmung gegeben wurde
    if (!dataProcessingConsent) {
      toast.error("Bitte stimmen Sie der Datenverarbeitung zu, um fortzufahren.");
      return;
    }
    
    if (system.id === "woocommerce") {
      if (!shopUrl || !apiKey || !apiSecret) {
        toast.error("Bitte füllen Sie alle erforderlichen Felder aus.");
        return;
      }
      
      configureWooCommerce({
        url: shopUrl,
        consumerKey: apiKey,
        consumerSecret: apiSecret,
        version: apiVersion || "wc/v3"
      });
      
      toast.success(`WooCommerce-Konfiguration für ${shopUrl} gespeichert`);
    } else if (system.id === "shopify") {
      if (!shopUrl || !apiKey) {
        toast.error("Bitte füllen Sie alle erforderlichen Felder aus.");
        return;
      }
      
      configureShopify({
        shopUrl: shopUrl,
        accessToken: apiKey,
        apiVersion: apiVersion || "2023-10"
      });
      
      toast.success(`Shopify-Konfiguration für ${shopUrl} gespeichert`);
    } else {
      // Generische Speicherfunktion für andere Systeme
      toast.success(`Konfiguration für ${system.name} gespeichert`);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{system.name} konfigurieren</DialogTitle>
          <DialogDescription className="text-sm pt-1">
            Passen Sie die Einstellungen für diese Integration an Ihre Bedürfnisse an.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* System specific configuration forms */}
          {system.id === "woocommerce" && (
            <WooCommerceConfigForm
              shopUrl={shopUrl}
              setShopUrl={setShopUrl}
              apiKey={apiKey}
              setApiKey={setApiKey}
              apiSecret={apiSecret}
              setApiSecret={setApiSecret}
              apiVersion={apiVersion}
              setApiVersion={setApiVersion}
            />
          )}
          
          {system.id === "shopify" && (
            <ShopifyConfigForm
              shopUrl={shopUrl}
              setShopUrl={setShopUrl}
              apiKey={apiKey}
              setApiKey={setApiKey}
              apiVersion={apiVersion}
              setApiVersion={setApiVersion}
            />
          )}
          
          {system.id !== "woocommerce" && system.id !== "shopify" && (
            <GenericConfigForm
              apiKey={apiKey}
              setApiKey={setApiKey}
              webhookUrl={webhookUrl}
              setWebhookUrl={setWebhookUrl}
            />
          )}
          
          {/* Notifications toggle */}
          <NotificationsToggle
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
          />
          
          {/* Notes field */}
          <NotesField
            notes={notes}
            setNotes={setNotes}
          />
          
          {/* GDPR consent */}
          <GDPRConsent
            dataProcessingConsent={dataProcessingConsent}
            setDataProcessingConsent={setDataProcessingConsent}
            privacyNotice={getPrivacyNotice()}
          />
        </div>
        
        <DialogFooter>
          <DialogActions
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
            isSaveDisabled={!dataProcessingConsent}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SystemConfigModal;
