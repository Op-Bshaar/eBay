<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\OrderRequestItem;
use App\Models\OrderRequest;
use App\Models\Cart;
use DB;

class OrderRequestController extends Controller
{
    public function placeOrder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'address.country' => 'required|string|max:100',
            'address.city' => 'required|string|max:100',
            'address.district' => 'required|string|max:100',
            'address.street' => 'required|string|max:255',
            'address.postal_code' => 'required|string|max:20',
        ]);
        $productIds = array_column($validated['items'], 'product_id');
        $products = Product::whereIn('id', $productIds)->get();
        // Ensure all products are available
        foreach ($products as $product) {
            if (!$product->isAvailable) {
                return response()->json(['message' => "Product {$product->name} is not available"], 400);
            }
        }
        $totalPrice = 0;
        foreach ($validated['items'] as $item) {
            $product = $products->firstWhere('id', $item['product_id']);
            $totalPrice += $product->price * $item['quantity'];
        }
        // Start a transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Create new OrderRequest
            $orderRequest = OrderRequest::create([
                'total_price' => $totalPrice,
                'user_id' => auth()->id(),
                'status' => 'pending',
                'country' => $validated['address']['country'],
                'city' => $validated['address']['city'],
                'district' => $validated['address']['district'],
                'street' => $validated['address']['street'],
                'postal_code' => $validated['address']['postal_code'],
            ]);

            // Create OrderRequestItem for each item
            foreach ($validated['items'] as $item) {
                OrderRequestItem::create([
                    'order_request_id' => $orderRequest->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);

                // Set product availability to false
                $product = $products->firstWhere('id', $item['product_id']);
                $product->isAvailable = false;
                $product->save();
            }
            $user = auth()->user();
            $cart = Cart::where('user_id', $user->id)->first();

            if ($cart) {
                $cart->updateOrCreateCartItems([]); // Clear the cart if it exists
                $cart->delete();
            }
            // Commit the transaction
            DB::commit();

            // Return the order ID
            return response()->json(['order_id' => $orderRequest->id], 201);
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            return response()->json(['message' => 'Order placement failed'], 500);
        }
    }
    public function getOrder($order_id)
    {
        // Get the authenticated user
        $user = Auth::user();

        // Find the order by ID and ensure it belongs to the authenticated user
        $order = OrderRequest::where('id', $order_id)
            ->where('user_id', $user->id)
            ->with('items.product')
            ->first();

        // If order is not found, return a 404 response
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Return the order details as JSON
        return response()->json($order, 200);
    }

    
    // Method to retrieve all orders for the authenticated user
    public function getOrders()
    {
        // Get the authenticated user
        $user = Auth::user();

        // Retrieve all orders for the user and load the items and associated products
        $orders = OrderRequest::where('user_id', $user->id)
            ->with('items.product') 
            ->get();

        // If no orders found, return an empty array
        if ($orders->isEmpty()) {
            return response()->json([], 200);
        }

        // Return the list of orders as JSON
        return response()->json($orders, 200);
    }
    public function cancel(Request $request, $order_id)
    {
        $user = $request->user();
        $order = OrderRequest::where('id', $order_id)
            ->where('user_id', $user->id)
            ->with('items.product') // Optionally load related items and products
            ->first();
        if($order)
        {
            if($order->status === 'pending')
            {
                $order->cancelOrder();
                return response()->json(['message' => 'Order cancelled successfully.'],200);
            }
            else{
                return response()->json(['message' => 'Order is not pending, cannot cancel.'],400);
            }
        }
        return response()->json(['message' => 'Order not found.'],404);
    }
}
