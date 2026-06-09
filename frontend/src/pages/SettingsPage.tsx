import { useState, useEffect, useRef } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { ServicesManager } from '@/components/settings/ServicesManager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Building2, Upload, X, Image } from 'lucide-react';

export function SettingsPage() {
  const { settings, isLoading, updateSettings, uploadLogo } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    company_name: '',
    company_subtitle: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    contact_person: '',
    logo_url: '',
    description: '',
    footer_text: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.companyName || '',
        company_subtitle: settings.companySubtitle || '',
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        city: settings.city || '',
        country: settings.country || '',
        contact_person: settings.contactPerson || '',
        logo_url: settings.logoUrl || '',
        description: settings.description || '',
        footer_text: settings.footerText || '',
      });
      if (settings.logoUrl) {
        setLogoPreview(`/storage/${settings.logoUrl}`);
      }
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setSelectedFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile) {
      await uploadLogo(selectedFile);
      setSelectedFile(null);
      setLogoPreview(null);
    }

    const { logo_url, ...dataWithoutLogo } = formData;
    await updateSettings(dataWithoutLogo);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuración</h2>
        <p className="text-muted-foreground">Administra la configuración de tu empresa</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Logo de la Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Logo de la Empresa
              </CardTitle>
              <CardDescription>
                Sube el logo que aparecerá en el sitio web y documentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {logoPreview ? (
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-white flex items-center justify-center">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="max-w-full max-h-full object-contain p-2"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Subir logo</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor="logo">Seleccionar imagen</Label>
                    <Input
                      ref={fileInputRef}
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="mt-1"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Formatos permitidos: JPG, PNG, WebP, SVG. Tamaño máximo: 2MB
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-green-600">
                      Archivo seleccionado: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
              <CardDescription>
                Datos que se muestran en el sitio web público
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Nombre de la Empresa *</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_subtitle">Subtítulo</Label>
                  <Input
                    id="company_subtitle"
                    name="company_subtitle"
                    value={formData.company_subtitle}
                    onChange={handleChange}
                    placeholder="Ej: Inmobiliaria"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descripción de la empresa..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Datos de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de Contacto</CardTitle>
              <CardDescription>
                Información de contacto que se muestra en el footer del sitio web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Persona de Contacto</Label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+51 902461066"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contacto@empresa.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Dirección"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ciudad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="País"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardHeader>
              <CardTitle>Texto del Footer</CardTitle>
              <CardDescription>
                Texto que aparece en la parte inferior del sitio web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="footer_text">Texto del Footer</Label>
                <Input
                  id="footer_text"
                  name="footer_text"
                  value={formData.footer_text}
                  onChange={handleChange}
                  placeholder="© 2026 Empresa. Todos los derechos reservados."
                />
              </div>
            </CardContent>
          </Card>

          {/* Servicios */}
          <ServicesManager />

          {/* Botón Guardar */}
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              Guardar Configuración
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
