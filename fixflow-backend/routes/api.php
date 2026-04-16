<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\TiketController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/users/toggle-online', [AuthController::class, 'toggleOnline']);
    Route::get('/logs', fn() => response()->json(\App\Models\Log::latest()->take(20)->get()));

    Route::apiResource('machines', MachineController::class);
    Route::apiResource('tickets',  TiketController::class);

});
