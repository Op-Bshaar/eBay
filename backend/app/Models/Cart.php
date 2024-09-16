<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id'];
    public function updateOrCreateCartItems(array $items)
    {
        if (empty($items)) {
            $this->cartItems()->delete();
        }
        else
        {

        
        // Retrieve the current cart items from the database
        $existingCartItems = $this->cartItems->keyBy('product_id');
    
        // Loop through the products sent by the user
        foreach ($items as $item) {
            $productId = $item['product_id'];
            $quantity = $item['quantity'];
    
            // Update if exists or create a new item
            if ($existingCartItems->has($productId)) {
                $existingCartItems[$productId]->update(['quantity' => $quantity]);
            } else {
                $this->cartItems()->create([
                    'product_id' => $productId,
                    'quantity' => $quantity
                ]);
            }
    
            // Remove the product from the collection since it's processed
            $existingCartItems->forget($productId);
        }
    
        // Delete any items not in the current update request
        foreach ($existingCartItems as $cartItem) {
            $cartItem->delete();
        }
    
        $this->refresh();
     } // Refresh to get the latest data
    }
    
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class); // Assuming you have a CartItem model
    }
}