
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Home, Edit, Trash2, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AddressFormData {
  id?: string;
  street: string;
  additionalInfo: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

const AddressManager = () => {
  const { user, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    street: '',
    additionalInfo: '',
    city: '',
    state: '',
    zip: '',
    country: 'Deutschland',
    isDefault: false
  });
  
  const resetForm = () => {
    setFormData({
      street: '',
      additionalInfo: '',
      city: '',
      state: '',
      zip: '',
      country: 'Deutschland',
      isDefault: false
    });
  };
  
  const handleEditAddress = (address: any) => {
    setFormData({
      id: address.id,
      street: address.street || '',
      additionalInfo: address.additionalInfo || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || '',
      country: address.country || 'Deutschland',
      isDefault: address.isDefault
    });
    setIsEditDialogOpen(true);
  };
  
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.id) {
      // Update existing address
      updateAddress({
        id: formData.id,
        street: formData.street,
        additionalInfo: formData.additionalInfo,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        isDefault: formData.isDefault
      });
      toast.success('Adresse aktualisiert');
      setIsEditDialogOpen(false);
    } else {
      // Add new address
      addAddress({
        street: formData.street,
        additionalInfo: formData.additionalInfo,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        isDefault: formData.isDefault
      });
      toast.success('Adresse hinzugefügt');
      setIsAddDialogOpen(false);
    }
    
    resetForm();
  };
  
  const handleSetDefault = (addressId: string) => {
    setDefaultAddress(addressId);
    toast.success('Standardadresse aktualisiert');
  };
  
  const handleDeleteAddress = (addressId: string) => {
    removeAddress(addressId);
    toast.success('Adresse gelöscht');
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
          <MapPin className="h-5 w-5" />
          Adressen
        </CardTitle>
        <CardDescription>
          Verwalten Sie Ihre Liefer- und Rechnungsadressen
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user?.addresses && user.addresses.length > 0 ? (
          <div className="space-y-4">
            {user.addresses.map((address) => (
              <div key={address.id} className="flex items-start justify-between p-4 border rounded-md">
                <div>
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <h3 className="font-medium">
                      {address.street}
                      {address.isDefault && (
                        <span className="ml-2 text-sm text-green-600 font-normal inline-flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Standard
                        </span>
                      )}
                    </h3>
                  </div>
                  {address.additionalInfo && (
                    <p className="text-sm text-muted-foreground">{address.additionalInfo}</p>
                  )}
                  <p className="text-sm">
                    {address.zip} {address.city}, {address.state}
                  </p>
                  <p className="text-sm">{address.country}</p>
                </div>
                <div className="flex space-x-2">
                  {!address.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Als Standard
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditAddress(address)}
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
                        <AlertDialogTitle>Adresse löschen</AlertDialogTitle>
                        <AlertDialogDescription>
                          Sind Sie sicher, dass Sie diese Adresse löschen möchten? Dies kann nicht rückgängig gemacht werden.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteAddress(address.id)}
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
            <p className="text-muted-foreground">Sie haben noch keine Adressen gespeichert.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Neue Adresse hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Adresse hinzufügen</DialogTitle>
              <DialogDescription>
                Fügen Sie eine neue Liefer- oder Rechnungsadresse hinzu.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddressSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Straße und Hausnummer*</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Adresszusatz</Label>
                  <Input
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">PLZ*</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ort*</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Bundesland*</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Land*</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
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
                  <Label htmlFor="isDefault">Als Standardadresse festlegen</Label>
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
              <DialogTitle>Adresse bearbeiten</DialogTitle>
              <DialogDescription>
                Aktualisieren Sie Ihre Adresse.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddressSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-street">Straße und Hausnummer*</Label>
                  <Input
                    id="edit-street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-additionalInfo">Adresszusatz</Label>
                  <Input
                    id="edit-additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-zip">PLZ*</Label>
                    <Input
                      id="edit-zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">Ort*</Label>
                    <Input
                      id="edit-city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">Bundesland*</Label>
                  <Input
                    id="edit-state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-country">Land*</Label>
                  <Input
                    id="edit-country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
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
                  <Label htmlFor="edit-isDefault">Als Standardadresse festlegen</Label>
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

export default AddressManager;
