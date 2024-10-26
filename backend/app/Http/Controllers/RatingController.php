<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Seller;
use App\Models\OrderRequestItem;

class RatingController extends Controller
{
    public function store(Request $request, $orderId)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);
        $order= OrderRequestItem::findOrFail($orderId);
        $order->review = $validated['rating'];
        $order->save();
        $responseData = [
            'message' => 'Review added successfully',
        ];
    
        return response()->json($responseData, 200);
    }
    
    public function getSellerAverageRating($seller_id)
    {

        $seller = Seller::findOrFail($seller_id);
        

        if (!$seller) {
            return response()->json(['error' => 'User is not a seller'], 404);
        }

        $averageRating = $seller->averageRating();
        if(!$averageRating){
            return response()->json([
                'rating' => null,
            ], 200);
        }
        return response()->json([
            'rating' => number_format($averageRating, 2),
        ], 200);
    }
}
