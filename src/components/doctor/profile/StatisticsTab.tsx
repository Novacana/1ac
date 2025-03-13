
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { convertDoctorToFHIRPractitioner } from "@/utils/fhirCompliance";
import { useAuth } from "@/contexts/AuthContext";

interface StatisticsTabProps {
  statistics: {
    prescriptionsCount: number;
    patientsCount: number;
    consultationsCount: number;
    totalRevenue: number;
  };
}

const StatisticsTab: React.FC<StatisticsTabProps> = ({ statistics }) => {
  const { user } = useAuth();
  const [fhirData, setFhirData] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  
  // Generate mock historical data for demonstration
  useEffect(() => {
    // Convert doctor data to FHIR format
    const generateFhirData = async () => {
      if (user) {
        const practitionerResource = await convertDoctorToFHIRPractitioner(user);
        setFhirData(practitionerResource);
      }
    };
    
    generateFhirData();
    
    // Generate monthly data for charts
    const generateMonthlyData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const data = months.map(month => {
        // Create realistic looking but randomized data based on current statistics
        const prescriptions = Math.floor(statistics.prescriptionsCount / 6 * (0.8 + Math.random() * 0.4));
        const patients = Math.floor(statistics.patientsCount / 6 * (0.8 + Math.random() * 0.4));
        const revenue = Math.floor(statistics.totalRevenue / 6 * (0.8 + Math.random() * 0.4));
        
        return {
          name: month,
          prescriptions,
          patients,
          revenue
        };
      });
      
      setMonthlyData(data);
    };
    
    generateMonthlyData();
  }, [user, statistics]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold">{statistics.prescriptionsCount}</h3>
              <p className="text-sm text-muted-foreground mt-1">Rezepte insgesamt</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold">{statistics.patientsCount}</h3>
              <p className="text-sm text-muted-foreground mt-1">Patienten</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold">€{statistics.totalRevenue.toFixed(2)}</h3>
              <p className="text-sm text-muted-foreground mt-1">Gesamtumsatz</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {fhirData && (
        <Alert className="bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            FHIR Practitioner Resource aktiv: ID {fhirData.id}, Qualifikation: {fhirData.qualification?.[0]?.code?.text || 'Allgemeinarzt'}
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Rezepte pro Monat</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    return [value, name === "prescriptions" ? "Rezepte" : name];
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="prescriptions" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Rezepte"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Patienten & Umsatz pro Monat</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="patients" name="Patienten" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="revenue" name="Umsatz (€)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsTab;
