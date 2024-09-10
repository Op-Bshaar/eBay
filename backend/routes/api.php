<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Carbon\Carbon;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/loginphone', [AuthController::class, 'loginPhone']);
Route::post('/loginemail', [AuthController::class, 'loginEmail']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verifyCode', [AuthController::class, 'verifyCode']);

//passwordrest
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::get('/reset-password', [PasswordResetController::class, 'showResetForm']);
Route::post('/rest-password', [PasswordResetController::class, 'reset']);

// update-email
Route::middleware('auth:sanctum')->post('/update-email', [AuthController::class,'updateEmail']);


//request email verification
 
Route::middleware('auth:sanctum')->post('/request-verification-email', [AuthController::class,'requestVerificationEmail'])->name('verification.send');
//logout
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

//product route
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);

// Route for seller
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});

// cart Route
Route::middleware('auth:sanctum')->group(function() {
        Route::post('/cart', [CartController::class, 'updateCart']);
        Route::get('/cart', [CartController::class, 'getCart']);
    });


//checkout Route

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/checkout', [CheckoutController::class, 'index']);
    Route::post('/checkout', [CheckoutController::class, 'Checkoutprocess']);
});



//admin route

Route::middleware(['auth:sanctum'])->group(function () {
    Route::middleware('AdminMiddleware')->group(function () {
        Route::get('admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('admin/users', [AdminController::class, 'index']);
    });
});


// return current user
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

