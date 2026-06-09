<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'documentableType' => $this->documentable_type,
            'documentableId' => (string) $this->documentable_id,
            'name' => $this->name,
            'filePath' => $this->file_path,
            'fileType' => $this->file_type,
            'fileSize' => $this->file_size,
            'fileSizeFormatted' => $this->file_size_formatted,
            'category' => $this->category,
            'description' => $this->description,
            'url' => $this->file_path ? asset('storage/' . $this->file_path) : null,
            'user' => new UserResource($this->whenLoaded('user')),
            'createdAt' => $this->created_at->toIso8601String(),
            'updatedAt' => $this->updated_at->toIso8601String(),
        ];
    }
}
