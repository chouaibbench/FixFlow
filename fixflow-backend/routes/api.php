<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\TiketController;
use App\Http\Controllers\UserController;
use App\Models\Machine;
use App\Models\Ticket;
use App\Models\User;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/users/toggle-online', [AuthController::class, 'toggleOnline']);
    Route::get('/logs', fn() => response()->json(\App\Models\Log::latest()->take(20)->get()));
    Route::get('/supervisor', fn() => response()->json(\App\Models\User::where('role', 'admin')->first()));
    
    // Admin routes
    Route::get('/admin/stats', function() {
        return response()->json([
            'total_users' => \App\Models\User::count(),
            'total_workers' => \App\Models\User::where('role', 'worker')->count(),
            'total_technicians' => \App\Models\User::where('role', 'technician')->count(),
            'total_machines' => \App\Models\Machine::count(),
            'total_tickets' => \App\Models\Ticket::count(),
            'open_tickets' => \App\Models\Ticket::whereIn('status', ['pending', 'in-progress'])->count(),
            'resolved_tickets' => \App\Models\Ticket::where('status', 'resolved')->count(),
        ]);
    });
    Route::get('/admin/logs', fn() => response()->json(\App\Models\Log::latest()->take(50)->get()));
    Route::apiResource('users', \App\Http\Controllers\UserController::class);

    Route::apiResource('machines', MachineController::class);
    Route::apiResource('tickets',  TiketController::class);

});
