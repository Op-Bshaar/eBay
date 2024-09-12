<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'description', 'price', 'image', 'seller_id'];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    /**
     * Get the full URL for the image.
     *
     * @return string
     */
    public function getImageAttribute($value)
    {
        if (empty($value)) {
             return ''; // Return empty string if value is empty
        }

         return url('images/' . $value);
    }
}
