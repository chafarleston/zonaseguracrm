<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'property_code',
        'description',
        'price',
        'currency',
        'commission_rate',
        'type',
        'status',
        'bedrooms',
        'bathrooms',
        'half_bathrooms',
        'parking_spaces',
        'area',
        'terrain_total_area',
        'terrain_built_area',
        'terrain_free_area',
        'terrain_measurements',
        'property_age',
        'property_floors',
        'has_drainage',
        'has_gas',
        'has_electricity',
        'address',
        'coordinates',
        'images',
        'features',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'commission_rate' => 'decimal:2',
            'area' => 'decimal:2',
            'terrain_total_area' => 'decimal:2',
            'terrain_built_area' => 'decimal:2',
            'terrain_free_area' => 'decimal:2',
            'coordinates' => 'array',
            'images' => 'array',
            'features' => 'array',
            'has_drainage' => 'boolean',
            'has_gas' => 'boolean',
            'has_electricity' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function deals(): HasMany
    {
        return $this->hasMany(Deal::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'documentable_id')->where('documentable_type', 'property');
    }
}
