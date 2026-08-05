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
            'halfBathrooms' => 'nullable|integer|min:0',
            'parkingSpaces' => 'nullable|integer|min:0',
            'area' => 'required|numeric|min:0',
            'terrainTotalArea' => 'nullable|numeric|min:0',
            'terrainBuiltArea' => 'nullable|numeric|min:0',
            'terrainFreeArea' => 'nullable|numeric|min:0',
            'terrainMeasurements' => 'nullable|string|max:100',
            'propertyAge' => 'nullable|integer|min:0',
            'propertyFloors' => 'nullable|integer|min:0',
            'hasDrainage' => 'nullable|boolean',
            'hasGas' => 'nullable|boolean',
            'hasElectricity' => 'nullable|boolean',
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
            'price' => (float) $request->input('price', 0),
            'area' => (float) $request->input('area', 0),
            'terrain_total_area' => $request->input('terrainTotalArea') !== null ? (float) $request->input('terrainTotalArea') : null,
            'terrain_built_area' => $request->input('terrainBuiltArea') !== null ? (float) $request->input('terrainBuiltArea') : null,
            'terrain_free_area' => $request->input('terrainFreeArea') !== null ? (float) $request->input('terrainFreeArea') : null,
            'terrain_measurements' => $request->input('terrainMeasurements'),
            'half_bathrooms' => $request->input('halfBathrooms', 0),
            'parking_spaces' => $request->input('parkingSpaces', 0),
            'property_age' => $request->input('propertyAge') !== null ? (int) $request->input('propertyAge') : null,
            'property_floors' => $request->input('propertyFloors') !== null ? (int) $request->input('propertyFloors') : null,
            'has_drainage' => $request->boolean('hasDrainage'),
            'has_gas' => $request->boolean('hasGas'),
            'has_electricity' => $request->boolean('hasElectricity'),
            'coordinates' => $request->input('coordinates') ?? ['lat' => 0, 'lng' => 0],
            'images' => $request->input('images') ?? [],
            'features' => $request->input('features') ?? [],
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
            'halfBathrooms' => 'nullable|integer|min:0',
            'parkingSpaces' => 'nullable|integer|min:0',
            'area' => 'required|numeric|min:0',
            'terrainTotalArea' => 'nullable|numeric|min:0',
            'terrainBuiltArea' => 'nullable|numeric|min:0',
            'terrainFreeArea' => 'nullable|numeric|min:0',
            'terrainMeasurements' => 'nullable|string|max:100',
            'propertyAge' => 'nullable|integer|min:0',
            'propertyFloors' => 'nullable|integer|min:0',
            'hasDrainage' => 'nullable|boolean',
            'hasGas' => 'nullable|boolean',
            'hasElectricity' => 'nullable|boolean',
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
        $data['price'] = (float) $request->input('price', 0);
        $data['area'] = (float) $request->input('area', 0);
        $data['terrain_total_area'] = $request->input('terrainTotalArea') !== null ? (float) $request->input('terrainTotalArea') : null;
        $data['terrain_built_area'] = $request->input('terrainBuiltArea') !== null ? (float) $request->input('terrainBuiltArea') : null;
        $data['terrain_free_area'] = $request->input('terrainFreeArea') !== null ? (float) $request->input('terrainFreeArea') : null;
        $data['terrain_measurements'] = $request->input('terrainMeasurements');
        $data['half_bathrooms'] = $request->input('halfBathrooms', 0);
        $data['parking_spaces'] = $request->input('parkingSpaces', 0);
        $data['property_age'] = $request->input('propertyAge') !== null ? (int) $request->input('propertyAge') : null;
        $data['property_floors'] = $request->input('propertyFloors') !== null ? (int) $request->input('propertyFloors') : null;
        $data['has_drainage'] = $request->boolean('hasDrainage');
        $data['has_gas'] = $request->boolean('hasGas');
        $data['has_electricity'] = $request->boolean('hasElectricity');
        
        $property->update($data);

        return response()->json(new PropertyResource($property));
    }

    public function destroy(Property $property): JsonResponse
    {
        $property->delete();
        return response()->json(null, 204);
    }
}
