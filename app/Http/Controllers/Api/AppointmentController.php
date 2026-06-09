<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['client', 'property', 'user']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
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

        if ($request->has('date_from')) {
            $query->where('start_time', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('start_time', '<=', $request->date_to);
        }

        if ($request->has('today')) {
            $query->whereDate('start_time', now()->toDateString());
        }

        if ($request->has('upcoming')) {
            $query->where('start_time', '>=', now())
                  ->whereIn('status', ['scheduled', 'confirmed']);
        }

        $sortBy = $request->get('sort_by', 'start_time');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $appointments = $query->paginate($request->get('per_page', 15));

        return response()->json($appointments);
    }

    public function show(Appointment $appointment): JsonResponse
    {
        $appointment->load(['client', 'property', 'user']);

        return response()->json(new AppointmentResource($appointment));
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'property_id' => 'nullable|exists:properties,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string|max:255',
            'type' => 'nullable|string|in:visit,meeting,call,follow_up,other',
            'status' => 'nullable|string|in:scheduled,confirmed,completed,cancelled,rescheduled',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $appointment = Appointment::create([
            ...$request->all(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json(new AppointmentResource($appointment), 201);
    }

    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'property_id' => 'nullable|exists:properties,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string|max:255',
            'type' => 'nullable|string|in:visit,meeting,call,follow_up,other',
            'status' => 'nullable|string|in:scheduled,confirmed,completed,cancelled,rescheduled',
            'notes' => 'nullable|string',
            'cancellation_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $appointment->update($request->all());

        return response()->json(new AppointmentResource($appointment));
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->delete();
        return response()->json(null, 204);
    }

    public function cancel(Request $request, Appointment $appointment): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'cancellation_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $appointment->update([
            'status' => 'cancelled',
            'cancellation_reason' => $request->cancellation_reason,
        ]);

        return response()->json(new AppointmentResource($appointment));
    }

    public function complete(Appointment $appointment): JsonResponse
    {
        $appointment->update(['status' => 'completed']);

        return response()->json(new AppointmentResource($appointment));
    }

    public function calendar(Request $request): JsonResponse
    {
        $query = Appointment::with(['client', 'property', 'user'])
            ->whereIn('status', ['scheduled', 'confirmed']);

        if ($request->has('month')) {
            $query->whereMonth('start_time', $request->month);
        }

        if ($request->has('year')) {
            $query->whereYear('start_time', $request->year);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $appointments = $query->orderBy('start_time', 'asc')->get();

        return response()->json($appointments);
    }
}
