<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'secondary_phone',
        'source',
        'status',
        'notes',
        'preferences',
        'budget_min',
        'budget_max',
        'preferred_location',
        'preferred_bedrooms',
    ];

    protected function casts(): array
    {
        return [
            'preferences' => 'array',
            'budget_min' => 'decimal:2',
            'budget_max' => 'decimal:2',
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
        return $this->hasMany(Document::class, 'documentable_id')->where('documentable_type', 'client');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'activitable_id')->where('activitable_type', 'client');
    }
}
