<?php


namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;



class SellerController extends Controller
{
 
    public function getAllSellersProducts()
    {
        $sellers = Seller::with('products')->get();
        return response()->json($sellers);
    }

    public function addProducts(Request $request)
    {
    
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'price' => 'required|numeric',
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        
        $user = $request->user();
        $seller =$user->seller;
        if(!$seller)
        {
            $seller = Seller::create([
                'user_id'=> $user->id,
            ]);
            $seller->save();
        }
        if($request->hasFile('image')){
        
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
      
            $image->move(public_path('images'), $imageName);
    
       
            $product = Product::create([
                'title' => $request->title,
                'description' => $request->description,
                'price' => $request->price,
                'image' => $imageName, 
                'seller_id' => $seller->id,
            ]);
    

            return response()->json($product, 201);
        } else {
   
            return response()->json(['error' => 'Image upload failed'], 400);
        }


    }

    public function updateProduct(Request $request, $id)
    {
        if ($request->hasFile('image')) {
            Log::info('Image file:', [$request->file('image')]);
        } else {
            Log::info('No image file uploaded');
        }
        $product = Product::findOrFail($id);
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',

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
