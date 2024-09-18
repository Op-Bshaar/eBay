<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Auth\Events\Verified;
use App\Models\User;
use App\Http\Controllers\PaymentController;
 
Route::get('/login', function (Request $request) {
    return Redirect::away(env('FRONT_URL') . '/login');
});
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    
    // Find the user by ID
    $user = User::findOrFail($id);

    // Check if the hash matches the user's email verification hash
    if (! hash_equals($hash, sha1($user->getEmailForVerification()))) {
        return Redirect::away(env('FRONT_URL') . '/invalid-email-verification-link');
    }

    // Mark the email as verified
    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new Verified($user));   
         // Redirect to React frontend
        return Redirect::away(env('FRONT_URL') . '/email-verified-successfully');
    }
    return Redirect::away(env('FRONT_URL') . '/invalid-email-verification-link');

})->middleware(['signed'])->name('verification.verify');

Route::get('/', function () {
    return view('welcome');
});
// payment
Route::get('/payment/3ds-callback/{order_id}', [PaymentController::class, 'handle3DSecureCallback'])
    ->name('payment.3ds.callback');