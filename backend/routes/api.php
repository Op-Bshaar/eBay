<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

//product route

// Route::get('/products',)

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');