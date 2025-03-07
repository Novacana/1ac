
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OrderSummary: React.FC = () => {
  return (
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
  );
};

export default OrderSummary;
