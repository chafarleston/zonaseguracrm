export function AppFooter() {
  return (
    <footer className="bg-green-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/logo.jpg" alt="Zona Segura" className="h-12 w-auto bg-white rounded-lg p-1" />
          </div>
          <div className="text-center md:text-right">
            <p className="font-semibold">Zona Segura Inmobiliaria</p>
            <p className="text-green-200 text-sm">Asesoría Inmobiliaria - Saneamiento Físico Legal</p>
            <p className="text-green-200 text-sm">Compra - Venta - Alquiler</p>
          </div>
        </div>
        <div className="border-t border-green-700 mt-6 pt-6 text-center text-green-300 text-sm">
          &copy; 2026 Real Computer sac numero de contacto 927530091. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
