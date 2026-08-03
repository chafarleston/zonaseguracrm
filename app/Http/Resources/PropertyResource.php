<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => $this->user_id ? (string) $this->user_id : null,
            'title' => $this->title,
            'propertyCode' => $this->property_code,
            'description' => $this->description,
            'price' => round((float) $this->price, 2),
            'currency' => $this->currency,
            'commissionRate' => (float) $this->commission_rate,
            'type' => $this->type,
            'status' => $this->status,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'area' => (float) $this->area,
            'address' => $this->address,
            'coordinates' => $this->coordinates,
            'images' => $this->images,
            'features' => $this->features,
            'notes' => $this->notes,
            'user' => new UserResource($this->whenLoaded('user')),
            'deals' => DealResource::collection($this->whenLoaded('deals')),
            'appointments' => AppointmentResource::collection($this->whenLoaded('appointments')),
            'documents' => DocumentResource::collection($this->whenLoaded('documents')),
            'createdAt' => $this->created_at->toIso8601String(),
            'updatedAt' => $this->updated_at->toIso8601String(),
        ];
    }
}
