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
use Validator;
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
public function handle3DSecureCallback(Request $request, $order_id)
{
    // Log incoming callback data for debugging purposes
    Log::info('3D-Secure Callback Data: ', $request->all());

    $validator = Validator::make($request->all(), [
        'action' => 'required|string',
        'result' => 'required|string',
        'order_id' => 'required|string',
        'trans_id' => 'required|string',
        'amount' => 'required|numeric',
        'currency' => 'required|string',
        'hash' => 'required|string',
    ]);

    // If validation fails, handle failure instead of returning an error response
    if ($validator->fails()) {
        // You can log the failure or handle it as needed
        return $this->handleFailure($order_id, $validator->errors()->toArray());
    }

    // Extract validated data after passing validation
    $validatedData = $validator->validated();
    // Check if the callback hash is valid (for security)
    if (!$this->isValidHash($validatedData)) {
        return response()->json(['message' => 'Invalid hash signature'], 403);
    }

    if($validatedData['action'] === 'SALE')
    {
        if ($validatedData['result'] === 'SUCCESS') {
            // Handle successful sale, update order status, etc.
            return $this->handleSuccessfulSale($validatedData['order_id'], $validatedData);
        } elseif ($validatedData['result'] === 'DECLINED') {
            // Handle declined sale, log reason, notify user, etc.
            return $this->handleDeclinedSale($validatedData['order_id'], $validatedData);
        } elseif ($validatedData['result'] === 'REDIRECT' && $validatedData['status'] === '3DS') {
            // Handle 3D-Secure redirection
            if ($validatedData['redirect_method'] === 'POST') {
                // For POST method, use a form to redirect with the parameters
                return response()->view('redirect-form', [
                    'redirect_url' => $validatedData['redirect_url'],
                    'redirect_params' => $validatedData['redirect_params'] ?? [],
                ]);
            } elseif ($validatedData['redirect_method'] === 'GET') {
                // For GET method, perform a simple redirect with the parameters
                return redirect()->away($validatedData['redirect_url']);
            }
        }
    }
}

// Example method to validate the hash
protected function isValidHash(array $data)
{
    // Construct the hash string using the payment public ID and merchant pass
    $hashString =  $data['trans_id'] . $data['order_id'] . $data['amount'] . $data['currency'] . config('services.edfapay.key');
    
    // Generate the hash using SHA1 or MD5
    $expectedHash = strtoupper(sha1(md5($hashString)));

    return $expectedHash === $data['hash'];
}

// Handle successful sale
protected function handleSuccessfulSale($order_id, array $data)
{
    // Update order status, log information, notify user, etc.
    Log::info("Sale successful for order $order_id", $data);
    $order = OrderRequest::findOrFail($order_id);
    $order->setAsPaid();
}
protected function handleFailure($order_id, array $errors)
{
    Log::warning("Sale failed for order $order_id", $errors);
    $order = OrderRequest::findOrFail($order_id);
    $order->cancelOrder('failed');
}

// Handle declined sale
protected function handleDeclinedSale($order_id, array $data)
{
    Log::warning("Sale declined for order $order_id", $data);
    $order = OrderRequest::findOrFail($order_id);
    $order->cancelOrder('declined');
}

}
