<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    // Display the admin dashboard
    public function dashboard()
    {
        $dashboardData = [
            'message' => 'Welcome to the admin dashboard',
            'total_users' => User::count()
        ];
        return response()->json($dashboardData);
    }


    public function index()
    {
        return response()->json([
            'users' => User::all()
        ]);
    }


    public function settings()
    {
        $mySettings = [
            'sitename' => 'EBay',
            'version' => '1.0.0'
        ];
        return response()->json($mySettings);
    }
}
