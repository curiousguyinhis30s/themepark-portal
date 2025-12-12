import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FerrisWheel, Eye, EyeOff, Mail, Lock, Shield, Store, UserCog } from 'lucide-react';

const demoAccounts = [
  {
    role: 'Admin',
    email: 'admin@themepark.com',
    password: 'admin123',
    icon: Shield,
    description: 'Full park management access',
    color: 'bg-primary text-primary-foreground',
  },
  {
    role: 'Merchant',
    email: 'merchant@themepark.com',
    password: 'merchant123',
    icon: Store,
    description: 'Store & order management',
    color: 'bg-amber-500 text-white',
  },
  {
    role: 'Staff',
    email: 'staff@themepark.com',
    password: 'staff123',
    icon: UserCog,
    description: 'Queue & feedback access',
    color: 'bg-blue-500 text-white',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FerrisWheel className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Theme Park Portal</CardTitle>
            <CardDescription>Sign in to access the management portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Demo Accounts</CardTitle>
            <CardDescription className="text-xs">Click to auto-fill credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <button
                  key={account.role}
                  onClick={() => fillCredentials(account.email, account.password)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                >
                  <div className={`p-2 rounded-lg ${account.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{account.role}</span>
                      <Badge variant="outline" className="text-xs">
                        {account.email.split('@')[0]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{account.description}</p>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
