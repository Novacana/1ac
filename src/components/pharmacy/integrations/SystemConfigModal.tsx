
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, ShieldCheck } from "lucide-react";
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{system.name} konfigurieren</DialogTitle>
          <DialogDescription>
            Passen Sie die Einstellungen für diese Integration an Ihre Bedürfnisse an.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* WooCommerce-spezifische Felder */}
          {system.id === "woocommerce" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shop-url" className="text-right">
                  Shop URL
                </Label>
                <Input
                  id="shop-url"
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                  placeholder="https://mein-shop.de"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="consumer-key" className="text-right">
                  Consumer Key
                </Label>
                <Input
                  id="consumer-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="ck_xxxxxxxxxxxx"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="consumer-secret" className="text-right">
                  Consumer Secret
                </Label>
                <Input
                  id="consumer-secret"
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  placeholder="cs_xxxxxxxxxxxx"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="api-version" className="text-right">
                  API Version
                </Label>
                <Input
                  id="api-version"
                  value={apiVersion}
                  onChange={(e) => setApiVersion(e.target.value)}
                  placeholder="wc/v3"
                  className="col-span-3"
                />
              </div>
            </>
          )}
          
          {/* Shopify-spezifische Felder */}
          {system.id === "shopify" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shop-url" className="text-right">
                  Shop URL
                </Label>
                <Input
                  id="shop-url"
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                  placeholder="mein-shop.myshopify.com"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="access-token" className="text-right">
                  Access Token
                </Label>
                <Input
                  id="access-token"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="shpat_xxxxxxxxxxxx"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="api-version" className="text-right">
                  API Version
                </Label>
                <Input
                  id="api-version"
                  value={apiVersion}
                  onChange={(e) => setApiVersion(e.target.value)}
                  placeholder="2023-10"
                  className="col-span-3"
                />
              </div>
            </>
          )}
          
          {/* Generische Felder für andere Systeme */}
          {system.id !== "woocommerce" && system.id !== "shopify" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="api-key" className="text-right">
                  API-Schlüssel
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk_live_xxxxx"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="webhook" className="text-right">
                  Webhook URL
                </Label>
                <Input
                  id="webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                  className="col-span-3"
                />
              </div>
            </>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notifications" className="text-right">
              Benachrichtigungen
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
              <Label htmlFor="notifications">
                {notificationsEnabled ? "Aktiviert" : "Deaktiviert"}
              </Label>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Notizen
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Zusätzliche Informationen zur Integration..."
              className="col-span-3"
              rows={3}
            />
          </div>
          
          {/* DSGVO-Hinweis */}
          <Alert className="mt-2">
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {getPrivacyNotice()}
            </AlertDescription>
          </Alert>
          
          {/* DSGVO-Zustimmung */}
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="gdpr-consent"
              checked={dataProcessingConsent}
              onCheckedChange={setDataProcessingConsent}
            />
            <Label htmlFor="gdpr-consent" className="text-sm">
              Ich stimme der Verarbeitung der Daten gemäß der Datenschutzrichtlinie zu
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={!dataProcessingConsent}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SystemConfigModal;
