<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'secondaryPhone' => $this->secondary_phone,
            'source' => $this->source,
            'status' => $this->status,
            'notes' => $this->notes,
            'preferences' => $this->preferences,
            'budgetMin' => $this->budget_min ? (float) $this->budget_min : null,
            'budgetMax' => $this->budget_max ? (float) $this->budget_max : null,
            'preferredLocation' => $this->preferred_location,
            'preferredBedrooms' => $this->preferred_bedrooms,
            'user' => new UserResource($this->whenLoaded('user')),
            'deals' => DealResource::collection($this->whenLoaded('deals')),
            'appointments' => AppointmentResource::collection($this->whenLoaded('appointments')),
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
            'documents' => DocumentResource::collection($this->whenLoaded('documents')),
            'activities' => ActivityResource::collection($this->whenLoaded('activities')),
            'dealsCount' => $this->whenCounted('deals'),
            'createdAt' => $this->created_at->toIso8601String(),
            'updatedAt' => $this->updated_at->toIso8601String(),
        ];
    }
}
