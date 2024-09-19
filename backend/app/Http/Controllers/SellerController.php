<?php


namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\Request;

class SellerController extends Controller
{
 
    public function getAllSellersProducts()
    {
        $sellers = Seller::with('products')->get();
        return response()->json($sellers);
    }

    public function updateProduct(Request $request, $id)
    {
  
        $product = Product::findOrFail($id);
    
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpg,png,jpeg,gif,svg|max:2048',
        ]);
    
 
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images'), $imageName);
            $validatedData['image'] = $imageName; 
        }

        $product->update($validatedData);

        return response()->json(['message' => 'Product updated successfully', 'product' => $product]);
    }
    

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
