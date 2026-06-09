<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Task::with(['client', 'deal', 'property', 'user']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->has('deal_id')) {
            $query->where('deal_id', $request->deal_id);
        }

        if ($request->has('overdue')) {
            $query->where('due_date', '<', now()->toDateString())
                  ->where('status', '!=', 'completed');
        }

        if ($request->has('due_today')) {
            $query->whereDate('due_date', now()->toDateString());
        }

        if ($request->has('upcoming')) {
            $query->where('due_date', '>=', now()->toDateString())
                  ->where('status', 'pending');
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'due_date');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $tasks = $query->paginate($request->get('per_page', 15));

        return response()->json($tasks);
    }

    public function show(Task $task): JsonResponse
    {
        $task->load(['client', 'deal.property', 'property', 'user']);

        return response()->json(new TaskResource($task));
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_id' => 'nullable|exists:clients,id',
            'deal_id' => 'nullable|exists:deals,id',
            'property_id' => 'nullable|exists:properties,id',
            'type' => 'nullable|string|in:call,email,follow_up,meeting,document,other',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'status' => 'nullable|string|in:pending,in_progress,completed,cancelled',
            'due_date' => 'nullable|date',
            'due_time' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $task = Task::create([
            ...$request->all(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json(new TaskResource($task), 201);
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_id' => 'nullable|exists:clients,id',
            'deal_id' => 'nullable|exists:deals,id',
            'property_id' => 'nullable|exists:properties,id',
            'type' => 'nullable|string|in:call,email,follow_up,meeting,document,other',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'status' => 'nullable|string|in:pending,in_progress,completed,cancelled',
            'due_date' => 'nullable|date',
            'due_time' => 'nullable|date_format:H:i',
            'completion_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $task->update($request->all());

        return response()->json(new TaskResource($task));
    }

    public function destroy(Task $task): JsonResponse
    {
        $task->delete();
        return response()->json(null, 204);
    }

    public function complete(Request $request, Task $task): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'completion_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $task->complete($request->completion_notes);

        return response()->json(new TaskResource($task));
    }

    public function start(Task $task): JsonResponse
    {
        $task->update(['status' => 'in_progress']);

        return response()->json(new TaskResource($task));
    }
}
