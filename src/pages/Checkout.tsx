
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import ContactInfoForm from "@/components/checkout/ContactInfoForm";
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm";
import PrescriptionSelector from "@/components/checkout/PrescriptionSelector";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPrescription, setHasPrescription] = useState<boolean | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [paymentValid, setPaymentValid] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit_card");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Ensure prescription choice is made before proceeding
      if (hasPrescription === null) {
        toast.error("Bitte geben Sie an, ob Sie ein Rezept haben oder eines benötigen");
        return;
      }
      
      setStep(2);
      window.scrollTo(0, 0);
      return;
    }
    
    if (!paymentValid) {
      toast.error("Bitte füllen Sie alle erforderlichen Zahlungsinformationen aus");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Simulate redirect to Mollie for external payment methods
      if (selectedPaymentMethod === "mollie") {
        // In a real implementation, this would redirect to Mollie's payment page
        window.location.href = "#mollie-payment-simulation";
        toast.info("In einer echten Implementierung würden Sie jetzt zu Mollie weitergeleitet werden.");
        
        // Simulate return from Mollie after payment
        setTimeout(() => {
          setStep(3);
          setIsSubmitting(false);
          window.location.href = "#payment-completed";
          toast.success("Zahlung erfolgreich abgeschlossen");
        }, 2000);
      } else {
        // Normal card payment
        setStep(3);
        setIsSubmitting(false);
        toast.success("Zahlung erfolgreich abgeschlossen");
      }
    }, 2000);
  };

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentValidityChange = (valid: boolean) => {
    setPaymentValid(valid);
  };

  return (
    <Layout>
      <div className="container px-4 mx-auto py-8 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <CheckoutSteps currentStep={step} />

          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
              <PrescriptionSelector 
                hasPrescription={hasPrescription}
                setHasPrescription={setHasPrescription}
                showQuestionnaire={showQuestionnaire}
                setShowQuestionnaire={setShowQuestionnaire}
              />

              <ContactInfoForm />
              <ShippingAddressForm />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/cart")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück zum Warenkorb
                </Button>
                
                <Button type="submit">
                  Weiter zur Zahlung
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
              <PaymentForm onChange={handlePaymentValidityChange} />
              <OrderSummary />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting || !paymentValid}
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  ) : (
                    "Kauf abschließen"
                  )}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && <OrderConfirmation />}
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
