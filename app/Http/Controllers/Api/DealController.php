<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DealResource;
use App\Models\Deal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DealController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Deal::with(['client', 'property', 'user']);

        if ($request->has('stage')) {
            $query->where('stage', $request->stage);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->has('property_id')) {
            $query->where('property_id', $request->property_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('client', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('property', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $deals = $query->paginate($request->get('per_page', 15));

        return response()->json($deals);
    }

    public function show(Deal $deal): JsonResponse
    {
        $deal->load(['client', 'property', 'user', 'tasks', 'activities.user']);

        return response()->json(new DealResource($deal));
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'property_id' => 'required|exists:properties,id',
            'stage' => 'nullable|string|in:prospecting,contacted,visit,negotiation,offer,closed_won,closed_lost',
            'offer_amount' => 'nullable|numeric|min:0',
            'final_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'expected_close_date' => 'nullable|date',
            'priority' => 'nullable|integer|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $deal = Deal::create([
            ...$request->all(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json(new DealResource($deal), 201);
    }

    public function update(Request $request, Deal $deal): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'property_id' => 'required|exists:properties,id',
            'stage' => 'nullable|string|in:prospecting,contacted,visit,negotiation,offer,closed_won,closed_lost',
            'offer_amount' => 'nullable|numeric|min:0',
            'final_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'expected_close_date' => 'nullable|date',
            'actual_close_date' => 'nullable|date',
            'priority' => 'nullable|integer|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $deal->update($request->all());

        return response()->json(new DealResource($deal));
    }

    public function destroy(Deal $deal): JsonResponse
    {
        $deal->delete();
        return response()->json(null, 204);
    }

    public function updateStage(Request $request, Deal $deal): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'stage' => 'required|string|in:prospecting,contacted,visit,negotiation,offer,closed_won,closed_lost',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $oldStage = $deal->stage;
        $deal->update(['stage' => $request->stage]);

        if ($request->stage === 'closed_won') {
            $deal->update([
                'actual_close_date' => now(),
                'final_amount' => $deal->offer_amount ?? $deal->property->price,
                'commission_amount' => ($deal->offer_amount ?? $deal->property->price) * ($deal->commission_rate / 100),
            ]);
        }

        return response()->json(new DealResource($deal));
    }

    public function pipeline(Request $request): JsonResponse
    {
        $query = Deal::with(['client', 'property', 'user'])
            ->whereNotIn('stage', ['closed_won', 'closed_lost']);

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $deals = $query->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('stage');

        $pipeline = [
            'prospecting' => $deals->get('prospecting', collect()),
            'contacted' => $deals->get('contacted', collect()),
            'visit' => $deals->get('visit', collect()),
            'negotiation' => $deals->get('negotiation', collect()),
            'offer' => $deals->get('offer', collect()),
        ];

        return response()->json($pipeline);
    }
}
