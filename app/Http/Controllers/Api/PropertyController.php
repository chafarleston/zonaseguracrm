<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Property::with(['user']);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('bedrooms')) {
            $query->where('bedrooms', '>=', $request->bedrooms);
        }

        if ($request->has('bathrooms')) {
            $query->where('bathrooms', '>=', $request->bathrooms);
        }

        if ($request->has('currency')) {
            $query->where('currency', $request->currency);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('property_code', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        if ($request->has('all') && $request->all === '1') {
            $properties = $query->get();
            return response()->json(PropertyResource::collection($properties));
        }

        $properties = $query->paginate($request->get('per_page', 15));

        return response()->json($properties);
    }

    public function show(Property $property): JsonResponse
    {
        $property->load(['user', 'deals.client', 'appointments', 'documents']);

        return response()->json(new PropertyResource($property));
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'type' => 'required|string|max:50',
            'status' => 'required|string|max:50',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'area' => 'required|numeric|min:0',
            'address' => 'required|string|max:255',
            'coordinates' => 'required|array',
            'images' => 'nullable|array',
            'features' => 'nullable|array',
            'property_code' => 'nullable|string|unique:properties,property_code',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $property = Property::create([
            ...$request->all(),
            'user_id' => $request->user()->id,
            'price' => (float) $request->price,
            'area' => (float) $request->area,
            'coordinates' => $request->coordinates ?? ['lat' => 0, 'lng' => 0],
            'images' => $request->images ?? [],
            'features' => $request->features ?? [],
        ]);

        return response()->json(new PropertyResource($property), 201);
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'type' => 'required|string|max:50',
            'status' => 'required|string|max:50',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'area' => 'required|numeric|min:0',
            'address' => 'required|string|max:255',
            'coordinates' => 'required|array',
            'images' => 'nullable|array',
            'features' => 'nullable|array',
            'property_code' => 'nullable|string|unique:properties,property_code,' . $property->id,
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $data = $request->all();
        $data['price'] = (float) $request->price;
        $data['area'] = (float) $request->area;
        
        $property->update($data);

        return response()->json(new PropertyResource($property));
    }

    public function destroy(Property $property): JsonResponse
    {
        $property->delete();
        return response()->json(null, 204);
    }
}
