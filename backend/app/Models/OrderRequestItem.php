<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderRequestItem extends Model
{
    use HasFactory;
    // The table associated with the model.
    protected $table = 'order_request_items';
}