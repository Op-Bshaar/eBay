<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\Order;
use App\Mail\PaymentNotification;
use App\Services\PaymentService;
use App\Models\OrderRequest;

class PaymentController extends Controller
{
    
    public function getPaymentLink(Request $request,$order_id)
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
        $paymentService = new PaymentService();
        $paymentService->setOrderRequest($orderRequest);
        try {
            $paymentLink = $paymentService->generate($request->ip());
    
            // Return the payment link in the response
            return response()->json(['payment_link' => $paymentLink], 200);
    
        } catch (\Exception $e) {
            // Log and return an error if the payment link generation fails
            \Log::error('Payment link generation failed: ' . $e->getMessage());
    
            return response()->json(['message' => 'Unable to generate payment link. Please try again.'], 500);
        }

    }
    public function handleNotification(Request $request)
    {
        Log::info('Payment notification received:', $request->all());

        $validatedData = $request->validate([
            'id' => 'required|string',
            'status' => 'required|string',
        ]);

        $id = $validatedData['id'];
        $status = $validatedData['status'];

        $order = Order::where('id', $id)->first();
        if ($order) {
            $order->status = $status;
            $order->save();
            
            // Send an email notification
            Mail::to('your_contact_email@example.com')
                ->send(new PaymentNotification($order, $status));
        }

        return response()->json(['message' => 'Payment notification handled successfully'], 200);
    }
    public function handle3DSecureCallback(Request $request)
    {
        // You can handle the response here, check for success or failure
        // This is for testing purposes, so you can log or return the request data.
        
        // Log request data for debugging
        \Log::info('3D-Secure Callback Data: ', $request->all());

        // Return a simple response for testing
        return response()->json([
            'message' => '3D-Secure callback received.',
            'data' => $request->all(),
        ]);
    }

}
