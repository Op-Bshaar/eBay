<?php

namespace App\Http\Controllers;

use App\Models\OrderRequest;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
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
    public function orders(){
        return response()->json([
            'orderes' => OrderRequest::all()
        ]);
    }
    public function ProductAmount()
    {
        $ProductAmount =DB::table("products")
        ->select("title", DB::raw("COUNT(*) as appearances"))
        ->groupBy("title")
        ->get();
        return response()->json($ProductAmount);
    }
    public function getCategoryAppearances() {
        $categories = DB::table('products')
            ->select('category_id', DB::raw('COUNT(category_id) as appearances'))
            ->groupBy('category_id')
            ->get();
    
        return response()->json($categories);
    }
    public function UploadsThisWeek() {
        $oneWeekAgo = Carbon::now()->subDays(7);
    
        $products = DB::table('products')
            ->select('title', DB::raw('COUNT(id) as uploads'))
            ->where('created_at', '>=', $oneWeekAgo)
            ->groupBy('title')
            ->get();
    
        return response()->json($products);
    }
    public function products(){
        return response()->json([
            'product' => Product::all()
        ]); 
    }
}
