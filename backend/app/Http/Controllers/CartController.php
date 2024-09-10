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
            'cart' => 'required|array',
            'cart.*.product_id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1'
        ]);

        // Get the authenticated user's cart
        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Retrieve the current cart items from the database
        $existingCartItems = $cart->cartItems->keyBy('product_id'); // Map items by product_id for easy lookup

        // Loop through the products sent by the user in the request
        foreach ($data['cart'] as $item) {
            $productId = $item['product_id'];
            $quantity = $item['quantity'];

            // Check if the product is already in the cart
            if ($existingCartItems->has($productId)) {
                // Update the quantity if it already exists
                $existingCartItems[$productId]->update(['quantity' => $quantity]);
            } else {
                // Add a new product to the cart if it's not present
                $cart->cartItems()->create([
                    'product_id' => $productId,
                    'quantity' => $quantity
                ]);
            }

            // Remove the product from the collection since it's processed
            $existingCartItems->forget($productId);
        }

        // Any remaining items in $existingCartItems are not present in the request,
        // so we remove them from the cart (deleting them from cart_items table).
        foreach ($existingCartItems as $cartItem) {
            $cartItem->delete();
        }
         // Reload the cartItems relationship to get the updated cart
        $cart->load('cartItems.product');
         // Hide unwanted fields in both cartItems and products
         $cartItems = $cart->cartItems->map(function ($cartItem) {
            // Hide 'product_id', 'created_at', 'updated_at' for cart item
             $cartItem->makeHidden(['id','cart_id','product_id', 'created_at', 'updated_at']);
             // Hide 'created_at', 'updated_at' for product
             $cartItem->product->makeHidden(['created_at', 'updated_at']);

        return $cartItem;
        });
        return response()->json([
            'cart' => $cart->cartItems, // Return updated cart items
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
        
         // Hide unwanted fields in both cartItems and products
         $cartItems = $cart->cartItems->map(function ($cartItem) {
            // Hide 'product_id', 'created_at', 'updated_at' for cart item
             $cartItem->makeHidden(['id','cart_id','product_id', 'created_at', 'updated_at']);
             // Hide 'created_at', 'updated_at' for product
             $cartItem->product->makeHidden(['created_at', 'updated_at']);

        return $cartItem;
        });
        return response()->json([
            'cart' => $cartItems, // return the cart items
            'message' => 'Cart retrieved successfully.'
        ], 200);
    }
}