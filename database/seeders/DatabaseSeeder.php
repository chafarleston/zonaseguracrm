<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Client;
use App\Models\CompanySetting;
use App\Models\Deal;
use App\Models\Property;
use App\Models\Service;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Users
        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'admin@zonasegura.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'phone' => '+51 902461066',
        ]);

        $agent1 = User::create([
            'name' => 'María García',
            'email' => 'maria@zonasegura.com',
            'password' => Hash::make('agent123'),
            'role' => 'agent',
            'phone' => '+51 912345678',
        ]);

        $agent2 = User::create([
            'name' => 'Carlos López',
            'email' => 'carlos@zonasegura.com',
            'password' => Hash::make('agent123'),
            'role' => 'agent',
            'phone' => '+51 923456789',
        ]);

        // Properties - Sullana, Piura, Peru
        $prop1 = Property::create([
            'user_id' => $admin->id,
            'title' => 'Moderna Casa Familiar con Jardín',
            'property_code' => 'PROP-001',
            'description' => 'Hermosa casa de 4 habitaciones con amplio jardín, piscina y terraza. Ideal para familias que buscan tranquilidad y espacio.',
            'price' => 450000,
            'currency' => 'USD',
            'type' => 'casa',
            'status' => 'venta',
            'bedrooms' => 4,
            'bathrooms' => 3,
            'area' => 280,
            'address' => 'Av. Panamericana Norte 1500, Sullana',
            'coordinates' => ['lat' => -4.8875, 'lng' => -80.6833],
            'images' => [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            ],
            'features' => ['Piscina', 'Jardín', 'Terraza', 'Garage', 'Seguridad 24h'],
            'commission_rate' => 3.5,
        ]);

        $prop2 = Property::create([
            'user_id' => $agent1->id,
            'title' => 'Departamento de Lujo en Centro',
            'property_code' => 'PROP-002',
            'description' => 'Elegante departamento de 2 habitaciones en el corazón de Sullana. Acabados de primera calidad y vistas panorámicas.',
            'price' => 320000,
            'currency' => 'USD',
            'type' => 'departamento',
            'status' => 'venta',
            'bedrooms' => 2,
            'bathrooms' => 2,
            'area' => 120,
            'address' => 'Jr. Tacna 500, Centro de Sullana',
            'coordinates' => ['lat' => -4.8865, 'lng' => -80.6820],
            'images' => [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            ],
            'features' => ['Gimnasio', 'Parrilla', 'Laundry', 'Balcón', 'Ascensor'],
            'commission_rate' => 3.0,
        ]);

        $prop3 = Property::create([
            'user_id' => $agent1->id,
            'title' => 'Casa de Campo con Vista al Río',
            'property_code' => 'PROP-003',
            'description' => 'Espectacular propiedad rural con acceso directo al río Chira. Perfecta para escapadas de fin de semana o vida tranquila.',
            'price' => 280000,
            'currency' => 'USD',
            'type' => 'casa',
            'status' => 'venta',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area' => 200,
            'address' => 'Carretera Sullana-Marcavelica Km 5, Sullana',
            'coordinates' => ['lat' => -4.8950, 'lng' => -80.6900],
            'images' => [
                'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
            ],
            'features' => ['Vista al río', 'Quincho', 'Jardín amplio', 'Estacionamiento'],
            'commission_rate' => 4.0,
        ]);

        $prop4 = Property::create([
            'user_id' => $agent2->id,
            'title' => 'Penthouse con Terraza Panorámica',
            'property_code' => 'PROP-004',
            'description' => 'Increíble penthouse de 3 habitaciones con terraza y vistas panorámicas de la ciudad de Sullana.',
            'price' => 750000,
            'currency' => 'USD',
            'type' => 'departamento',
            'status' => 'venta',
            'bedrooms' => 3,
            'bathrooms' => 3,
            'area' => 250,
            'address' => 'Av. Grau 2000, Urbanización El Palmo, Sullana',
            'coordinates' => ['lat' => -4.8820, 'lng' => -80.6780],
            'images' => [
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            ],
            'features' => ['Terraza panorámica', 'Jacuzzi', 'Smart home', '2 cocheras'],
            'commission_rate' => 3.0,
        ]);

        $prop5 = Property::create([
            'user_id' => $agent2->id,
            'title' => 'Loft Moderno Reformado',
            'property_code' => 'PROP-005',
            'description' => 'Espacioso loft reformado con diseño moderno. Techos altos, grandes ventanales y excelente ubicación.',
            'price' => 185000,
            'currency' => 'USD',
            'type' => 'loft',
            'status' => 'venta',
            'bedrooms' => 1,
            'bathrooms' => 1,
            'area' => 85,
            'address' => 'Calle Lima 4500, Sullana',
            'coordinates' => ['lat' => -4.8890, 'lng' => -80.6850],
            'images' => [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            ],
            'features' => ['Techos altos', 'Ventanales', 'Cocina integrada', 'Espacio cowork'],
            'commission_rate' => 3.5,
        ]);

        $prop6 = Property::create([
            'user_id' => $admin->id,
            'title' => 'Casa Minimalista en Urbanización Privada',
            'property_code' => 'PROP-006',
            'description' => 'Diseño minimalista de autor en exclusiva urbanización privada. Líneas puras, materiales nobles y jardín zen.',
            'price' => 520000,
            'currency' => 'USD',
            'type' => 'casa',
            'status' => 'reservado',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area' => 180,
            'address' => 'Urbanización Los Jardines, Sullana',
            'coordinates' => ['lat' => -4.8800, 'lng' => -80.6750],
            'images' => [
                'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
            ],
            'features' => ['Jardín zen', 'Piscina infinita', 'Casa inteligente', 'Urbanización privada'],
            'commission_rate' => 3.0,
        ]);

        // Clients
        $client1 = Client::create([
            'user_id' => $agent1->id,
            'name' => 'Roberto Fernández',
            'email' => 'roberto@email.com',
            'phone' => '+51 934567890',
            'source' => 'web',
            'status' => 'active',
            'budget_min' => 300000,
            'budget_max' => 500000,
            'preferred_location' => 'Sullana',
            'preferred_bedrooms' => 3,
            'notes' => 'Busca casa familiar con jardín para mudarse en 3 meses',
        ]);

        $client2 = Client::create([
            'user_id' => $agent1->id,
            'name' => 'Laura Martínez',
            'email' => 'laura@email.com',
            'phone' => '+51 945678901',
            'source' => 'referido',
            'status' => 'prospect',
            'budget_min' => 200000,
            'budget_max' => 350000,
            'preferred_location' => 'Centro de Sullana',
            'preferred_bedrooms' => 2,
            'notes' => 'Interesada en departamento para inversión',
        ]);

        $client3 = Client::create([
            'user_id' => $agent2->id,
            'name' => 'Juan Pérez',
            'email' => 'juan@email.com',
            'phone' => '+51 956789012',
            'source' => 'llamada',
            'status' => 'lead',
            'budget_min' => 500000,
            'budget_max' => 800000,
            'preferred_location' => 'Urbanización El Palmo',
            'preferred_bedrooms' => 4,
            'notes' => 'Busca propiedad de lujo',
        ]);

        $client4 = Client::create([
            'user_id' => $agent2->id,
            'name' => 'Ana Rodríguez',
            'email' => 'ana@email.com',
            'phone' => '+51 967890123',
            'source' => 'web',
            'status' => 'active',
            'budget_min' => 150000,
            'budget_max' => 250000,
            'preferred_location' => 'Sullana',
            'preferred_bedrooms' => 2,
            'notes' => 'Busca casa de campo para vacaciones',
        ]);

        $client5 = Client::create([
            'user_id' => $admin->id,
            'name' => 'Pedro Sánchez',
            'email' => 'pedro@email.com',
            'phone' => '+51 978901234',
            'source' => 'referido',
            'status' => 'converted',
            'budget_min' => 400000,
            'budget_max' => 600000,
            'preferred_location' => 'Sullana',
            'preferred_bedrooms' => 3,
            'notes' => 'Cliente recurrente, ya compró 2 propiedades',
        ]);

        // Deals
        $deal1 = Deal::create([
            'client_id' => $client1->id,
            'property_id' => $prop1->id,
            'user_id' => $agent1->id,
            'stage' => 'visit',
            'offer_amount' => 420000,
            'currency' => 'USD',
            'commission_rate' => 3.5,
            'notes' => 'Cliente visitó la propiedad, muy interesado',
            'expected_close_date' => now()->addDays(30),
            'priority' => 1,
        ]);

        $deal2 = Deal::create([
            'client_id' => $client2->id,
            'property_id' => $prop2->id,
            'user_id' => $agent1->id,
            'stage' => 'negotiation',
            'offer_amount' => 290000,
            'currency' => 'USD',
            'commission_rate' => 3.0,
            'notes' => 'Negociando precio, cliente pide descuento',
            'expected_close_date' => now()->addDays(15),
            'priority' => 2,
        ]);

        $deal3 = Deal::create([
            'client_id' => $client3->id,
            'property_id' => $prop4->id,
            'user_id' => $agent2->id,
            'stage' => 'prospecting',
            'currency' => 'USD',
            'commission_rate' => 3.0,
            'notes' => 'Primer contacto, agendar visita',
            'expected_close_date' => now()->addDays(60),
            'priority' => 1,
        ]);

        $deal4 = Deal::create([
            'client_id' => $client4->id,
            'property_id' => $prop3->id,
            'user_id' => $agent2->id,
            'stage' => 'contacted',
            'offer_amount' => 250000,
            'currency' => 'USD',
            'commission_rate' => 4.0,
            'notes' => 'Cliente contactado, interesado en la propiedad',
            'expected_close_date' => now()->addDays(45),
            'priority' => 2,
        ]);

        $deal5 = Deal::create([
            'client_id' => $client5->id,
            'property_id' => $prop6->id,
            'user_id' => $admin->id,
            'stage' => 'closed_won',
            'offer_amount' => 500000,
            'final_amount' => 500000,
            'currency' => 'USD',
            'commission_rate' => 3.0,
            'commission_amount' => 15000,
            'notes' => 'Venta cerrada exitosamente',
            'expected_close_date' => now()->subDays(5),
            'actual_close_date' => now()->subDays(3),
            'priority' => 0,
        ]);

        // Appointments
        Appointment::create([
            'client_id' => $client1->id,
            'property_id' => $prop1->id,
            'user_id' => $agent1->id,
            'title' => 'Visita a Casa Familiar',
            'description' => 'Visita programada para mostrar la propiedad al cliente',
            'start_time' => now()->addDays(2)->setTime(10, 0),
            'end_time' => now()->addDays(2)->setTime(11, 0),
            'location' => 'Av. Panamericana Norte 1500, Sullana',
            'type' => 'visit',
            'status' => 'scheduled',
        ]);

        Appointment::create([
            'client_id' => $client2->id,
            'property_id' => $prop2->id,
            'user_id' => $agent1->id,
            'title' => 'Revisión de Documentación',
            'description' => 'Revisar documentos para la compra del departamento',
            'start_time' => now()->addDay()->setTime(14, 0),
            'end_time' => now()->addDay()->setTime(15, 30),
            'type' => 'meeting',
            'status' => 'confirmed',
        ]);

        Appointment::create([
            'client_id' => $client3->id,
            'property_id' => $prop4->id,
            'user_id' => $agent2->id,
            'title' => 'Llamada de Seguimiento',
            'description' => 'Llamar para agendar visita al penthouse',
            'start_time' => now()->addDays(3)->setTime(11, 0),
            'end_time' => now()->addDays(3)->setTime(11, 30),
            'type' => 'call',
            'status' => 'scheduled',
        ]);

        Appointment::create([
            'client_id' => $client4->id,
            'property_id' => $prop3->id,
            'user_id' => $agent2->id,
            'title' => 'Visita a Casa de Campo',
            'description' => 'Visita para mostrar la propiedad con vista al río',
            'start_time' => now()->addDays(5)->setTime(16, 0),
            'end_time' => now()->addDays(5)->setTime(17, 0),
            'type' => 'visit',
            'status' => 'scheduled',
        ]);

        // Tasks
        Task::create([
            'user_id' => $agent1->id,
            'client_id' => $client1->id,
            'deal_id' => $deal1->id,
            'title' => 'Enviar información adicional',
            'description' => 'Enviar planos y documentación de la propiedad al cliente',
            'type' => 'email',
            'priority' => 'high',
            'status' => 'pending',
            'due_date' => now()->addDay(),
        ]);

        Task::create([
            'user_id' => $agent1->id,
            'client_id' => $client2->id,
            'deal_id' => $deal2->id,
            'title' => 'Preparar propuesta de descuento',
            'description' => 'Elaborar propuesta con 5% de descuento para el departamento',
            'type' => 'document',
            'priority' => 'urgent',
            'status' => 'in_progress',
            'due_date' => today(),
        ]);

        Task::create([
            'user_id' => $agent2->id,
            'client_id' => $client3->id,
            'deal_id' => $deal3->id,
            'title' => 'Llamar para agendar visita',
            'description' => 'Contactar al cliente para coordinar visita al penthouse',
            'type' => 'call',
            'priority' => 'medium',
            'status' => 'pending',
            'due_date' => now()->addDays(2),
        ]);

        Task::create([
            'user_id' => $agent2->id,
            'client_id' => $client4->id,
            'title' => 'Preparar recorrido virtual',
            'description' => 'Crear video tour de la propiedad con vista al río',
            'type' => 'other',
            'priority' => 'low',
            'status' => 'pending',
            'due_date' => now()->addDays(5),
        ]);

        Task::create([
            'user_id' => $admin->id,
            'client_id' => $client5->id,
            'deal_id' => $deal5->id,
            'title' => 'Enviar contrato de venta',
            'description' => 'Preparar y enviar contrato final de la propiedad',
            'type' => 'document',
            'priority' => 'high',
            'status' => 'completed',
            'due_date' => now()->subDays(5),
            'completed_at' => now()->subDays(4),
            'completion_notes' => 'Contrato enviado y firmado',
        ]);

        // Company Settings
        $this->call(CompanySettingSeeder::class);

        // Services
        $this->call(ServiceSeeder::class);
    }
}
