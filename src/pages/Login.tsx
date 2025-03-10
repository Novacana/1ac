
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
import { Lock, User, AlertCircle, Stethoscope, Building } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('user');
  const { login, isDoctor, isPharmacy } = useAuth();
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

  return (
    <Layout>
      <div className="container px-4 pt-8 pb-16 max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <Tabs defaultValue={userType} onValueChange={setUserType} className="w-full">
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
                  'Anmelden'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Demo Zugangsdaten:</p>
              <TabsContent value="user" className="mt-1">
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
              </TabsContent>
              <TabsContent value="doctor" className="mt-1">
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
              </TabsContent>
              <TabsContent value="pharmacy" className="mt-1">
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
              </TabsContent>
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
