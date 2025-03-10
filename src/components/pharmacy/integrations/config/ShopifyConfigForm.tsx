
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ShopifyConfigFormProps {
  shopUrl: string;
  setShopUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  apiVersion: string;
  setApiVersion: (version: string) => void;
  partnerName?: string;
  setPartnerName?: (name: string) => void;
}

const ShopifyConfigForm: React.FC<ShopifyConfigFormProps> = ({
  shopUrl,
  setShopUrl,
  apiKey,
  setApiKey,
  apiVersion,
  setApiVersion,
  partnerName,
  setPartnerName
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="shop-url">Shopify Shop URL</Label>
        <Input
          id="shop-url"
          placeholder="your-shop.myshopify.com"
          value={shopUrl}
          onChange={(e) => setShopUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Die Shop-URL ohne https:// (z.B. your-shop.myshopify.com).
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
        <Label htmlFor="access-token">Access Token</Label>
        <Input
          id="access-token"
          placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Ihr Shopify Admin API Access Token.
        </p>
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
            <SelectItem value="2023-10">2023-10 (aktuell)</SelectItem>
            <SelectItem value="2023-07">2023-07</SelectItem>
            <SelectItem value="2023-04">2023-04</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Die zu verwendende Shopify API-Version.
        </p>
      </div>
    </>
  );
};

export default ShopifyConfigForm;
