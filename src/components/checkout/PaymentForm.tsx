
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PaymentConsentCheck from "./PaymentConsentCheck";

interface PaymentFormProps {
  onChange?: (valid: boolean) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onChange }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  // Format expiry date as MM/YY
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiry(e.target.value);
    setExpiry(formattedValue);
  };

  // Notify parent component if form validity changes
  React.useEffect(() => {
    if (onChange) {
      const isValid = 
        cardNumber.replace(/\s/g, "").length >= 16 && 
        expiry.length === 5 && 
        cvc.length >= 3 && 
        nameOnCard.length > 0 &&
        consentGiven;
      
      onChange(isValid);
    }
  }, [cardNumber, expiry, cvc, nameOnCard, consentGiven, onChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-primary/5 border-primary/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Für diese Transaktion wird eine Plattformgebühr von 4,20% erhoben.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input 
            id="cardNumber" 
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            required 
          />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiration Date</Label>
            <Input 
              id="expiry" 
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
              maxLength={5}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input 
              id="cvc" 
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/[^\d]/g, ""))}
              maxLength={4}
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nameOnCard">Name on Card</Label>
          <Input 
            id="nameOnCard" 
            placeholder="John Doe"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            required 
          />
        </div>
        
        <PaymentConsentCheck 
          checked={consentGiven}
          onCheckedChange={setConsentGiven}
        />
      </CardContent>
      <CardFooter>
        <div className="flex items-center text-sm text-muted-foreground">
          <Lock className="h-4 w-4 mr-2" />
          Your payment information is secure and GDPR compliant
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
