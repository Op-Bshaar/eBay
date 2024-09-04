<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\support\Facades\Request;
use Illuminate\support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse{
       $validator= Validator::make($request->all(),
       [
        'name'=>'required|string|max:20',
        'email'=>'required|string|max:255|unique',
       'password'=>'required|string',
        'phonenum'=>'required|string'   
    ]);
    if($validator->fails())
    {
        return response()->json([$validator->errors(),422]);
    }
    $user = User::create(
        [
            'name'=> $request->name,
            'email'=> $request->email,
            'password'=> Hash::make($request->password),
            'phonenum'=> $request->phonenum,
        ]);
    $token = $user->createtoken('auth_token')->plaintexttoken;
    return response()->json(
        [
            'data'=> $user,
            'access_token'=>$token,
            'token_type'=>'bearer',
        ]);
    }
    public function login(Request $request){}
    public function logout(){}
}
