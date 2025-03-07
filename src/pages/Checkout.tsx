
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
      return;
    }
    
    setIsSubmitting(true);
    // Simulate payment processing
    setTimeout(() => {
      setStep(3);
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="container px-4 mx-auto py-8 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          {/* Checkout steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  1
                </div>
                <div className="ml-2 font-medium">Information</div>
              </div>
              
              <div className="bg-muted h-0.5 flex-1 mx-4" />
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  2
                </div>
                <div className="ml-2 font-medium">Payment</div>
              </div>
              
              <div className="bg-muted h-0.5 flex-1 mx-4" />
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  3
                </div>
                <div className="ml-2 font-medium">Confirmation</div>
              </div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" placeholder="123 Main St" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apt">Apartment, Suite, etc. (optional)</Label>
                    <Input id="apt" placeholder="Apt 4B" />
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Province</Label>
                      <Input id="state" placeholder="NY" required />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="zip">Postal Code</Label>
                      <Input id="zip" placeholder="10001" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" placeholder="United States" required />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sameAsBilling" />
                    <label
                      htmlFor="sameAsBilling"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Billing address same as shipping
                    </label>
                  </div>
                </CardFooter>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/cart")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cart
                </Button>
                
                <Button type="submit">
                  Continue to Payment
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
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

              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>€89.98</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary">Free</span>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>€89.98</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  ) : (
                    "Complete Purchase"
                  )}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
              
              <p className="text-foreground/70 mb-8 max-w-md mx-auto">
                Your order has been placed and is being processed. You will receive an email confirmation shortly.
              </p>
              
              <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto mb-8 text-left">
                <h3 className="font-medium mb-2">Order Details</h3>
                <p className="text-sm text-muted-foreground mb-1">Order #: DRA-9385721</p>
                <p className="text-sm text-muted-foreground">Estimated delivery: 3-5 business days</p>
              </div>
              
              <Button onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
