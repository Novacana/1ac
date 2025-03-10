
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { centralAdminSchema, defaultValues } from "./central-config/types";
import CentralAdminTabs from "./central-config/CentralAdminTabs";

const CentralAdminConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");

  // Initialize the form with react-hook-form
  const form = useForm({
    resolver: zodResolver(centralAdminSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = (data: any) => {
    console.log("Form data submitted:", data);
    
    // Here we would typically send the data to a backend API
    // For now, just show a success toast
    toast.success("Zentrale Verwaltungseinstellungen gespeichert");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>Zentrale Verwaltung</CardTitle>
        </div>
        <CardDescription>
          Konfigurieren Sie die zentralen Einstellungen für den Betrieb der Plattform 
          und die Verwaltung aller angeschlossenen Shops und Dienstleister.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CentralAdminTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              form={form} 
            />

            <Separator className="my-6" />

            <CardFooter className="flex justify-between px-0">
              <Button type="button" variant="outline">
                Zurücksetzen
              </Button>
              <Button type="submit">Einstellungen speichern</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CentralAdminConfig;
