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
    private function checkOrderStatus($order_id){
        $orderRequest = OrderRequest::findOrFail($order_id);
        if(!$orderRequest->gateway_payment_id)
        {
            return ['status' =>$orderRequest->status];
        }
        $paymentService = new PaymentService($orderRequest);
        return $paymentService->getPaymentStatus();
    }
    public function getOrderStatus(Request $request){
        $status_url = env('EDFA_PAY_API_STATUS_URL');
        $merchant_key = env('EDFA_PAY_API_KEY');
        $merchant_password = env('EDFA_PAY_API_SECRET');
        $input = strtoupper(
            $request->gway_id.
            $request->order_id.
            $merchant_password
        );
        $hash =sha1(md5($input));
        $payload = [
            'merchant_id' => $merchant_key,
            'order_id' => $request->order_id,
            'gway_Payment_Id' => $request->gway_id,
            'hash' => $hash,
        ];
        
        $request = Http::post($status_url, $payload);
        return $request->json();
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
