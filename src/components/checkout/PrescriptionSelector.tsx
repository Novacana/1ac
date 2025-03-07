
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import PrescriptionForm from "./PrescriptionForm";
import PrescriptionQuestionnaire from "./PrescriptionQuestionnaire";

interface PrescriptionSelectorProps {
  hasPrescription: boolean | null;
  setHasPrescription: (value: boolean) => void;
  showQuestionnaire: boolean;
  setShowQuestionnaire: (value: boolean) => void;
}

const PrescriptionSelector: React.FC<PrescriptionSelectorProps> = ({
  hasPrescription, 
  setHasPrescription, 
  showQuestionnaire,
  setShowQuestionnaire
}) => {
  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Rezept Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <p className="text-foreground/80">
            Für den Kauf von Cannabis-Produkten benötigen Sie ein gültiges Rezept.
          </p>
          
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasPrescription" 
                checked={hasPrescription === true}
                onCheckedChange={() => {
                  setHasPrescription(true);
                  setShowQuestionnaire(false);
                }}
              />
              <label
                htmlFor="hasPrescription"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Ich habe bereits ein gültiges Rezept
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="needsPrescription" 
                checked={hasPrescription === false}
                onCheckedChange={() => {
                  setHasPrescription(false);
                  setShowQuestionnaire(true);
                }}
              />
              <label
                htmlFor="needsPrescription"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Ich benötige ein Rezept
              </label>
            </div>
          </div>

          {hasPrescription === true && (
            <PrescriptionForm />
          )}

          {showQuestionnaire && (
            <PrescriptionQuestionnaire />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrescriptionSelector;
