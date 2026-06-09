import { LoginForm } from '@/components/auth/LoginForm';
import { Building2 } from 'lucide-react';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-900">Zona Segura CRM</h1>
          <p className="text-green-600">Sistema de Gestión Inmobiliaria</p>
        </div>

        <div className="rounded-xl border bg-card shadow-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
