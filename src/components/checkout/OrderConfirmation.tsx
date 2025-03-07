
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, FileText } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { isWooCommerceConfigured } from "@/utils/woocommerce";

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [orderId, setOrderId] = useState<string>('');
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');
  
  useEffect(() => {
    // Generate a random order ID for simulation purposes
    // In a real implementation, this would come from the WooCommerce API
    const generateRandomOrderId = () => {
      const prefix = isWooCommerceConfigured() ? 'WC-' : 'DRA-';
      const randomNum = Math.floor(Math.random() * 9000000) + 1000000;
      return `${prefix}${randomNum}`;
    };
    
    // Calculate estimated delivery date (3-5 business days from now)
    const calculateEstimatedDelivery = () => {
      const today = new Date();
      const minDays = 3;
      const maxDays = 5;
      
      // Format as date range
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + minDays);
      
      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + maxDays);
      
      // Format dates
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('de-DE', {
          day: 'numeric',
          month: 'long'
        });
      };
      
      return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
    };
    
    setOrderId(generateRandomOrderId());
    setEstimatedDelivery(calculateEstimatedDelivery());
    
    // Clear the cart after successful order
    clearCart();
  }, [clearCart]);

  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
        <CheckCircle2 className="h-12 w-12 text-primary" />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Vielen Dank für Ihre Bestellung!</h1>
      
      <p className="text-foreground/70 mb-8 max-w-md mx-auto">
        Ihre Bestellung wurde aufgegeben und wird bearbeitet. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
      </p>
      
      <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto mb-8 text-left">
        <h3 className="font-medium mb-2">Bestelldetails</h3>
        <p className="text-sm text-muted-foreground mb-1">Bestellnummer: {orderId}</p>
        <p className="text-sm text-muted-foreground mb-4">Voraussichtliche Lieferung: {estimatedDelivery}</p>
        
        {cartItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Bestellte Artikel:</h4>
            <ul className="space-y-2">
              {cartItems.map(item => (
                <li key={item.id} className="text-sm flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-center"
            onClick={() => {
              // This would download the invoice in a real implementation
              alert('Rechnungsdownload-Funktion würde hier implementiert werden');
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Rechnung herunterladen
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Ihre Rezeptinformationen wurden an die Apotheke gesendet. Sie werden Ihre Bestellung prüfen und Ihr Medikament vorbereiten.
        </p>
        
        <Button onClick={() => navigate("/")}>
          Weiter einkaufen
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
