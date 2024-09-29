<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'icon'];

    public function products()
    {
       
        return $this->hasMany(Product::class);
    }
    public function getIconAttribute($value)
    {
        if (empty($value)) {
             return ''; // Return empty string if value is empty
        }

         return url('icons/' . $value);
    }
}
