<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Client::with(['user', 'deals']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('source')) {
            $query->where('source', $request->source);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->has('assigned_to')) {
            $query->where('user_id', $request->assigned_to);
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $clients = $query->paginate($request->get('per_page', 15));

        return response()->json($clients);
    }

    public function show(Client $client): JsonResponse
    {
        $client->load(['user', 'deals.property', 'appointments', 'tasks', 'activities.user']);

        return response()->json(new ClientResource($client));
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:clients,email',
            'phone' => 'nullable|string|max:50',
            'secondary_phone' => 'nullable|string|max:50',
            'source' => 'nullable|string',
            'status' => 'nullable|string|in:lead,prospect,active,inactive,converted',
            'notes' => 'nullable|string',
            'preferences' => 'nullable|array',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|min:0',
            'preferred_location' => 'nullable|string|max:255',
            'preferred_bedrooms' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $client = Client::create([
            ...$request->all(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json(new ClientResource($client), 201);
    }

    public function update(Request $request, Client $client): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:clients,email,' . $client->id,
            'phone' => 'nullable|string|max:50',
            'secondary_phone' => 'nullable|string|max:50',
            'source' => 'nullable|string',
            'status' => 'nullable|string|in:lead,prospect,active,inactive,converted',
            'notes' => 'nullable|string',
            'preferences' => 'nullable|array',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|min:0',
            'preferred_location' => 'nullable|string|max:255',
            'preferred_bedrooms' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $client->update($request->all());

        return response()->json(new ClientResource($client));
    }

    public function destroy(Client $client): JsonResponse
    {
        $client->delete();
        return response()->json(null, 204);
    }

    public function convert(Client $client): JsonResponse
    {
        $client->update(['status' => 'converted']);

        return response()->json(new ClientResource($client));
    }
}
