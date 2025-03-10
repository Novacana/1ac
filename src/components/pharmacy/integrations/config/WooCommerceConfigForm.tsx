
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WooCommerceConfigFormProps {
  shopUrl: string;
  setShopUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  apiSecret: string;
  setApiSecret: (secret: string) => void;
  apiVersion: string;
  setApiVersion: (version: string) => void;
  partnerName?: string;
  setPartnerName?: (name: string) => void;
}

const WooCommerceConfigForm: React.FC<WooCommerceConfigFormProps> = ({
  shopUrl,
  setShopUrl,
  apiKey,
  setApiKey,
  apiSecret,
  setApiSecret,
  apiVersion,
  setApiVersion,
  partnerName,
  setPartnerName
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="shop-url">WooCommerce Shop URL</Label>
        <Input
          id="shop-url"
          placeholder="https://yourshop.com"
          value={shopUrl}
          onChange={(e) => setShopUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Die vollständige URL zu Ihrem WooCommerce-Shop.
        </p>
      </div>
      
      {setPartnerName && (
        <div className="space-y-2">
          <Label htmlFor="partner-name">Partner Name</Label>
          <Input
            id="partner-name"
            placeholder="Apotheke Name"
            value={partnerName || ""}
            onChange={(e) => setPartnerName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Der Name des Partners, der in Benachrichtigungen angezeigt wird.
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="consumer-key">Consumer Key</Label>
        <Input
          id="consumer-key"
          placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxx"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="consumer-secret">Consumer Secret</Label>
        <Input
          id="consumer-secret"
          placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxx"
          type="password"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="api-version">API Version</Label>
        <Select
          value={apiVersion}
          onValueChange={setApiVersion}
        >
          <SelectTrigger id="api-version">
            <SelectValue placeholder="API Version wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wc/v3">WooCommerce v3 (Standard)</SelectItem>
            <SelectItem value="wc/v2">WooCommerce v2</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Die zu verwendende WooCommerce API-Version.
        </p>
      </div>
    </>
  );
};

export default WooCommerceConfigForm;
