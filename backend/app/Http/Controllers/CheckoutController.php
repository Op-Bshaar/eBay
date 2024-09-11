<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function index()
    {
        $cartItems = CartItem::with('product')->whereHas('cart', function($query) {
            $query->where('user_id', Auth::id());
        })->get();


        $totalPrice = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        return response()->json([
            'cart_items' => $cartItems,
            'total_price' => $totalPrice
        ]);
    }

    public function Checkoutprocess(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string',
        ]);


        $cartItems = CartItem::with('product')->whereHas('cart', function($query) {
            $query->where('user_id', Auth::id());
        })->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

    
        $totalPrice = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

   
        $order = Order::create([
            'user_id' => Auth::id(),
            'total_price' => $totalPrice,
            'payment_method' => $request->input('payment_method'),
            'status' => 'pending'
        ]);


        foreach ($cartItems as $item) {
            $order->orderItems()->create([
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price
            ]);
        }

 
        CartItem::whereHas('cart', function($query) {
            $query->where('user_id', Auth::id());
        })->delete();

        return response()->json([
            'message' => 'Order placed successfully',
            'order_id' => $order->id,
        ], 201);
    }
}
