<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'clientId' => (string) $this->client_id,
            'propertyId' => $this->property_id ? (string) $this->property_id : null,
            'userId' => (string) $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'startTime' => $this->start_time->toIso8601String(),
            'endTime' => $this->end_time->toIso8601String(),
            'location' => $this->location,
            'type' => $this->type,
            'status' => $this->status,
            'notes' => $this->notes,
            'cancellationReason' => $this->cancellation_reason,
            'client' => new ClientResource($this->whenLoaded('client')),
            'property' => new PropertyResource($this->whenLoaded('property')),
            'user' => new UserResource($this->whenLoaded('user')),
            'createdAt' => $this->created_at->toIso8601String(),
            'updatedAt' => $this->updated_at->toIso8601String(),
        ];
    }
}
