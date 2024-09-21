<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\Order;
use App\Mail\PaymentNotification;
use App\Services\PaymentService;
use App\Models\OrderRequest;
use Illuminate\Support\Facades\Http;
class PaymentController extends Controller
{
    
    public function getPaymentLink(Request $request, $order_id)
{
    $user = $request->user();
    
    // Fetch the OrderRequest using the URL parameter $order_id
    $orderRequest = OrderRequest::find($order_id);
    if (!$orderRequest || $orderRequest->user_id !== $user->id) {
        return response()->json(['message' => 'Order does not exist.'], 404);
    }

    if ($orderRequest->status !== 'pending') {
        return response()->json(['message' => 'Order request is not pending.'], 400);
    }

    try {
        $paymentService = new PaymentService($orderRequest);
        $paymentLink = $paymentService->generateInitiateLink($request->ip());
        $orderRequest->link_generated_at = now();
        $orderRequest->save();

        // Return the generated payment link
        return response()->json(['payment_link' => $paymentLink], 200);
    } catch (\Exception $e) {
        Log::error('Error generating payment link for order ' . $order_id . ': ' . $e->getMessage(), [
            'exception' => $e,
            'user_id' => $user->id,
            'order_id' => $order_id
        ]);
        return response()->json(['message' => 'Unable to generate payment link. Please try again.'], 500);
    }
}
    public function handle3DSecureCallback(Request $request,$order_id)
    {
        // You can handle the response here, check for success or failure
        // This is for testing purposes, so you can log or return the request data.
        
        // Log request data for debugging
        Log::info('3D-Secure Callback Data: ', $request->all());
        // Return a simple response for testing
        return response()->json([
            'message' => '3D-Secure callback received.',
            'data' => $request->all(),
        ]);
    }

}
