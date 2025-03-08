
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, CreditCard, Edit, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethodFormData {
  id?: string;
  type: 'credit_card';
  cardNumber: string;
  expiryDate: string;
  cardHolder: string;
  isDefault: boolean;
}

const PaymentMethodManager = () => {
  const { user, addPaymentMethod, updatePaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    type: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cardHolder: '',
    isDefault: false
  });
  
  const resetForm = () => {
    setFormData({
      type: 'credit_card',
      cardNumber: '',
      expiryDate: '',
      cardHolder: '',
      isDefault: false
    });
  };
  
  const handleEditPaymentMethod = (method: any) => {
    setFormData({
      id: method.id,
      type: method.type,
      cardNumber: method.cardNumber || '',
      expiryDate: method.expiryDate || '',
      cardHolder: method.cardHolder || '',
      isDefault: method.isDefault
    });
    setIsEditDialogOpen(true);
  };
  
  const handlePaymentMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (formData.cardNumber.length < 4) {
      toast.error('Bitte geben Sie eine gültige Kartennummer ein');
      return;
    }
    
    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      toast.error('Gültigkeit muss im Format MM/YY sein');
      return;
    }
    
    if (formData.id) {
      // Update existing payment method
      updatePaymentMethod({
        id: formData.id,
        type: formData.type,
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cardHolder: formData.cardHolder,
        isDefault: formData.isDefault
      });
      toast.success('Zahlungsmethode aktualisiert');
      setIsEditDialogOpen(false);
    } else {
      // Add new payment method - in a real app, we'd process the card through a payment processor
      // Here we just store the last 4 digits for demo purposes
      const last4Digits = formData.cardNumber.slice(-4);
      
      addPaymentMethod({
        type: formData.type,
        cardNumber: last4Digits,
        expiryDate: formData.expiryDate,
        cardHolder: formData.cardHolder,
        isDefault: formData.isDefault
      });
      toast.success('Zahlungsmethode hinzugefügt');
      setIsAddDialogOpen(false);
    }
    
    resetForm();
  };
  
  const handleSetDefault = (paymentMethodId: string) => {
    setDefaultPaymentMethod(paymentMethodId);
    toast.success('Standard-Zahlungsmethode aktualisiert');
  };
  
  const handleDeletePaymentMethod = (paymentMethodId: string) => {
    removePaymentMethod(paymentMethodId);
    toast.success('Zahlungsmethode gelöscht');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Zahlungsmethoden
        </CardTitle>
        <CardDescription>
          Verwalten Sie Ihre Kredit- und Debitkarten
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user?.paymentMethods && user.paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {user.paymentMethods.map((method) => (
              <div key={method.id} className="flex items-start justify-between p-4 border rounded-md">
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <h3 className="font-medium">
                      {method.type === 'credit_card' ? 'Kreditkarte' : 'Zahlungsmethode'} •••• {method.cardNumber}
                      {method.isDefault && (
                        <span className="ml-2 text-sm text-green-600 font-normal inline-flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Standard
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Gültig bis: {method.expiryDate}</p>
                  <p className="text-sm">{method.cardHolder}</p>
                </div>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Als Standard
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditPaymentMethod(method)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Zahlungsmethode löschen</AlertDialogTitle>
                        <AlertDialogDescription>
                          Sind Sie sicher, dass Sie diese Zahlungsmethode löschen möchten? Dies kann nicht rückgängig gemacht werden.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Löschen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">Sie haben noch keine Zahlungsmethoden gespeichert.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Neue Zahlungsmethode hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Zahlungsmethode hinzufügen</DialogTitle>
              <DialogDescription>
                Fügen Sie eine neue Kreditkarte oder Debitkarte hinzu.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePaymentMethodSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Kartennummer*</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Gültig bis*</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC/CVV*</Label>
                    <Input
                      id="cvc"
                      name="cvc"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardHolder">Karteninhaber*</Label>
                  <Input
                    id="cardHolder"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleInputChange}
                    placeholder="Vor- und Nachname"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
                  />
                  <Label htmlFor="isDefault">Als Standard-Zahlungsmethode festlegen</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Speichern</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Zahlungsmethode bearbeiten</DialogTitle>
              <DialogDescription>
                Aktualisieren Sie Ihre Zahlungsinformationen.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePaymentMethodSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-expiryDate">Gültig bis*</Label>
                  <Input
                    id="edit-expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cardHolder">Karteninhaber*</Label>
                  <Input
                    id="edit-cardHolder"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleInputChange}
                    placeholder="Vor- und Nachname"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
                  />
                  <Label htmlFor="edit-isDefault">Als Standard-Zahlungsmethode festlegen</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Aktualisieren</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethodManager;
