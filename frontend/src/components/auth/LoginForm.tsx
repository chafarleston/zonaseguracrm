import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, Home } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login({ email, password });
      if (success) {
        toast.success('Inicio de sesión exitoso');
        onLoginSuccess?.();
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="mx-auto bg-green-600 p-3 rounded-full w-fit mb-3">
          <Home className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-green-800">Acceso Administrador</h2>
        <p className="text-sm text-green-600">
          Inicia sesión para gestionar propiedades
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
            <Input
              id="email"
              type="email"
              placeholder="admin@zonasegura.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 border-green-200 focus:border-green-500 focus:ring-green-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-xs font-medium text-green-800 mb-1">Credenciales de demo:</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-green-700">Admin:</span>
            <code className="bg-white px-2 py-0.5 rounded text-green-800">
              admin@zonasegura.com / admin123
            </code>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Usuario:</span>
            <code className="bg-white px-2 py-0.5 rounded text-green-800">
              usuario@zonasegura.com / user123
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
