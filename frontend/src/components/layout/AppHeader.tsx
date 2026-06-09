import { useAuth } from '@/context/AuthContext';
import { UserMenu } from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import { Plus, User, Mail } from 'lucide-react';

interface AppHeaderProps {
  onNewProperty: () => void;
  onContact: () => void;
  onLogin: () => void;
}

export function AppHeader({ onNewProperty, onContact, onLogin }: AppHeaderProps) {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-green-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.jpg"
              alt="Zona Segura Inmobiliaria"
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onContact}
              className="gap-2 border-green-600 text-green-700 hover:bg-green-50"
            >
              <Mail className="h-4 w-4" />
              Contacto
            </Button>

            <Button
              onClick={onNewProperty}
              className="gap-2 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
            >
              <Plus className="h-4 w-4" />
              Nueva Propiedad
            </Button>

            {!isAuthenticated ? (
              <Button
                variant="outline"
                onClick={onLogin}
                className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
              >
                <User className="h-4 w-4" />
                Admin
              </Button>
            ) : (
              <UserMenu />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
