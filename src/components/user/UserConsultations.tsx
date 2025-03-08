
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockConsultations = [
  {
    id: "CON-001",
    date: "2023-06-10",
    status: "completed",
    doctor: "Dr. Schmidt",
    summary: "Beratung zu Schmerzsymptomen"
  },
  {
    id: "CON-002",
    date: "2023-07-20",
    status: "pending",
    doctor: "Dr. Schmidt",
    summary: "Nachuntersuchung und Anpassung der Dosierung"
  },
  {
    id: "CON-003",
    date: "2023-08-15",
    status: "approved",
    doctor: "Dr. Schmidt",
    summary: "Diskussion über alternative Behandlungsoptionen"
  }
];

// Status badge color mapping
const statusColorMap = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  completed: "bg-green-700",
  rejected: "bg-red-500"
};

// Status text mapping
const statusTextMap = {
  pending: "Ausstehend",
  approved: "Genehmigt",
  completed: "Abgeschlossen",
  rejected: "Abgelehnt"
};

const UserConsultations: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meine Konsultationen</CardTitle>
        <Button size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Neue Anfrage
        </Button>
      </CardHeader>
      <CardContent>
        {mockConsultations.length > 0 ? (
          <div className="space-y-4">
            {mockConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="border rounded-md p-4 hover:bg-accent/50 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{consultation.id}</h3>
                      <Badge className={statusColorMap[consultation.status as keyof typeof statusColorMap]}>
                        {statusTextMap[consultation.status as keyof typeof statusTextMap]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(consultation.date).toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">{consultation.doctor}</span> • {consultation.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Nachricht
                    </Button>
                    {consultation.status === "completed" && (
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Rezept
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground mb-4">Sie haben noch keine Konsultationen.</p>
            <Button>Konsultation anfordern</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserConsultations;
