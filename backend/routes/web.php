<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
 
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
 
        // Redirect to the frontend URL defined in the environment file
        return redirect('/');
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');

Route::get('/', function () {
    return view('welcome');
});
