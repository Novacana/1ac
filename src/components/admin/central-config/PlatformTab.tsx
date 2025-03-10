
import React from "react";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CentralAdminFormValues } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlatformTabProps {
  form: UseFormReturn<CentralAdminFormValues>;
}

const PlatformTab: React.FC<PlatformTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Plattform-Einstellungen</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Konfigurieren Sie die finanziellen Aspekte der Plattform.
      </p>

      <FormField
        control={form.control}
        name="platformFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plattformgebühr (%)</FormLabel>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Input {...field} />
              </FormControl>
              <Badge variant="outline">%</Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Plattformgebühr in Prozent, die für jede Bestellung oder 
                      vermittelte Rezeptanfrage erhoben wird.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormDescription>
              Der Prozentsatz, der für jede Transaktion erhoben wird. Standard: 4,20%.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
        <div className="flex items-center gap-2 text-amber-800 mb-2">
          <CheckCircle className="h-5 w-5 text-amber-600" />
          <h4 className="font-medium">Angeschlossene Shop-Typen</h4>
        </div>
        <p className="text-sm text-amber-700 mb-3">
          Die Plattform unterstützt die Verwaltung folgender Shop-Typen:
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Apotheken
          </Badge>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Grow-Shops
          </Badge>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Seed-Shops
          </Badge>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            CBD-Shops
          </Badge>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Head-Shops
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default PlatformTab;
