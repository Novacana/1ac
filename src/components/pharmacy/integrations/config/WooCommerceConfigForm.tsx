
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WooCommerceConfigProps {
  shopUrl: string;
  setShopUrl: (value: string) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
  apiSecret: string;
  setApiSecret: (value: string) => void;
  apiVersion: string;
  setApiVersion: (value: string) => void;
}

const WooCommerceConfigForm: React.FC<WooCommerceConfigProps> = ({
  shopUrl,
  setShopUrl,
  apiKey,
  setApiKey,
  apiSecret,
  setApiSecret,
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
          placeholder="https://mein-shop.de"
          className="col-span-3 rounded-lg"
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
          className="col-span-3 rounded-lg"
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
          placeholder="wc/v3"
          className="col-span-3 rounded-lg"
        />
      </div>
    </>
  );
};

export default WooCommerceConfigForm;
