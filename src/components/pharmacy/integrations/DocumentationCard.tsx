
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Globe, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const DocumentationCard: React.FC = () => {
  const handleDocumentation = (type: string) => {
    toast.info(`${type} wird geöffnet`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokumentation & Hilfe</CardTitle>
        <CardDescription>
          Ressourcen zur Unterstützung bei der Integration Ihrer Apothekensoftware
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid gap-4 md:grid-cols-3">
          <Button 
            variant="outline" 
            className="justify-start h-auto py-4 px-4"
            onClick={() => handleDocumentation("API Dokumentation")}
          >
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center mb-1">
                <Database className="h-4 w-4 mr-2" />
                <span className="font-medium">API Dokumentation</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Technische Details zur API-Integration
              </span>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
          
          <Button 
            variant="outline" 
            className="justify-start h-auto py-4 px-4"
            onClick={() => handleDocumentation("Entwickler-Portal")}
          >
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center mb-1">
                <Globe className="h-4 w-4 mr-2" />
                <span className="font-medium">Entwickler-Portal</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Tools und Ressourcen für Entwickler
              </span>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
          
          <Button 
            variant="outline" 
            className="justify-start h-auto py-4 px-4"
            onClick={() => handleDocumentation("Support kontaktieren")}
          >
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center mb-1">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="font-medium">Support kontaktieren</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Hilfe bei Integrationsproblemen
              </span>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentationCard;
