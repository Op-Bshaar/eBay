<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderRequest extends Model
{
    use HasFactory;

    // The table associated with the model.
    protected $table = 'order_requests';

    // The attributes that are mass assignable.
    protected $fillable = [
        'user_id',
        'address',
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

    // Define any relationships if needed
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function items(){
        return $this->hasMany(OrderRequestItem::class);
    }

}