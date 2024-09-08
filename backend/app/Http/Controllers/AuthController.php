<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\RateLimiter;


class AuthController extends Controller
{
    //
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('Personal Access Token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'is_admin'=>$user->is_admin
        ]);
    }
    public function loginEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('Personal Access Token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
        ]);
    }
    public function loginPhone(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }


        $token = $user->createToken('Personal Access Token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
        ]);
    }
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|max:255',
            'phone' => 'required|string|unique:users,phone',
            'is_admin'=>'boolean'
        ]);

        $user = User::create([
            'phone' => $request->phone,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin'=>$request->input('is_admin', false)
        ]);

        $token = $user->createToken($user->name . 'Auth-Token')->plainTextToken;
        $emailSent = true; // Assume the email is sent successfully by default

        try {
            event(new Registered($user)); // Send verification email
        } catch (\Exception $e) {
            $emailSent = false; // Set emailSent to false if email fails to send
        }
        return response()->json([
            'message' => 'Registration successful',
            'token_type' => 'Bearer',
            'access_token' => $token,
            'user' => $user,
            'verification_email_sent' => $emailSent,
        ], 201);
    }
    public function verifyCode(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'verification_code' => 'required|digit:6',
        ]);
        $user = User::where('phone', $request->phone)->first();
        if (!$user || $user->verification_code !== $request->verification_code) {
            return response()->json(['message' => 'Invalid or expaird verfication code'], 400);
        }
        $user->is_verified = true;
        $user->verification_code  = null;
        $user->save();

        return response()->json((['message' => "Account verified sucessfully"]));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }
    public function requestVerificationEmail (Request $request) {
        // Define a unique throttle key, based on the user
        $throttleKey = 'send-verification-email-' . $request->user()->id;
        // Check if the user has a valid email address
        if (!$request->user()->email) {
            return response()->json(['error' => 'No email address found for the user.'], 400); // 400 Bad Request
        }
        // Send the email
        try {
            $request->user()->sendEmailVerificationNotification();
            
            // Apply throttling only if email was successfully sent
            RateLimiter::hit($throttleKey, 60); // 60 seconds for throttling
    
            return response()->json(['message' => 'Verification link sent!'
        
        ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send verification link. Please try again later.'], 500);
        }
    }
}
