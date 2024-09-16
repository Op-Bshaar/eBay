<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function order(){
        return $this->belongsTo(OrderRequest::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

}
