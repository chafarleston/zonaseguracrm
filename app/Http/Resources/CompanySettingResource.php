<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanySettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'companyName' => $this->company_name,
            'companySubtitle' => $this->company_subtitle,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'contactPerson' => $this->contact_person,
            'logoUrl' => $this->logo_url,
            'logoFullUrl' => $this->logo_url ? '/storage/' . $this->logo_url : null,
            'description' => $this->description,
            'footerText' => $this->footer_text,
        ];
    }
}
