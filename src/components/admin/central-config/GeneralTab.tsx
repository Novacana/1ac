
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
import { Button } from "@/components/ui/button";
import { Globe, Building2, Users } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CentralAdminFormValues } from "./types";

interface GeneralTabProps {
  form: UseFormReturn<CentralAdminFormValues>;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Allgemeine Einstellungen</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Die grundlegenden Einstellungen für Ihre Plattform.
      </p>

      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unternehmensname</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              Der offizielle Name Ihres Unternehmens.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="businessType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Geschäftstyp</FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={field.value === "platform" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => form.setValue("businessType", "platform")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Plattform
                </Button>
                <Button
                  type="button"
                  variant={field.value === "marketplace" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => form.setValue("businessType", "marketplace")}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Marktplatz
                </Button>
                <Button
                  type="button"
                  variant={field.value === "service" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => form.setValue("businessType", "service")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Dienstleister
                </Button>
              </div>
            </FormControl>
            <FormDescription>
              Wählen Sie den Hauptgeschäftstyp Ihrer Plattform.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default GeneralTab;
