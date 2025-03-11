
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { UserPlus, Mail, Lock, User, AlertCircle, Stethoscope, Building, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface LocationState {
  preselectedRole?: 'user' | 'doctor' | 'pharmacy';
}

const Register = () => {
  const location = useLocation();
  const locationState = location.state as LocationState;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'doctor' | 'pharmacy'>(
    locationState?.preselectedRole || 'user'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Effect to update role if preselectedRole changes
  useEffect(() => {
    if (locationState?.preselectedRole) {
      setRole(locationState.preselectedRole);
    }
  }, [locationState]);

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

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    try {
      // For Google signup, we use the same loginWithGoogle function
      // The user will need to set their role afterward in the profile settings
      await loginWithGoogle();
      // The redirect is handled by Supabase OAuth
    } catch (err: any) {
      setError(`Google-Registrierung fehlgeschlagen: ${err.message}`);
      toast.error(`Google-Registrierung fehlgeschlagen: ${err.message}`);
    } finally {
      setIsGoogleLoading(false);
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

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Oder
                  </span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleRegister}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                ) : (
                  <div className="flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" aria-hidden="true">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Mit Google registrieren
                  </div>
                )}
              </Button>
              
              <div className="text-xs text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <Info className="h-3 w-3" />
                <span>Bei der Google-Anmeldung können Sie Ihre Rolle später in den Einstellungen festlegen</span>
              </div>
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
