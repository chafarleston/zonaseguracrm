<?php

namespace Database\Seeders;

use App\Models\CompanySetting;
use Illuminate\Database\Seeder;

class CompanySettingSeeder extends Seeder
{
    public function run(): void
    {
        // Solo crea el registro si no existe. NO sobrescribe los datos
        // que el usuario haya modificado en /admin/settings.
        CompanySetting::firstOrCreate(
            ['id' => 1],
            [
                'company_name' => 'Real Compurter SAC',
                'company_subtitle' => 'Inmobiliaria',
                'phone' => '+51 902461066',
                'email' => 'mrequena@zonasegura.com.pe',
                'address' => 'Sullana',
                'city' => 'Piura',
                'country' => 'Peru',
                'contact_person' => 'Miguel Angel Requena Palomino',
                'description' => 'Tu asesoría inmobiliaria de confianza. Saneamiento físico legal, compra, venta y alquiler de propiedades.',
                'footer_text' => 'Real Compurter SAC Tel 927530091. Todos los derechos reservados.',
            ]
        );
    }
}
