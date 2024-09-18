<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
class Order extends Model
{
    use HasFactory;

    protected $fillable=['total_price','user_id','status','country','city','district','street','postal_code'];
    public function orderItems(){
        return $this->hasMany(orderItem::class);
    }
    public function cancelOrder(string $status = 'cancelled')
    {
        // Begin a transaction
        DB::beginTransaction();

        try {
            $orderItems = $this->orderItems()->with('product')->get();

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

        } catch (\Exception $e) {
            // Rollback the transaction in case of any error
            DB::rollBack();

            // Optionally, log the error or rethrow the exception
            throw $e;
        }
    }
}
