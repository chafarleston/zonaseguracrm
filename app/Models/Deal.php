<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deal extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'property_id',
        'user_id',
        'stage',
        'offer_amount',
        'final_amount',
        'currency',
        'commission_rate',
        'commission_amount',
        'notes',
        'expected_close_date',
        'actual_close_date',
        'priority',
    ];

    protected function casts(): array
    {
        return [
            'offer_amount' => 'decimal:2',
            'final_amount' => 'decimal:2',
            'commission_rate' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'expected_close_date' => 'date',
            'actual_close_date' => 'date',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'documentable_id')->where('documentable_type', 'deal');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'activitable_id')->where('activitable_type', 'deal');
    }

    public function isWon(): bool
    {
        return $this->stage === 'closed_won';
    }

    public function isLost(): bool
    {
        return $this->stage === 'closed_lost';
    }

    public function isClosed(): bool
    {
        return in_array($this->stage, ['closed_won', 'closed_lost']);
    }
}
