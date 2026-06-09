import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactDialog({ isOpen, onClose }: ContactDialogProps) {
  const handleContactEmail = () => {
    window.open('mailto:rcharles84@gmail.com?subject=Consulta%20sobre%20propiedad%20en%20Zona%20Segura', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-800 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contactar con Zona Segura
          </DialogTitle>
          <DialogDescription className="text-green-600">
            Estamos aquí para ayudarte con tu propiedad ideal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium mb-2">Información de contacto:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <Mail className="h-4 w-4" />
                <span>rcharles84@gmail.com</span>
              </div>
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
