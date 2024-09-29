<?php

namespace App\Http\Controllers;

use App\Models\OrderRequest;
use App\Models\OrderRequestItem;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;

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
    public function orders()
    {
        return response()->json([
            'orderes' => OrderRequest::all()
        ]);
    }
    public function ProductAmount()
    {
        $ProductAmount = DB::table("products")
            ->select("title", DB::raw("COUNT(*) as appearances"))
            ->groupBy("title")
            ->get();
        return response()->json($ProductAmount);
    }
    public function getCategoryAppearances()
    {
        $categories = DB::table('products')
            ->select('category_id', DB::raw('COUNT(category_id) as appearances'))
            ->groupBy('category_id')
            ->get();

        return response()->json($categories);
    }
    public function UploadsThisWeek()
    {
        $oneWeekAgo = Carbon::now()->subDays(7);

        $products = DB::table('products')
            ->select('title', DB::raw('COUNT(id) as uploads'))
            ->where('created_at', '>=', $oneWeekAgo)
            ->groupBy('title')
            ->get();

        return response()->json($products);
    }
    public function products()
    {
        return response()->json([
            'product' => Product::all()
        ]);
    }

    public function updateAvailability($id, Request $request)
    {

        $request->validate([
            'isAvailable' => 'required|boolean',
        ]);


        $product = Product::find($id);


        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }


        $product->isAvailable = $request->input('isAvailable');
        $product->save();

        return response()->json(['message' => 'Product availability updated successfully']);
    }

    public function show($id)
    {
        $order = OrderRequestItem::find($id); 
        if ($order) {
            return response()->json(['order' => $order]);
        } else {
            return response()->json(['message' => 'Order not found'], 404);
        }
    }

    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:256',
        ]);

        if($request->hasFile('icon')){
        
            $image = $request->file('icon');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
      
            $image->move(public_path('icons'), $imageName);
    
       
            $category = Category::create([
                'name' => $request->name,
                'icon' => $imageName, 
            ]);
    

            return response()->json($category, 201);
        } else {
   
            return response()->json(['error' => 'Image upload failed'], 400);
        }
    }
}
