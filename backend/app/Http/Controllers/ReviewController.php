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
            'seller_id' => 'required|exists:sellers,id',
        ]);

        $orderRequestItem = OrderRequestItem::findOrFail($id);

        $orderRequestItem->seller_id = $validated['seller_id'];
        $orderRequestItem->review = $validated['review'];
        $orderRequestItem->save();

        return response()->json(['message' => 'Review added successfully', 'orderRequestItem' => $orderRequestItem], 200);

        return response()->json([
            'review' => $request->input('review'),
        ], 201);
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
            'seller_id' => $seller->id,
            'average_rating' => number_format($averageRating, 2),
        ], 200);
    }
}
