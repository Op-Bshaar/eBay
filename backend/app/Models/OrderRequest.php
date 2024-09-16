<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
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
        $address = "{$this->street}, {$this->district}, {$this->city}, {$this->country}, {$this->postal_code}";
        return $address;
    }
    public function description($max_length = 255){
        // Retrieve the order items with their associated products
        $items = $this->items()->with('product')->get();

        // Initialize an empty description array
        $description = [];

        // Loop through the items to build the description
        foreach ($items as $item) {
            $productName = $item->product->name;
            $quantity = $item->quantity;
            $description[] = "{$quantity} x {$productName}";
        }

        // Join the description parts with commas and return as a string
        return Str::limit(implode(', ', $description),$max_length);
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