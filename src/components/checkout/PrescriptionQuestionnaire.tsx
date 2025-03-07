
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MessageCircle, ArrowRight, HelpCircle, AlertCircle } from "lucide-react";

type Question = {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  helpText?: string;
};

const PrescriptionQuestionnaire = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [symptoms, setSymptoms] = useState("");
  const [showChatButton, setShowChatButton] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const questions: Question[] = [
    {
      id: "pain",
      question: "Leiden Sie unter chronischen Schmerzen?",
      options: [
        { value: "yes", label: "Ja" },
        { value: "no", label: "Nein" },
      ],
      helpText: "Chronische Schmerzen sind solche, die über einen Zeitraum von mehr als 3 Monaten bestehen."
    },
    {
      id: "sleep",
      question: "Haben Sie Probleme beim Schlafen?",
      options: [
        { value: "yes", label: "Ja" },
        { value: "no", label: "Nein" },
      ],
      helpText: "Schlafprobleme umfassen Einschlafstörungen, Durchschlafstörungen oder nicht erholsamen Schlaf."
    },
    {
      id: "anxiety",
      question: "Leiden Sie unter Angstzuständen oder Stress?",
      options: [
        { value: "yes", label: "Ja" },
        { value: "no", label: "Nein" },
      ],
    },
    {
      id: "previous_treatment",
      question: "Haben Sie bereits andere Behandlungen für Ihre Beschwerden versucht?",
      options: [
        { value: "yes", label: "Ja" },
        { value: "no", label: "Nein" },
      ],
      helpText: "Gemeint sind konventionelle medizinische Behandlungen, die nicht ausreichend geholfen haben."
    },
  ];

  const currentQuestion = questions[step];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowChatButton(true);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleSubmit = () => {
    setSubmitting(true);
    // Hier würde normalerweise die Datenübermittlung an einen Arzt erfolgen
    setTimeout(() => {
      setSubmitting(false);
      alert("Ihre Anfrage wurde erfolgreich übermittelt. Ein Arzt wird Ihre Angaben prüfen und sich in Kürze bei Ihnen melden.");
    }, 1500);
  };

  return (
    <div className="space-y-4 mt-4">
      {!showChatButton ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Fragebogen für Ihre Rezeptanfrage
            </CardTitle>
            <CardDescription>
              Schritt {step + 1} von {questions.length}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-2 font-medium">{currentQuestion.question}</div>
                {currentQuestion.helpText && (
                  <div className="relative group">
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    <div className="absolute left-0 -top-2 transform -translate-y-full w-64 p-2 bg-popover rounded shadow-lg text-xs hidden group-hover:block z-10 text-foreground">
                      {currentQuestion.helpText}
                    </div>
                  </div>
                )}
              </div>
              
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem id={`${currentQuestion.id}-${option.value}`} value={option.value} />
                    <Label htmlFor={`${currentQuestion.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={step === 0}
            >
              Zurück
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="ml-auto"
            >
              Weiter
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Beschreiben Sie Ihre Symptome
            </CardTitle>
            <CardDescription>
              Bitte geben Sie weitere Details zu Ihren Beschwerden an
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <Textarea 
                placeholder="Beschreiben Sie Ihre Symptome und bisherigen Behandlungsversuche..." 
                className="min-h-[150px]"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              
              <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  Ihre Angaben werden von einem Arzt geprüft. Sie werden per E-Mail benachrichtigt, wenn Ihr Rezept ausgestellt wurde oder wenn weitere Informationen benötigt werden.
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-4">
            <Button 
              variant="outline" 
              onClick={() => setStep(questions.length - 1)}
              className="w-full sm:w-auto"
            >
              Zurück zum Fragebogen
            </Button>
            
            <Button 
              onClick={handleSubmit}
              disabled={symptoms.length < 10 || submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <>
                  Anfrage absenden
                  <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
            
            <Button
              variant="secondary"
              className="flex gap-2 w-full sm:w-auto sm:ml-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Mit Berater sprechen
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PrescriptionQuestionnaire;
