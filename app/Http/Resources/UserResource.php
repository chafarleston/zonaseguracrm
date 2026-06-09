<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'role' => $this->role,
            'propertiesCount' => $this->whenCounted('properties'),
            'clientsCount' => $this->whenCounted('clients'),
            'dealsCount' => $this->whenCounted('deals'),
            'appointmentsCount' => $this->whenCounted('appointments'),
            'tasksCount' => $this->whenCounted('tasks'),
            'createdAt' => $this->created_at->toIso8601String(),
            'updatedAt' => $this->updated_at->toIso8601String(),
        ];
    }
}
