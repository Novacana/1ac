
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { UserPlus, Mail, Lock, User, AlertCircle, Stethoscope, Building, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'doctor' | 'pharmacy'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password, role);
      toast.success('Registrierung erfolgreich');
      
      if (role === 'doctor') {
        navigate('/settings');
        toast.info('Bitte vervollständigen Sie Ihre Arzt-Verifizierung in den Einstellungen');
      } else if (role === 'pharmacy') {
        navigate('/settings');
        toast.info('Bitte vervollständigen Sie Ihre Apotheken-Verifizierung in den Einstellungen');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Registrierung fehlgeschlagen');
      toast.error('Registrierungsfehler');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container px-4 pt-8 pb-16 max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Konto erstellen</CardTitle>
            <CardDescription className="text-center">
              Registrieren Sie sich für Zugang zu unserer Plattform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="accountType">Kontotyp</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(value) => setRole(value as 'user' | 'doctor' | 'pharmacy')} 
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Patient
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor" className="flex items-center gap-2 cursor-pointer">
                      <Stethoscope className="h-4 w-4" />
                      Arzt
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pharmacy" id="pharmacy" />
                    <Label htmlFor="pharmacy" className="flex items-center gap-2 cursor-pointer">
                      <Building className="h-4 w-4" />
                      Apotheke
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {(role === 'doctor' || role === 'pharmacy') && (
                <Alert variant="warning">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Verifizierung erforderlich</AlertTitle>
                  <AlertDescription>
                    {role === 'doctor' 
                      ? 'Sie müssen Ihre Approbationsurkunde hochladen, um als Arzt verifiziert zu werden.'
                      : 'Sie müssen Ihre Betriebserlaubnis hochladen, um als Apotheke verifiziert zu werden.'}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Name{role === 'pharmacy' ? ' der Apotheke' : ''}</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder={role === 'pharmacy' ? "Muster Apotheke" : "Max Mustermann"} 
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="benutzer@beispiel.de" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    placeholder="••••••••" 
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                ) : (
                  <span className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrieren
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Haben Sie bereits ein Konto?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Anmelden
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
