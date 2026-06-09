<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Service::orderBy('sort_order')->get();

        return response()->json(ServiceResource::collection($services));
    }

    public function active(): JsonResponse
    {
        $services = Service::getActive();

        return response()->json(ServiceResource::collection($services));
    }

    public function show(Service $service): JsonResponse
    {
        return response()->json(new ServiceResource($service));
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);
            $data['image_url'] = $request->file('image')->store('services', 'public');
            unset($data['image']);
        }

        $service = Service::create($data);

        return response()->json(new ServiceResource($service), 201);
    }

    public function update(Request $request, Service $service): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $data = $request->only(['name', 'description', 'long_description', 'icon', 'sort_order', 'is_active']);
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if ($service->image_url && Storage::disk('public')->exists($service->image_url)) {
                Storage::disk('public')->delete($service->image_url);
            }

            $data['image_url'] = $request->file('image')->store('services', 'public');
        }

        $service->update($data);

        return response()->json(new ServiceResource($service->fresh()));
    }

    public function destroy(Service $service): JsonResponse
    {
        if ($service->image_url && Storage::disk('public')->exists($service->image_url)) {
            Storage::disk('public')->delete($service->image_url);
        }

        $service->delete();

        return response()->json(null, 204);
    }

    public function uploadImage(Request $request, Service $service): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Archivo inválido', 'details' => $validator->errors()], 400);
        }

        if ($service->image_url && Storage::disk('public')->exists($service->image_url)) {
            Storage::disk('public')->delete($service->image_url);
        }

        $path = $request->file('image')->store('services', 'public');
        $service->update(['image_url' => $path]);

        return response()->json(new ServiceResource($service->fresh()));
    }
}
