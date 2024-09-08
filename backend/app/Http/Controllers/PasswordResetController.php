<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);


        $status = Password::sendResetLink(
            $request->only('email')
        );


        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'If the email exists, a password reset link has been sent.'], 200)
            : response()->json(['message' => 'If the email exists, a password reset link has been sent.'], 400);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
 
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password has been successfully reset.'], 200)
            : response()->json(['message' => __($status)], 400);
    }
}
