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
        'phone',
        'first_name',
        'last_name',
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
        DB::beginTransaction();
    
        try {
            $productIds = $this->items()->pluck('product_id');
            $this->items()->update(['status' => $status]);
            Product::whereIn('id', $productIds)->update(['isAvailable' => true]);
            $this->update(['status' => $status]);
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    public function cancelIfOverdue(int $timeLimitInMinutes)
    {
        $referenceTime = $this->link_generated_at ?? $this->created_at;
        // Check if the order status is pending and the creation time exceeds the limit
        if ($this->status === 'pending' && $referenceTime->diffInMinutes(now()) > $timeLimitInMinutes) {
            $this->cancelOrder('timeout');
        }
    }
    public function setAsPaid($gateway_payment_id)
{
    if (empty($gateway_payment_id)) {
        throw new \InvalidArgumentException('Payment ID cannot be empty.');
    }
    DB::transaction(function () use ($gateway_payment_id) {
        if ($this->status !== 'pending') {
            throw new \Exception('Order status is not pending, cannot set as paid.');
        }

        $this->status = 'paid';
        $this->gateway_payment_id = $gateway_payment_id;
        $this->paid_amount = $this->total_price;

        foreach ($this->items as $item) {
            $item->setAsPaid($this->getAddress());
        }

        $this->save();
    });
}
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function items(){
        return $this->hasMany(OrderRequestItem::class);
    }
    protected function casts(): array
    {
        return [
            'link_generated_at' => 'datetime',
        ];
    }
}