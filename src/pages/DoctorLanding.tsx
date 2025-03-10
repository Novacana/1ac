
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Euro, Shield, Clock, Calendar, EuroIcon, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";

const DoctorLanding: React.FC = () => {
  return (
    <Layout noAdvisor fullWidth className="bg-background">
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Badge variant="success" className="mb-4">Für Ärzte</Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Digitalisieren Sie Ihre Privatrezepte für Medizinalcannabis</h1>
            <p className="text-lg text-muted-foreground">
              Verbessern Sie die Patientenversorgung und steigern Sie Ihr Einkommen durch sichere und einfache digitale Rezeptverwaltung.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                Jetzt registrieren <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Mehr erfahren
              </Button>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-primary/20">
            <img 
              src="/lovable-uploads/dc40d978-afef-449a-8fd1-ebd973d2ec3f.png" 
              alt="Arzt nutzt digitale Plattform" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5"></div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Warum Ärzte unsere Plattform wählen</h2>
            <p className="text-muted-foreground">
              Unsere Plattform bietet zahlreiche Vorteile für Ärzte, die Privatrezepte für Medizinalcannabis ausstellen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Euro className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Zusätzliches Einkommen</h3>
                <p className="text-muted-foreground">
                  Verdienen Sie 14,20€ pro ausgestelltem Privatrezept – einfach und vollständig konform mit allen rechtlichen Anforderungen.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">DSGVO-konform</h3>
                <p className="text-muted-foreground">
                  Alle Patientendaten werden sicher und gemäß DSGVO verarbeitet. Unsere Plattform erfüllt höchste Datenschutzstandards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Zeitersparnis</h3>
                <p className="text-muted-foreground">
                  Reduzieren Sie den administrativen Aufwand und konzentrieren Sie sich auf das Wesentliche – die Patientenversorgung.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">So funktioniert's</h2>
          <p className="text-muted-foreground">
            In wenigen einfachen Schritten können Sie unsere Plattform nutzen und Ihre Privatrezepte digital verwalten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Einfache Registrierung</h3>
                  <p className="text-muted-foreground">
                    Registrieren Sie sich als Arzt und verifizieren Sie Ihre Approbation. Der Prozess dauert nur wenige Minuten.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Rezepte digital ausstellen</h3>
                  <p className="text-muted-foreground">
                    Stellen Sie Privatrezepte für Medizinalcannabis digital aus – mit automatischer Validierung und FHIR-Standard-Anbindung.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Verdienen Sie mit</h3>
                  <p className="text-muted-foreground">
                    Für jedes ausgestellte Privatrezept erhalten Sie 14,20€. Die Abrechnung erfolgt monatlich und transparent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <img 
              src="/lovable-uploads/e309be49-454e-4b04-b656-75ae60cb7145.png" 
              alt="Arzt stellt digitales Rezept aus" 
              className="rounded-xl shadow-lg border border-primary/20"
            />
          </div>
        </div>
      </section>

      {/* Earnings Calculation */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Ihr Verdienstpotenzial</h2>
            <p className="text-muted-foreground">
              Berechnen Sie, wie viel Sie zusätzlich verdienen können.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">5 Rezepte pro Woche</span>
                      <span className="font-bold">71€</span>
                    </div>
                    <Progress value={20} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">10 Rezepte pro Woche</span>
                      <span className="font-bold">142€</span>
                    </div>
                    <Progress value={40} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">20 Rezepte pro Woche</span>
                      <span className="font-bold">284€</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">50 Rezepte pro Woche</span>
                      <span className="font-bold">710€</span>
                    </div>
                    <Progress value={80} />
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Bei durchschnittlich 50 Rezepten pro Woche erreichen Sie ein zusätzliches monatliches Einkommen von ca. 2.840€.
                    </p>
                    <Button className="gap-2">
                      Jetzt starten und verdienen <EuroIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* GDPR & Compliance */}
      <section className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">DSGVO-konform und sicher</h2>
            <p className="text-muted-foreground mb-8">
              Unsere Plattform wurde entwickelt, um alle Anforderungen an den Datenschutz zu erfüllen. Sowohl die DSGVO als auch spezielle Anforderungen im Gesundheitswesen werden eingehalten.
            </p>
            
            <ul className="space-y-4">
              {[
                "Alle Patientendaten werden verschlüsselt gespeichert",
                "HIPAA-konform für maximale Sicherheit",
                "FHIR-Standard für Interoperabilität",
                "Vollständige Nachvollziehbarkeit aller Vorgänge",
                "Sichere Übertragungswege durch Ende-zu-Ende-Verschlüsselung"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <Link to="/datenschutz" className="text-primary hover:underline">
                Unsere Datenschutzrichtlinie lesen →
              </Link>
            </div>
          </div>
          
          <div className="relative rounded-xl overflow-hidden shadow-xl border border-primary/20">
            <img 
              src="/lovable-uploads/8db2393e-a67f-435f-9eb7-467e1a367470.png" 
              alt="Datenschutz und Sicherheit" 
              className="w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm mb-2">
                DSGVO-konform
              </Badge>
              <h3 className="text-xl font-bold mb-2">Höchste Datenschutzstandards</h3>
              <p className="text-sm max-w-md">
                Wir verstehen die Bedeutung des Schutzes sensibler Patientendaten und haben entsprechende Maßnahmen implementiert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Bereit, Ihre Praxis zu digitalisieren?</h2>
          <p className="mb-8">
            Treten Sie unserem Netzwerk bei und profitieren Sie von digitalen Lösungen für die Verschreibung von Medizinalcannabis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="gap-2">
              <Calendar className="h-4 w-4" /> Demo vereinbaren
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10 gap-2">
              <Users className="h-4 w-4" /> Jetzt registrieren
            </Button>
          </div>
          <p className="mt-8 text-sm opacity-80">
            Bei Fragen kontaktieren Sie uns unter <a href="mailto:aerzte@medcann.de" className="underline">aerzte@medcann.de</a>
          </p>
        </div>
      </section>

      {/* Footer with Privacy Policy */}
      <footer className="bg-background border-t py-10">
        <div className="container">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MedCann - Alle Rechte vorbehalten
            </p>
            <div className="mt-4 space-x-4">
              <Link to="/datenschutz" className="text-sm text-muted-foreground hover:text-foreground">
                Datenschutzrichtlinie
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/documentation" className="text-sm text-muted-foreground hover:text-foreground">
                Dokumentation
              </Link>
              <span className="text-muted-foreground">•</span>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Kontakt
              </a>
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default DoctorLanding;
