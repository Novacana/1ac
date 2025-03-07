
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, AlertCircle, ShoppingBag } from "lucide-react";
import { configureWooCommerce, loadWooCommerceConfig, isWooCommerceConfigured } from "@/utils/woocommerce";
import { WooCommerceConfig } from "@/types/woocommerce";
import { toast } from "sonner";

const WooCommerceConfig: React.FC = () => {
  const [config, setConfig] = useState<WooCommerceConfig>({
    url: '',
    consumerKey: '',
    consumerSecret: '',
    version: 'wc/v3'
  });
  
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);

  useEffect(() => {
    // Load existing configuration if available
    const savedConfig = loadWooCommerceConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      setIsConfigured(true);
    }
  }, []);

  const handleChange = (field: keyof WooCommerceConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!config.url || !config.consumerKey || !config.consumerSecret) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      // Make sure URL has the correct format
      let url = config.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      // Remove trailing slash if present
      if (url.endsWith('/')) {
        url = url.slice(0, -1);
      }
      
      const updatedConfig = { ...config, url };
      const result = configureWooCommerce(updatedConfig);
      
      if (result) {
        setConfig(updatedConfig);
        setIsConfigured(true);
        toast.success("WooCommerce configuration saved");
      }
    } catch (error) {
      toast.error("Failed to save configuration");
      console.error(error);
    }
  };

  const testConnection = async () => {
    if (!isConfigured) {
      toast.error("Please save the configuration first");
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const url = new URL(`${config.url}/wp-json/${config.version}/products`);
      url.searchParams.append('consumer_key', config.consumerKey);
      url.searchParams.append('consumer_secret', config.consumerSecret);
      url.searchParams.append('per_page', '1'); // Just get one product to test

      const response = await fetch(url.toString());
      
      if (response.ok) {
        setTestResult({
          success: true,
          message: "Connection successful! WooCommerce API is working."
        });
        toast.success("WooCommerce connection successful");
      } else {
        setTestResult({
          success: false,
          message: `Connection failed: ${response.status} ${response.statusText}`
        });
        toast.error(`Connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection error: ${error instanceof Error ? error.message : String(error)}`
      });
      toast.error("Connection failed");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          WooCommerce Integration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="woo-url">Shop URL</Label>
            <Input
              id="woo-url"
              placeholder="https://your-wordpress-site.com"
              value={config.url}
              onChange={(e) => handleChange('url', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="woo-key">Consumer Key</Label>
            <Input
              id="woo-key"
              placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={config.consumerKey}
              onChange={(e) => handleChange('consumerKey', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="woo-secret">Consumer Secret</Label>
            <Input
              id="woo-secret"
              type="password"
              placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={config.consumerSecret}
              onChange={(e) => handleChange('consumerSecret', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="woo-version">API Version</Label>
            <Input
              id="woo-version"
              value={config.version}
              onChange={(e) => handleChange('version', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Default: wc/v3</p>
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
          <Button onClick={handleSave}>Save Configuration</Button>
          <Button
            variant="outline"
            onClick={testConnection}
            disabled={isTesting || !isConfigured}
          >
            {isTesting ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />
            ) : null}
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WooCommerceConfig;
