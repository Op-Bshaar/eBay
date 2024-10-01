<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\OrderRequestItem;

class ReviewController extends Controller
{
    public function store(Request $request, $id)
    {

        $validated = $request->validate([
            'review' => 'required|integer|min:1|max:5',
        ]);
    
 
        $orderRequestItem = OrderRequestItem::with('product')->findOrFail($id);
        $orderRequestItem->review = $validated['review'];
        $orderRequestItem->save();
    
  
        $responseData = [
            'message' => 'Review added successfully',
            'orderRequestItem' => $orderRequestItem,
            'product' => $orderRequestItem->product, 
        ];
    
        return response()->json($responseData, 200);
    }
    

    public function getSellerAverageRating($user_id)
    {
        $user = User::findOrFail($user_id);

        $seller = $user->seller;
        

        if (!$seller) {
            return response()->json(['error' => 'User is not a seller'], 404);
        }

        $averageRating = $seller->averageRating();

        return response()->json([
            'average_rating' => number_format($averageRating, 2),
        ], 200);
    }
}
