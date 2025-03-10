
import React from "react";
import { Button } from "@/components/ui/button";
import { gdprNotice } from "./hooks/useAdvisorGdpr";

interface GdprConsentBannerProps {
  onConsent: () => void;
}

const GdprConsentBanner: React.FC<GdprConsentBannerProps> = ({ onConsent }) => {
  return (
    <div className="border rounded-md p-3 bg-primary/10 text-sm">
      <h4 className="font-medium mb-2">DSGVO-Hinweis</h4>
      <p className="text-xs mb-3">{gdprNotice}</p>
      <Button 
        variant="default" 
        size="sm"
        className="w-full"
        onClick={onConsent}
      >
        Ich stimme der Verarbeitung meiner Sprachdaten zu
      </Button>
    </div>
  );
};

export default GdprConsentBanner;
