<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Middleware\Middleware;


class ProductController extends Controller
{
    public function index()
    {
        $products = Products::get();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Products::find($id);
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
            'image' => 'nullable|string',
        ]);

        $product = Products::create([
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'image' => $request->image,
            'seller_id' => Auth::id(),
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Products::find($id);

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
            'image' => 'nullable|string',
        ]);

        $product->update($request->only('title', 'description', 'price', 'image'));

        return response()->json($product, 200);
    }

    public function destroy($id)
    {
        $product = Products::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        if ($product->seller_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}
