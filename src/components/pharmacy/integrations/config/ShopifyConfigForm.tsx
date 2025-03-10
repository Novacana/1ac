
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShopifyConfigProps {
  shopUrl: string;
  setShopUrl: (value: string) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
  apiVersion: string;
  setApiVersion: (value: string) => void;
}

const ShopifyConfigForm: React.FC<ShopifyConfigProps> = ({
  shopUrl,
  setShopUrl,
  apiKey,
  setApiKey,
  apiVersion,
  setApiVersion,
}) => {
  return (
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
          className="col-span-3 rounded-lg"
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
          className="col-span-3 rounded-lg"
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
          className="col-span-3 rounded-lg"
        />
      </div>
    </>
  );
};

export default ShopifyConfigForm;
