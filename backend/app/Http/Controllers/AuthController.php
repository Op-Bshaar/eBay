<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate(
            [
                'phone' => 'required|string',
                'email' => 'required|string',
                'password' => 'required|string'
            ]
        );
    }
}
