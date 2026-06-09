<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'longDescription' => $this->long_description,
            'imageUrl' => $this->image_url,
            'imageFullUrl' => $this->image_url ? asset('storage/' . $this->image_url) : null,
            'icon' => $this->icon,
            'sortOrder' => $this->sort_order,
            'isActive' => $this->is_active,
        ];
    }
}
