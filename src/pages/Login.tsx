
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Lock, User, AlertCircle, Stethoscope, Building, LogIn, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('user');
  const { login, loginWithGoogle, isDoctor, isPharmacy } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Erfolgreich angemeldet');
      
      // Redirect based on role
      if (isDoctor) {
        navigate('/doctor/dashboard');
      } else if (isPharmacy) {
        navigate('/pharmacy/management');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Ungültige Anmeldedaten');
      toast.error('Anmeldefehler: Ungültige Anmeldedaten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      // Redirect is handled by Supabase OAuth
    } catch (err: any) {
      setError(`Google-Anmeldung fehlgeschlagen: ${err.message}`);
      toast.error(`Google-Anmeldung fehlgeschlagen: ${err.message}`);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDemoLogin = (type: string) => {
    switch(type) {
      case 'user':
        setEmail('user@example.com');
        setPassword('password');
        break;
      case 'doctor':
        setEmail('doctor@example.com');
        setPassword('password');
        break;
      case 'pharmacy':
        setEmail('pharmacy@example.com');
        setPassword('password');
        break;
    }
  };

  // Set demo credentials based on initial tab
  const getDemoContent = () => {
    switch(userType) {
      case 'user':
        return (
          <div className="mt-1">
            <p>Email: user@example.com</p>
            <p>Passwort: password</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => handleDemoLogin('user')}
            >
              Als Patient anmelden
            </Button>
          </div>
        );
      case 'doctor':
        return (
          <div className="mt-1">
            <p>Email: doctor@example.com</p>
            <p>Passwort: password</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => handleDemoLogin('doctor')}
            >
              Als Arzt anmelden
            </Button>
          </div>
        );
      case 'pharmacy':
        return (
          <div className="mt-1">
            <p>Email: pharmacy@example.com</p>
            <p>Passwort: password</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => handleDemoLogin('pharmacy')}
            >
              Als Apotheke anmelden
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container px-4 pt-8 pb-16 max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <Tabs value={userType} onValueChange={setUserType} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="user" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Patient</span>
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center gap-1">
                  <Stethoscope className="h-4 w-4" />
                  <span className="hidden sm:inline">Arzt</span>
                </TabsTrigger>
                <TabsTrigger value="pharmacy" className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Apotheke</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <CardTitle className="text-2xl font-bold text-center">Anmelden</CardTitle>
            <CardDescription className="text-center">
              {userType === 'user' && 'Als Patient anmelden, um Ihre Bestellungen zu verfolgen'}
              {userType === 'doctor' && 'Als Arzt anmelden, um Rezepte zu verwalten'}
              {userType === 'pharmacy' && 'Als Apotheke anmelden, um Bestellungen zu verwalten'}
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
                <Label htmlFor="email">E-Mail</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <User className="h-4 w-4" />
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
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                ) : (
                  <div className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Anmelden
                  </div>
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
                onClick={handleGoogleLogin}
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
                    Mit Google anmelden
                  </div>
                )}
              </Button>
              
              <div className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                <Info className="h-3 w-3" />
                <span>Google-Login kann für alle Kontotypen verwendet werden</span>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Demo Zugangsdaten:</p>
              {getDemoContent()}
            </div>
            <div className="w-full text-center">
              <p className="text-sm text-muted-foreground">
                Noch kein Konto?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Registrieren
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
