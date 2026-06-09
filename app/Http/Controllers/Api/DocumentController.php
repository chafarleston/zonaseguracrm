<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Document::with(['user']);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('documentable_type')) {
            $query->where('documentable_type', $request->documentable_type);
        }

        if ($request->has('documentable_id')) {
            $query->where('documentable_id', $request->documentable_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $documents = $query->paginate($request->get('per_page', 15));

        return response()->json($documents);
    }

    public function show(Document $document): JsonResponse
    {
        $document->load(['user']);

        return response()->json(new DocumentResource($document));
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240',
            'name' => 'required|string|max:255',
            'documentable_type' => 'required|string|in:property,client,deal',
            'documentable_id' => 'required|integer',
            'category' => 'nullable|string|in:contract,deed,photo,id_document,financial,other',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $file = $request->file('file');
        $path = $file->store('documents', 'public');

        $document = Document::create([
            'user_id' => $request->user()->id,
            'documentable_type' => $request->documentable_type,
            'documentable_id' => $request->documentable_id,
            'name' => $request->name,
            'file_path' => $path,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'category' => $request->category ?? 'other',
            'description' => $request->description,
        ]);

        return response()->json(new DocumentResource($document), 201);
    }

    public function update(Request $request, Document $document): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|in:contract,deed,photo,id_document,financial,other',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'details' => $validator->errors()], 400);
        }

        $document->update($request->only(['name', 'category', 'description']));

        return response()->json(new DocumentResource($document));
    }

    public function destroy(Document $document): JsonResponse
    {
        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return response()->json(null, 204);
    }

    public function download(Document $document): JsonResponse
    {
        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json(['error' => 'Archivo no encontrado'], 404);
        }

        return response()->json([
            'url' => Storage::disk('public')->url($document->file_path),
            'name' => $document->name,
            'type' => $document->file_type,
        ]);
    }
}
