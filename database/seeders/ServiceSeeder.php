<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Tasaciones',
                'slug' => 'tasaciones',
                'description' => 'Tasación profesional de inmuebles con metodología certificada.',
                'long_description' => 'Ofrecemos servicios de tasación profesional de propiedades inmobiliarias. Nuestro equipo de expertos utiliza metodologías certificadas y actualizadas para determinar el valor real de mercado de tu propiedad. Ya sea para venta, compra, hipoteca o fines legales, nuestras tasaciones son reconocidas por entidades bancarias y organismos oficiales.',
                'icon' => 'Calculator',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Asesoría Legal',
                'slug' => 'asesoria-legal',
                'description' => 'Asesoramiento legal en transacciones inmobiliarias.',
                'long_description' => 'Nuestro equipo de abogados especializados en derecho inmobiliario te acompaña en todo el proceso de compra, venta o alquiler de propiedades. Realizamos verificación de títulos, due diligence, elaboración y revisión de contratos, y gestión de trámites notariales. Garantizamos seguridad jurídica en cada transacción.',
                'icon' => 'Scale',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Financiamiento',
                'slug' => 'financiamiento',
                'description' => 'Opciones de financiamiento y crédito hipotecario.',
                'long_description' => 'Te ayudamos a encontrar las mejores opciones de financiamiento para la compra de tu propiedad. Trabajamos con las principales entidades bancarias para ofrecerte las mejores tasas y condiciones del mercado. Nuestros asesores financieros te guiarán en todo el proceso de solicitud de crédito hipotecario.',
                'icon' => 'Landmark',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Administración',
                'slug' => 'administracion',
                'description' => 'Administración profesional de propiedades.',
                'long_description' => 'Nos encargamos de la administración integral de tu propiedad. Desde la gestión de alquileres, cobro de rentas, mantenimiento preventivo y correctivo, hasta la relación con inquilinos. Nuestro servicio de administración te permite obtener rentabilidad de tu inversión sin preocupaciones.',
                'icon' => 'Building',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['slug' => $service['slug']],
                $service
            );
        }
    }
}
