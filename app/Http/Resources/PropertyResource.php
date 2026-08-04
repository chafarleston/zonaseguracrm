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
            'halfBathrooms' => $this->half_bathrooms,
            'parkingSpaces' => $this->parking_spaces,
            'area' => (float) $this->area,
            'terrainTotalArea' => $this->terrain_total_area !== null ? (float) $this->terrain_total_area : null,
            'terrainBuiltArea' => $this->terrain_built_area !== null ? (float) $this->terrain_built_area : null,
            'terrainFreeArea' => $this->terrain_free_area !== null ? (float) $this->terrain_free_area : null,
            'terrainMeasurements' => $this->terrain_measurements,
            'propertyAge' => $this->property_age,
            'propertyFloors' => $this->property_floors,
            'hasDrainage' => (bool) $this->has_drainage,
            'hasGas' => (bool) $this->has_gas,
            'hasElectricity' => (bool) $this->has_electricity,
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
