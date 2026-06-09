<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'activitableType' => $this->activitable_type,
            'activitableId' => (string) $this->activitable_id,
            'type' => $this->type,
            'description' => $this->description,
            'oldValues' => $this->old_values,
            'newValues' => $this->new_values,
            'ipAddress' => $this->ip_address,
            'user' => new UserResource($this->whenLoaded('user')),
            'createdAt' => $this->created_at->toIso8601String(),
        ];
    }
}
