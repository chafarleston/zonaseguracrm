<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanySettingResource;
use App\Models\CompanySetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CompanySettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = CompanySetting::getSettings();

        return response()->json(new CompanySettingResource($settings));
    }

    public function update(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:255',
            'company_subtitle' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'contact_person' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'footer_text' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $data = $request->only([
            'company_name',
            'company_subtitle',
            'phone',
            'email',
            'address',
            'city',
            'country',
            'contact_person',
            'description',
            'footer_text',
        ]);

        $settings = CompanySetting::updateSettings($data);

        return response()->json(new CompanySettingResource($settings));
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'logo' => 'required|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Archivo inválido', 'details' => $validator->errors()], 400);
        }

        $settings = CompanySetting::getSettings();

        if ($settings->logo_url && Storage::disk('public')->exists($settings->logo_url)) {
            Storage::disk('public')->delete($settings->logo_url);
        }

        $path = $request->file('logo')->store('logos', 'public');

        $settings->update(['logo_url' => $path]);

        return response()->json(new CompanySettingResource($settings->fresh()));
    }
}
