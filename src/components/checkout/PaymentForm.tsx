
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Lock } from "lucide-react";

const PaymentForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input 
            id="cardNumber" 
            placeholder="1234 5678 9012 3456"
            required 
          />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiration Date</Label>
            <Input 
              id="expiry" 
              placeholder="MM/YY"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input 
              id="cvc" 
              placeholder="123"
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nameOnCard">Name on Card</Label>
          <Input 
            id="nameOnCard" 
            placeholder="John Doe"
            required 
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center text-sm text-muted-foreground">
          <Lock className="h-4 w-4 mr-2" />
          Your payment information is secure
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
