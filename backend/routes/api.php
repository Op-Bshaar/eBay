<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/loginphone', [AuthController::class, 'loginPhone']);
Route::post('/loginemail', [AuthController::class, 'loginEmail']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verifyCode',[AuthController::class, 'verifyCode']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
//product route


Route::middleware('auth:sanctum')->get('/products/search', [ProductController::class, 'search']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Route for seller

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});




// cart Route

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
});


//admin route

Route::middleware(['AdminMiddleware'])->group(function () {
    Route::get('admin/dashboard',  [AdminController::class, 'dashborad']);
    Route::get('admin/users',  [AdminController::class, 'index']);
    
});



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
