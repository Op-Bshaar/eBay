<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, $productId)
    {


        $request->validate([
            'product_id' => 'required|exists:products,id', 
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = new Review([
            'user_id' => Auth::id(),
            'product_id' => $productId, 
            'rating' => $request->input('rating'),
            'comment' => $request->input('comment'),
        ]);

        $review->save();

        return response()->json([
            'product_id' => $productId,
           'rating' => $request->input('rating'),
            'comment' => $request->input('comment'),
        ],201); 
    }
}
