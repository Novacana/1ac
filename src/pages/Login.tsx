
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, User, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('user');
  const { login, isAuthenticated, isDoctor } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to appropriate dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      if (isDoctor) {
        navigate('/doctor/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [isAuthenticated, isDoctor, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Erfolgreich angemeldet');
      
      // Navigate based on user role
      if (email === 'doctor@example.com') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError('Ungültige Anmeldedaten');
      toast.error('Anmeldefehler: Ungültige Anmeldedaten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container px-4 pt-8 pb-16 max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Melden Sie sich an, um Ihren Account zu verwalten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" value={loginType} onValueChange={setLoginType}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="user">Kunden</TabsTrigger>
                <TabsTrigger value="doctor">Ärzte</TabsTrigger>
              </TabsList>
              
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
                      placeholder={loginType === 'doctor' ? 'arzt@beispiel.de' : 'kunde@beispiel.de'} 
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
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              <p>Demo Zugangsdaten:</p>
              {loginType === 'doctor' ? (
                <>
                  <p>Email: doctor@example.com</p>
                  <p>Passwort: password</p>
                </>
              ) : (
                <>
                  <p>Email: user@example.com</p>
                  <p>Passwort: password</p>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
