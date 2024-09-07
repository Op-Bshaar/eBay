<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

class AdminController extends Controller
{
    // 
    public function dashborad()
    {
        return response()->json([
            'message' => 'Welcome to the admin dashboard'
        ]);
    }

    public function index()
    {
        return response()->json([
            'users' => User::all()
        ]);
    }
}
