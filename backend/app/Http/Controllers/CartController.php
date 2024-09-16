<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{

    public function updateCart(Request $request)
    {
        // Validate the request to ensure we get an array of products with product_id and quantity
        $data = $request->validate([
            'cart' => 'array',
            'cart.*.product_id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1'
        ]);

        // Get the authenticated user's cart
        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cart->updateOrCreateCartItems($data['cart']);
        $cartItems = $cart->cartItems()->with('product')->get();
        return response()->json([
            'cart' => $cartItems, // Return updated cart items
            'message' => 'Cart updated successfully.',
        ]);
    }
    public function getCart()
    {
        // Get the authenticated user's cart
        $user = Auth::user();
        $cart = Cart::with('cartItems.product')->where('user_id', $user->id)->first();

        // Check if the cart exists, if not return an empty cart
        if (!$cart) {
            return response()->json([
                'cart' => [],
                'message' => 'Cart is empty.'
            ], 200);
        }
        return response()->json([
            'cart' => $cart->cartItems, // return the cart items
            'message' => 'Cart retrieved successfully.'
        ], 200);
    }
}