<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function index()
    {
        $cartitems = Cart::with('product')->where('user_id', Auth::id())->get();
        $totalPrice = $cartitems->sum(function ($cartitems) {
            return $cartitems->product->price * $cartitems->quantity;
        });
        return response()->json([
            'cart_items' => $cartitems,
            'total_price' => $totalPrice
        ]);
    }

    public function Checkoutprocess(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string',
        ]);
    
        $cartitems = Cart::with('product')->where('user_id', Auth::id())->get();
    
        if ($cartitems->count() == 0) {
            return response()->json(['message' => 'cart is empty'], 400);
        }
    
        $totalPrice = $cartitems->sum(function ($cartitems) {
            return $cartitems->product->price * $cartitems->quantity;
        });
    
        $order = Order::create([
            'user_id' => Auth::id(),
            'total_price' => $totalPrice,
            'payment_method' => $request->input('payment_method'), 
            'status' => 'pending'
        ]);
    
        foreach ($cartitems as $item) {
            $order->orderItems()->create([
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price
            ]);
        }
    
        Cart::where('user_id', Auth::id())->delete();
    
        return response()->json([
            'message' => 'order placed successfully',
            'order_id' => $order->id,
        ], 201);
    }
    
}
