<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DealResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'clientId' => (string) $this->client_id,
            'propertyId' => (string) $this->property_id,
            'userId' => (string) $this->user_id,
            'stage' => $this->stage,
            'offerAmount' => $this->offer_amount ? (float) $this->offer_amount : null,
            'finalAmount' => $this->final_amount ? (float) $this->final_amount : null,
            'currency' => $this->currency,
            'commissionRate' => (float) $this->commission_rate,
            'commissionAmount' => $this->commission_amount ? (float) $this->commission_amount : null,
            'notes' => $this->notes,
            'expectedCloseDate' => $this->expected_close_date?->toIso8601String(),
            'actualCloseDate' => $this->actual_close_date?->toIso8601String(),
            'priority' => $this->priority,
            'client' => new ClientResource($this->whenLoaded('client')),
            'property' => new PropertyResource($this->whenLoaded('property')),
            'user' => new UserResource($this->whenLoaded('user')),
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
            'activities' => ActivityResource::collection($this->whenLoaded('activities')),
            'createdAt' => $this->created_at->toIso8601String(),
            'updatedAt' => $this->updated_at->toIso8601String(),
        ];
    }
}
