import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSettings } from '@/hooks/useSettings';
import { Mail, Phone, User, MapPin } from 'lucide-react';

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactDialog({ isOpen, onClose }: ContactDialogProps) {
  const { settings } = useSettings();

  const companyEmail = settings?.email || 'contacto@zonasegura.com.pe';

  const handleContactEmail = () => {
    const subject = encodeURIComponent('Consulta sobre propiedad en ' + (settings?.companyName || 'Zona Segura'));
    window.open(`mailto:${companyEmail}?subject=${subject}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-800 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contactar con {settings?.companyName || 'Zona Segura'}
          </DialogTitle>
          <DialogDescription className="text-green-600">
            Estamos aquí para ayudarte con tu propiedad ideal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium mb-2">Información de contacto:</p>
            <div className="space-y-2">
              {settings?.contactPerson && (
                <div className="flex items-center gap-2 text-green-700">
                  <User className="h-4 w-4" />
                  <span>{settings.contactPerson}</span>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center gap-2 text-green-700">
                  <Phone className="h-4 w-4" />
                  <span>{settings.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-green-700">
                <Mail className="h-4 w-4" />
                <span>{companyEmail}</span>
              </div>
              {(settings?.address || settings?.city || settings?.country) && (
                <div className="flex items-center gap-2 text-green-700">
                  <MapPin className="h-4 w-4" />
                  <span>{[settings.address, settings.city, settings.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleContactEmail}
            className="w-full bg-green-600 hover:bg-green-700 gap-2"
          >
            <Mail className="h-4 w-4" />
            Enviar correo electrónico
          </Button>

          <p className="text-xs text-center text-green-600">
            Al hacer clic se abrirá tu cliente de correo predeterminado
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
