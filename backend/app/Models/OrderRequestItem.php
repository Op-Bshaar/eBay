<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Notifications\OrderItemPaidNotification;
use Notification;
class OrderRequestItem extends Model
{
    use HasFactory;
    // The table associated with the model.
    protected $table = 'order_request_items';
    protected $fillable = [
        'order_request_id',
        'product_id',
        'quantity',
        'status',
    ];
    public function setAsPaid($address)
{
    if ($this->status !== 'pending') {
        throw new \Exception('Order item status is not pending, cannot set as paid.');
    }

    $this->status = 'paid';
    $this->save();
    $seller = $this->product->seller; // Assuming your Product model has a 'seller' relationship
    if ($seller) {
       // Notification::send($seller, new OrderItemPaidNotification($this, $seller,$address));
    }
}
    public function order(){
        return $this->belongsTo(OrderRequest::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

}
