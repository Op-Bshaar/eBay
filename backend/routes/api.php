<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderRequestController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PaymentController;
use App\Models\OrderRequest;
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

Route::middleware('auth:sanctum')->post('/request-verification-email', [AuthController::class,'requestVerificationEmail'])->name('verification.send');

Route::middleware('auth:sanctum')->post('/update-email', [AuthController::class,'updateEmail']);


//request email verification
 

//logout
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);



//product route
Route::get('/products/search', [ProductController::class, 'search']);

Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);

// Route for seller
Route::middleware('auth:sanctum')->group(function (): void{
Route::get('/seller',[SellerController::class, 'getCurrentSeller']);
Route::get('/sellers/orders/{id}', [SellerController::class, 'getOrderItem']);
Route::get('/sellers/products', [SellerController::class, 'getProducts']);
Route::get('/sellers/products/{id}', [SellerController::class, 'getproduct']);
Route::get('/sellers/orders', [SellerController::class, 'getOrders']);
Route::post('/sellers/products/{id}', [SellerController::class, 'updateProduct']);
Route::delete('/sellers/products/{id}', [SellerController::class, 'deleteProduct']);
Route::post('/sellers/products', [SellerController::class, 'addProducts']);
Route::post('/sellers/orders/ship/{orderId}', [SellerController::class, 'shipOrder']);
Route::put('/sellers/set-bank-info',[SellerController::class, 'setBankInfo']);


});


//Route for category 
Route::get('/categories', [CategoryController::class, 'index']);

// cart Route
Route::middleware('auth:sanctum')->group(function() {
        Route::put('/cart', [CartController::class, 'updateCart']);
        Route::get('/cart', [CartController::class, 'getCart']);
    });



//reviews Route
Route::post('/products/{productId}/review', [ReviewController::class, 'store'])
    ->middleware('auth:sanctum');


Route::post('/order-request-items/{id}/review', [ReviewController::class, 'store'])->middleware('auth:sanctum');;
Route::get('/sellers/average-rating/{seller_id}', [ReviewController::class, 'getSellerAverageRating']);
//admin route

Route::middleware(['auth:sanctum'])->group(function () {
    Route::middleware('AdminMiddleware')->group(function () {
        Route::get('admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('admin/users', [AdminController::class, 'index']);
        Route::get('admin/products',[AdminController::class, 'products']);
        Route::put('admin/products/{id}/availability', [AdminController::class, 'updateAvailability']);
        Route::get('admin/statistics/ProductAmount',[AdminController::class, 'ProductAmount']);
        Route::get('admin/statistics/CategoryAmount',[AdminController::class, 'getCategoryAppearances']);
        Route::get('admin/statistics/UploadsThisWeek',[AdminController::class, 'UploadsThisWeek']);
        Route::get('admin/orders',[AdminController::class, 'orders']);
        Route::get('admin/orders/{id}',[AdminController::class, 'show']);
        Route::get('admin/settings', [AdminController::class, 'settings']);

        Route::post('admin/AddCategory', [AdminController::class, 'store']);
    });
});


// return current user
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// user profile

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/profile', [AuthController::class, 'getProfile']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
});



// order request routes
Route::middleware(['auth:sanctum', 'verified'])->get(('/orders/get-payment-link/{order_id}'),[PaymentController::class, 'getPaymentLink']);
Route::middleware('auth:sanctum')->post(('/orders'),[OrderRequestController::class, 'placeOrder']);
Route::middleware('auth:sanctum')->get(('/orders/{order_id}'),[OrderRequestController::class, 'getOrder']);
Route::middleware('auth:sanctum')->get(('/orders'),[OrderRequestController::class, 'getOrders']);
Route::middleware('auth:sanctum')->get(('/orders/cancel/{order_id}'),[OrderRequestController::class, 'cancel']);


//only for testing
Route::get('/orders/set-paid/{order_id}',function($order_id){
    $order = OrderRequest::findOrFail($order_id);
    $order->setAsPaid('test');
    return $order->status;
});