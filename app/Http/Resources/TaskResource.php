<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'clientId' => $this->client_id ? (string) $this->client_id : null,
            'dealId' => $this->deal_id ? (string) $this->deal_id : null,
            'propertyId' => $this->property_id ? (string) $this->property_id : null,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'priority' => $this->priority,
            'status' => $this->status,
            'dueDate' => $this->due_date?->toIso8601String(),
            'dueTime' => $this->due_time,
            'completedAt' => $this->completed_at?->toIso8601String(),
            'completionNotes' => $this->completion_notes,
            'isOverdue' => $this->isOverdue(),
            'isDueToday' => $this->isDueToday(),
            'client' => new ClientResource($this->whenLoaded('client')),
            'deal' => new DealResource($this->whenLoaded('deal')),
            'property' => new PropertyResource($this->whenLoaded('property')),
            'user' => new UserResource($this->whenLoaded('user')),
            'createdAt' => $this->created_at->toIso8601String(),
            'updatedAt' => $this->updated_at->toIso8601String(),
        ];
    }
}
