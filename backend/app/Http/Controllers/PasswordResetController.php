<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\PasswordResetMail;
use App\Models\User;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link to the user's email.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendResetLink(Request $request)
    {
        // Validate the request
        $request->validate(['email' => 'required|email']);

        // Get user by email
        $user = User::where('email', $request->email)->first();

        // Always return the same response for security reasons
        if (!$user) {
            return response()->json(['message' => 'If the email exists, a reset link will be sent.'], 200);
        }

        // Generate reset token
        $resetToken = Str::random(60);

        // Store token in password_reset_tokens table
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($resetToken),
                'created_at' => Carbon::now(),
            ]
        );

        // Generate reset URL
        $resetUrl = url("/reset-password?token=$resetToken&email=" . $user->email);

        // Use Mailable class to send the reset link
        Mail::to($user->email)->send(new PasswordResetMail($resetUrl));

        return response()->json(['message' => 'If the email exists, a reset link will be sent.'], 200);
    }

    /**
     * Reset the user's password.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reset(Request $request)
    {
        // Validate the request
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        // Get the token record from the database
        $tokenRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        // Check if token and email are valid
        if (!$tokenRecord || !Hash::check($request->token, $tokenRecord->token)) {
            return response()->json(['message' => 'Invalid token or email.'], 400);
        }

        // Check if token has expired
        if (Carbon::parse($tokenRecord->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['message' => 'Token has expired.'], 400);
        }

        // Get the user by email
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Invalid email.'], 400);
        }

        // Update the user's password
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the password reset token after successful password reset
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been successfully reset.'], 200);
    }
}
