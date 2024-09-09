<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Redirect;
 
Route::get('/login', function (Request $request) {
    return Redirect::away(env('FRONT_URL') . '/login');
});
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
     return redirect(env('FRONT_URL') . '/email-verified-successfuly');
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');

Route::get('/', function () {
    return view('welcome');
});
