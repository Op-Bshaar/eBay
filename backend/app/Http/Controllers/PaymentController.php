<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\Order;
use App\Mail\PaymentNotification;

class PaymentController extends Controller
{
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
}
