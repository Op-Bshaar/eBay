<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use DB;
class OrderRequest extends Model
{
    use HasFactory;
    // The table associated with the model.
    protected $table = 'order_requests';

    // The attributes that are mass assignable.
    protected $fillable = [
        'user_id',
        'total_price',
        'paid_amount',
        'status',
        'country',
        'city',
        'district',
        'street',
        'postal_code',
    ];

    // The attributes that should be cast to native types.
    protected $casts = [
        'total_price' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];
    public function getAddress(){ 

        $parts = array_filter([
            $this->street,
            $this->district,
            $this->city,
            $this->country,
            $this->postal_code,
        ]);
        return implode(', ', $parts);
    }
    public function description($max_length = 255){
        // Retrieve the order items with their associated products
        $items = $this->items()->with('product')->get();

        // Initialize an empty description array
        $description = [];

        // Loop through the items to build the description
        foreach ($items as $item) {
            if ($item->product) {
                $productName = $item->product->name;
                $quantity = $item->quantity;
                $description[] = "{$quantity} x {$productName}";
            }
            else{
                $productName = 'deleted product';
                $quantity = $item->quantity;
                $description[] = "{$quantity} x {$productName}";
            }
        }

        // Join the description parts with commas and return as a string
        return Str::limit(implode(', ', $description),$max_length);
    }
    public function cancelOrder(string $status = 'cancelled')
    {
        // Begin a transaction
        DB::beginTransaction();

        try {
            $orderItems = $this->items()->with('product')->get();

            // Loop through each order item and update the related product's isAvailable field to true
            foreach ($orderItems as $orderItem) {
                $product = $orderItem->product;
                if ($product) {
                    $product->update(['isAvailable' => true]);
                }
            }

            // Update the order status to "cancelled" or the given status
            $this->update(['status' => $status]);

            // Commit the transaction
            DB::commit();
            return true;
        } catch (\Exception $e) {
            // Rollback the transaction in case of any error
            DB::rollBack();
            throw $e;
        }
    }
    // Define any relationships if needed
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function items(){
        return $this->hasMany(OrderRequestItem::class);
    }

}