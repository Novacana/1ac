
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, AlertCircle, ShoppingBag } from "lucide-react";
import { configureShopify, loadShopifyConfig, isShopifyConfigured } from "@/utils/shopify";
import type { ShopifyConfig as ShopifyConfigType } from "@/types/shopify";
import { toast } from "sonner";

const ShopifyConfig: React.FC = () => {
  const [config, setConfig] = useState<ShopifyConfigType>({
    shopUrl: '',
    accessToken: '',
    apiVersion: '2023-10'
  });
  
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);

  useEffect(() => {
    // Load existing configuration if available
    const savedConfig = loadShopifyConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      setIsConfigured(true);
    }
  }, []);

  const handleChange = (field: keyof ShopifyConfigType, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!config.shopUrl || !config.accessToken) {
      toast.error("Bitte füllen Sie alle erforderlichen Felder aus");
      return;
    }
    
    try {
      // Make sure URL has the correct format (remove http/https as Shopify API URLs are just the shop name)
      let shopUrl = config.shopUrl;
      if (shopUrl.startsWith('http://')) {
        shopUrl = shopUrl.substring(7);
      } else if (shopUrl.startsWith('https://')) {
        shopUrl = shopUrl.substring(8);
      }
      
      // Remove any trailing slash
      if (shopUrl.endsWith('/')) {
        shopUrl = shopUrl.slice(0, -1);
      }
      
      // Remove .myshopify.com if included (we'll add it back in the API calls)
      if (shopUrl.includes('.myshopify.com')) {
        shopUrl = shopUrl.replace('.myshopify.com', '');
      }
      
      const updatedConfig = { ...config, shopUrl };
      const result = configureShopify(updatedConfig);
      
      if (result) {
        setConfig(updatedConfig);
        setIsConfigured(true);
        toast.success("Shopify-Konfiguration gespeichert");
      }
    } catch (error) {
      toast.error("Fehler beim Speichern der Konfiguration");
      console.error(error);
    }
  };

  const testConnection = async () => {
    if (!isConfigured) {
      toast.error("Bitte speichern Sie zuerst die Konfiguration");
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const url = `https://${config.shopUrl}.myshopify.com/admin/api/${config.apiVersion}/shop.json`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': config.accessToken
        }
      });
      
      if (response.ok) {
        setTestResult({
          success: true,
          message: "Verbindung erfolgreich! Shopify API funktioniert."
        });
        toast.success("Shopify-Verbindung erfolgreich");
      } else {
        setTestResult({
          success: false,
          message: `Verbindung fehlgeschlagen: ${response.status} ${response.statusText}`
        });
        toast.error(`Verbindung fehlgeschlagen: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Verbindungsfehler: ${error instanceof Error ? error.message : String(error)}`
      });
      toast.error("Verbindung fehlgeschlagen");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Shopify Integration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop-url">Shop Name</Label>
            <Input
              id="shop-url"
              placeholder="your-store-name"
              value={config.shopUrl}
              onChange={(e) => handleChange('shopUrl', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Beispiel: your-store-name (ohne .myshopify.com)</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="access-token">Access Token</Label>
            <Input
              id="access-token"
              type="password"
              placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={config.accessToken}
              onChange={(e) => handleChange('accessToken', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-version">API Version</Label>
            <Input
              id="api-version"
              value={config.apiVersion}
              onChange={(e) => handleChange('apiVersion', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Standard: 2023-10</p>
          </div>
        </div>
        
        {testResult && (
          <div className={`p-3 rounded-md ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <Check className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <p className="text-sm">{testResult.message}</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-3">
          <Button onClick={handleSave}>Konfiguration speichern</Button>
          <Button
            variant="outline"
            onClick={testConnection}
            disabled={isTesting || !isConfigured}
          >
            {isTesting ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />
            ) : null}
            Verbindung testen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopifyConfig;
