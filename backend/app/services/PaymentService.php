<?php

namespace App\Services;

use App\Models\OrderRequest;
use Illuminate\Support\Facades\Http;
class PaymentService
{
    private const ACTION = 'SALE';

    public OrderRequest $order_request;
    private $currency = 'SAR';   
     private $payer_ip_address;
     private $api_url;
    private $merchant_key;
    private $merchant_password;
    private $description;
    protected $payload = [];
    public function __construct()
    {   
        $this->api_url = config('services.edfapay.payment_url');
        $this->merchant_key = config('services.edfapay.key');
        $this->merchant_password = config('services.edfapay.secret');
    }
    public function setOrderRequest(OrderRequest $orderRequest)
    {
        $this->order_request=$orderRequest;
        $this->description=$orderRequest->description(1024);
    }
    private function validateHashInput(): bool
    {
        if (
            empty($this->order_request) ||
            empty($this->order_request->total_price) ||
            empty($this->currency) ||
            empty($this->description) ||
            empty($this->merchant_password)
        ) {
            return false;
        }

        return true;
    }
    private function generateHash(): string
    {
        if (! $this->validateHashInput()) {
            throw new \Exception('Hash input is not correct or not complete.');
        }

        $input = strtoupper(
            $this->order_request->id.
            $this->order_request->total_price.
            $this->currency.
            $this->description.
            $this->merchant_password
        );

        return sha1(md5($input));
    }
    private function validatePayload(): void
    {

        // Refactor and add validate rules for each value.
        foreach ($this->payload as $key => $value) {
            if ($value == '') {
                throw new \Exception('Missing payload input: '.$key);
            }
        }
    }
    public function preparePayload($payer_ip)
    {
        \Log::info('Initiating payment for order_id: ' . $this->order_request->id);
        $user = $this->order_request->user;
        $this->payload = [
            'action' => self::ACTION,
            'edfa_merchant_id' => $this->merchant_key,
            'order_id' => $this->order_request->id,
            'order_amount' => $this->order_request->total_price,
            'order_currency' => $this->currency,
            'order_description' => $this->description,
            'payer_first_name' => $user->first_name,
            'payer_last_name' => $user->last_name,
            'payer_email' => $user->email,
            'payer_phone' => $user->phone,
            'payer_ip' => $payer_ip,
            'hash' => $this->generateHash(),
            'payer_address' => $this->order_request->getAddress(),
            'payer_country' => $this->order_request->country,
            'payer_city' => $this->order_request->city,
            'payer_zip' => $this->order_request->postal_code,
            'term_url_3ds' => route('payment.3ds.callback'),
            'recurring_init' =>'N',
            'req_token' => 'N',
        ];

        $this->validatePayload();
    }

    public function generate($payer_ip): string
    {
        $this->preparePayload($payer_ip);

        $response = Http::asForm()->post($this->api_url, $this->payload);
        if ($response->failed()) {
            \Log::error('Payment API Error', [
                'response_status' => $response->status(),
                'response_body' => $response->body(),
                'payload' => $this->payload
            ]);
        }
        $response->throw(); // This will throw an exception on any failure

        $redirectUrl = $response->json('redirect_url');
        $gwayPaymentId = basename($redirectUrl);
        //$this->order_request->gway_payment_id = $gwayPaymentId;
        $this->order_request->save();
        return $redirectUrl;
    }


    public function handle3DSecureCallback(\Request $request)
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
