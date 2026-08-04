<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('terrain_total_area', 10, 2)->nullable()->after('area');
            $table->decimal('terrain_built_area', 10, 2)->nullable()->after('terrain_total_area');
            $table->decimal('terrain_free_area', 10, 2)->nullable()->after('terrain_built_area');
            $table->string('terrain_measurements')->nullable()->after('terrain_free_area');
            $table->integer('property_age')->nullable()->after('terrain_measurements');
            $table->integer('property_floors')->nullable()->after('property_age');
            $table->integer('half_bathrooms')->default(0)->after('bathrooms');
            $table->integer('parking_spaces')->default(0)->after('half_bathrooms');
            $table->boolean('has_drainage')->default(false)->after('parking_spaces');
            $table->boolean('has_gas')->default(false)->after('has_drainage');
            $table->boolean('has_electricity')->default(false)->after('has_gas');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'terrain_total_area',
                'terrain_built_area',
                'terrain_free_area',
                'terrain_measurements',
                'property_age',
                'property_floors',
                'half_bathrooms',
                'parking_spaces',
                'has_drainage',
                'has_gas',
                'has_electricity',
            ]);
        });
    }
};
