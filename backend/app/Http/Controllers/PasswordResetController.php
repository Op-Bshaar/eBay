<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use Carbon\Carbon;

class PasswordResetController extends Controller
{

    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

   
        if (!$user) {
            return response()->json(['message' => 'If the email exists, a reset link will be sent.'], 200);
        }


        $resetToken = Str::random(60);


        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($resetToken),
                'created_at' => Carbon::now(),
            ]
        );

        // Generate reset URL
        $resetUrl = url("/reset-password?token=$resetToken&email=" . $user->email);

        // Send email with reset link
        Mail::send([], [], function ($message) use ($user, $resetUrl) {
            $message->to($user->email)
                ->subject('Password Reset Request')
                ->setBody("Click here to reset your password: <a href='$resetUrl'>Reset Password</a>", 'text/html');
        });

        return response()->json(['message' => 'If the email exists, a reset link will be sent.'], 200);
    }

    // Reset the password
    public function reset(Request $request)
    {
        // Validate the request
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);


        $tokenRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

    
        if (!$tokenRecord || !Hash::check($request->token, $tokenRecord->token)) {
            return response()->json(['message' => 'Invalid token or email.'], 400);
        }

 
        if (Carbon::parse($tokenRecord->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['message' => 'Token has expired.'], 400);
        }

     
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Invalid email.'], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();


        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been successfully reset.'], 200);
    }
}
