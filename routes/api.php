<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CompanySettingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DealController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

// Properties (public read)
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{property}', [PropertyController::class, 'show']);

// Company Settings (public read)
Route::get('/settings', [CompanySettingController::class, 'index']);

// Services (public read)
Route::get('/services', [ServiceController::class, 'active']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Company Settings (write - admin only)
    Route::put('/settings', [CompanySettingController::class, 'update'])->middleware('admin');
    Route::post('/settings/logo', [CompanySettingController::class, 'uploadLogo'])->middleware('admin');

    // Services (write - admin only)
    Route::apiResource('services/manage', ServiceController::class)->middleware('admin');
    Route::post('/services/{service}/image', [ServiceController::class, 'uploadImage'])->middleware('admin');
    // Properties (write)
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::post('/properties/upload-image', [PropertyController::class, 'uploadImage']);
    Route::put('/properties/{property}', [PropertyController::class, 'update']);
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->middleware('admin');

    // Clients
    Route::apiResource('clients', ClientController::class);
    Route::post('/clients/{client}/convert', [ClientController::class, 'convert']);

    // Deals
    Route::apiResource('deals', DealController::class);
    Route::put('/deals/{deal}/stage', [DealController::class, 'updateStage']);
    Route::get('/pipeline', [DealController::class, 'pipeline']);

    // Appointments
    Route::apiResource('appointments', AppointmentController::class);
    Route::put('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::put('/appointments/{appointment}/complete', [AppointmentController::class, 'complete']);
    Route::get('/calendar', [AppointmentController::class, 'calendar']);

    // Tasks
    Route::apiResource('tasks', TaskController::class);
    Route::put('/tasks/{task}/complete', [TaskController::class, 'complete']);
    Route::put('/tasks/{task}/start', [TaskController::class, 'start']);

    // Documents
    Route::apiResource('documents', DocumentController::class);
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/agents', [DashboardController::class, 'agents']);

    // Reports
    Route::get('/reports/sales', [ReportController::class, 'sales']);
    Route::get('/reports/agents', [ReportController::class, 'agents']);
    Route::get('/reports/properties', [ReportController::class, 'properties']);
    Route::get('/reports/clients', [ReportController::class, 'clients']);

    // Users
    Route::apiResource('users', UserController::class)->middleware('admin');
});
