<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Mail;
use App\Jobs\SendVerificationEmail;
use Illuminate\Support\Facades\Redirect;
use Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;


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
            'is_admin' => $user->is_admin
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|max:255',
            'phone' => 'required|string|unique:users,phone',
        ]);

        $user = User::create([
            'phone' => $request->phone,
            'username' => $request->username,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => false,
        ]);

        $token = $user->createToken($user->name . 'Auth-Token')->plainTextToken;

        try {
            SendVerificationEmail::dispatch($user);
        } catch (\Exception $e) {
            Log::error("Failed to dispatch email verification job for user: {$user->id}", ['error' => $e->getMessage()]);
        }
        return response()->json([
            'message' => 'Registration successful',
            'token_type' => 'Bearer',
            'access_token' => $token,
            'user' => $user,
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
    public function updateEmail(Request $request)
    {
        // Validate the email input
        $request->validate([
            'email' => 'required|email|unique:users,email',
        ]);
        // Get the currently authenticated user
        $user =  $request->user();
        $user->email = $request->input('email');
        $user->email_verified_at = null; // Reset email verification status
        $user->save();
        return response()->json([
            'message' => 'Email updated successfully.',
            'user' => $user,
        ], 200);
    }

    public function requestVerificationEmail(Request $request)
    {
        if ($request->user()->email_verified_at) {
            return response()->json([
                'is_verified' => true,
                'message' => 'Email already verified.',
            ], 200);
        }
        // Define a unique throttle key, based on the user
        $throttleKey = 'send-verification-email-' . $request->user()->id;
        // Check if the user has a valid email address
        if (!$request->user()->email) {
            return response()->json(['error' => 'No email address found for the user.'], 400); // 400 Bad Request
        }
        // Check if the request is throttled
        if (RateLimiter::tooManyAttempts($throttleKey, 1)) {
            return response()->json(['error' => 'Too many requests. Please try again later.'], 429); // 429 Too Many Requests
        }
        // Send the email
        try {
            $request->user()->sendEmailVerificationNotification();
            // Apply throttling only if email was successfully sent
            RateLimiter::hit($throttleKey, 60); // 60 seconds for throttling
            return response()->json([
                'is_verified' => false,
                'message' => 'Verification link sent!'

            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send verification link. Please try again later.', 'e' => $e->getMessage()], 500);
        }
    }

    public function getProfile()
    {
        $user = Auth::user();


        return response()->json(['user' => $user], 200);
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone',
            'password' => 'nullable|string|min:8|confirmed',
            'current_password' => 'required_with:password|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    

        $user = User::find(Auth::id());
    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
   
        $user->first_name = $request->first_name;
        
        $user->last_name = $request->last_name;
        $user->phone = $request->phone;

    
   
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
    

        if (!$user->save()) {
            return response()->json(['message' => 'Failed to update profile'], 500);
        }
    
        return response()->json(['message' => 'Profile updated successfully', 'user' => $user], 200);
    }
    
    // public function updateEmaill(Request $request)
    // // {
    // //     $validator = Validator::make($request->all(), [
    // //         'email' => 'required|email|unique:users,email,' . Auth::id(),
    // //     ]);
    
    // //     if ($validator->fails()) {
    // //         return response()->json(['errors' => $validator->errors()], 422);
    // //     }
    

    // //     $user = User::find(Auth::id());
    
    // //     if (!$user) {
    // //         return response()->json(['message' => 'User not found'], 404);
    // //     }
    
   
    // //     $user->email = $request->email;
    
      
    // //     if (!$user->save()) {
    // //         return response()->json(['message' => 'Failed to update email'], 500);
    // //     }
    
    // //     return response()->json(['message' => 'Email updated successfully', 'email' => $user->email], 200);}

}
