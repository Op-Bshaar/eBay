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
    
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

     
        if (!$user) {
            return response()->json(['message' => 'If the email exists, a reset link will be sent.'], 200);
        }

        // Generate reset token
        $resetToken = Str::random(60);

      
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($resetToken),
                'created_at' => Carbon::now(),
            ]
        );


        $resetUrl = url("http://localhost:5173/rest-password?token=$resetToken&email=" . urlencode($user->email));


     
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

        return response()->json(['message' => 'Password has been successfully reset.',200 ]);

    }

    public function showResetForm(Request $request)
    {
        return response()->json([
            'message' => 'Reset your password.',
            'token' => $request->query('token'),
            'email' => $request->query('email'),
        ]);
    }
}
