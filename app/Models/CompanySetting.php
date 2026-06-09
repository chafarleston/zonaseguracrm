<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    use HasFactory;

    protected $table = 'company_settings';

    protected $fillable = [
        'company_name',
        'company_subtitle',
        'phone',
        'email',
        'address',
        'city',
        'country',
        'contact_person',
        'logo_url',
        'description',
        'footer_text',
    ];

    public static function getSettings(): self
    {
        return self::firstOrCreate(
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
                'description' => 'Tu asesoría inmobiliaria de confianza.',
                'footer_text' => 'Real Compurter SAC Tel 927530091. Todos los derechos reservados.',
            ]
        );
    }

    public static function updateSettings(array $data): self
    {
        $settings = self::getSettings();
        $settings->update($data);
        return $settings->fresh();
    }
}
