<?php


namespace App\Http\Controllers;

use App\Models\OrderRequestItem;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;



class SellerController extends Controller
{

    public function getProducts(Request $request)
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            return response()->json([]);
        }
        $products = $seller->products;
        return response()->json($products);
    }

    public function getproduct($id)
    {
        $product = Product::with('seller')->findOrFail($id);

        return response()->json($product);
    }


    public function getOrders(Request $request)
    {
        $seller = $request->user()->seller;


        if (!$seller) {
            return response()->json([]);
        }


        $productIds = $seller->products()->pluck('id');


        $orders = OrderRequestItem::whereIn('product_id', $productIds)
            ->with('product')
            ->get();

        return response()->json($orders);
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
        $seller = $user->seller;
        if (!$seller) {
            $seller = Seller::create([
                'user_id' => $user->id,
            ]);
            $seller->save();
        }
        if ($request->hasFile('image')) {

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


            if ($product->image) {
                $oldImagePath = public_path('images/' . $product->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }


            $validatedData['image'] = $imageName;
        } else {

            $validatedData['image'] = $product->image;
        }


        $product->update($validatedData);


        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }



    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function getOrderItem(Request $request, $order_id)
    {
        $seller = $request->user()->seller;
        $order = OrderRequestItem::with(['product', 'orderRequest'])->findOrFail($order_id);
        if (!$seller || $order->product->seller_id !== $seller->id) {
            return response()->json(['message' => 'unauthorized'], 401);
        }
        return response()->json(['order' => $order], 200);
    }
    public function getCurrentSeller(Request $request)
    {
        $user = $request->user();
        $seller = $user->seller;
        if (!$seller) {
            $seller = Seller::create([
                'user_id' => $user->id,
            ]);
            $seller->save();
        }
        return response()->json(['seller' => $seller], 200);
    }


    public function shipOrder(Request $request, $orderId)
    {
        $seller = $request->user()->seller;


        $order = OrderRequestItem::with('product')->findOrFail($orderId);

        // Check if the seller is authorized to ship this order
        if (!$seller || $order->product->seller_id !== $seller->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }


        $order->status = 'shipped';
        $order->save();

        return response()->json(['message' => 'Order shipped successfully', 'order' => $order], 200);
    }
}
