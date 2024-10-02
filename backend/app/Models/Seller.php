<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Seller extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = ['rating', 'user_id', 'bank_name', 'bank_recepient_name', 'bank_account_number', 'iban'];

    public function setRatingAttribute($value)
    {
        $this->attributes['rating'] = max(1, min(5, $value));
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'seller_id');
    }
    public function routeNotificationForMail()
    {
        return $this->user->email; 
    }

    public function averageRating()
    {
        $productIds = $this->products()->pluck('id');
        return OrderRequestItem::whereIn('id',$productIds)->whereNotNull('review')->avg('review');
    }
}
