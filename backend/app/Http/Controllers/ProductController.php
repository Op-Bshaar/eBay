<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Middleware\Middleware;


class ProductController extends Controller
{
    public function index()
    {
        $products = Product::get();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json($product);
    }

    public function store(Request $request)
    {
    
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'price' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
  
        if($request->hasFile('image')){
        
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
      
            $image->move(public_path('images'), $imageName);
    
       
            $product = Product::create([
                'title' => $request->title,
                'description' => $request->description,
                'price' => $request->price,
                'image' => $imageName, 
                'seller_id' => Auth::id(),
            ]);
    

            return response()->json($product, 201);
        } else {
   
            return response()->json(['error' => 'Image upload failed'], 400);
        }
    }
    
    

    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        if ($product->seller_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'price' => 'required|string',
            'image' => 'string',
        ]);

        $product->update($request->only('title', 'description', 'price', 'image'));

        return response()->json($product, 200);
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        if ($product->seller_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        $products = Product::where('title', 'LIKE', "%".$query."%")->get();
        return response()->json($products);
    }
}


