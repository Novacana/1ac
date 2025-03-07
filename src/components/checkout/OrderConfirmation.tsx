
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default OrderConfirmation;
