<?php

namespace Database\Seeders;

use App\Models\CompanySetting;
use Illuminate\Database\Seeder;

class CompanySettingSeeder extends Seeder
{
    public function run(): void
    {
        CompanySetting::updateOrCreate(
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
                'logo_url' => '/images/logo.jpg',
                'description' => 'Tu asesoría inmobiliaria de confianza. Saneamiento físico legal, compra, venta y alquiler de propiedades.',
                'footer_text' => 'Real Compurter SAC Tel 927530091. Todos los derechos reservados.',
            ]
        );
    }
}
