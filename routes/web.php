<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;

Route::get('/{path?}', function (?string $path = null): Response {
    $spaPath = public_path('spa.html');

    if (!File::exists($spaPath)) {
        abort(404, 'SPA not found');
    }

    return response()->file($spaPath, [
        'Content-Type' => 'text/html',
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
    ]);
})->where('path', '.*');
