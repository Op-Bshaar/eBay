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
     private $initiate_url;
     private $status_url;
    private $merchant_key;
    private $merchant_password;
    private $description;
    public function __construct(OrderRequest $orderRequest)
    {   
        $this->initiate_url = config('services.edfapay.payment_url');
        $this->status_url = config('services.edfapay.status_url');
        $this->merchant_key = config('services.edfapay.key');
        $this->merchant_password = config('services.edfapay.secret');
        $this->order_request=$orderRequest;
        $this->description=$orderRequest->description(1024);
    }
    private function validateInitiateHashInput(): bool
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
    private function generateInitiateHash(): string
    {
        if (! $this->validateInitiateHashInput()) {
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
    private function validateStatusHashInput(): bool
    {
        if (
            empty($this->order_request) ||
            empty($this->order_request->gateway_payment_id) ||
            empty($this->order_request->total_price) ||
            empty($this->merchant_password)
        ) {
            return false;
        }

        return true;
    }
    private function generateStatusHash(): string
    {
        if (! $this->validateStatusHashInput()) {
            throw new \Exception('Hash input is not correct or not complete.');
        }

        $input = strtoupper(
            $this->order_request->gateway_payment_id.
            $this->order_request->total_price.
            $this->merchant_password
        );

        return sha1(md5($input));
    }
    private function validatePayload($payload): void
    {

        // Refactor and add validate rules for each value.
        foreach ($payload as $key => $value) {
            if ($value == '') {
                throw new \Exception('Missing payload input: '.$key);
            }
        }
    }
    private function getInitiatePayLoad($payer_ip)
    {
        \Log::info('Initiating payment for order_id: ' . $this->order_request->id);
        $user = $this->order_request->user;
        $payload = [
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
            'hash' => $this->generateInitiateHash(),
            'payer_address' => $this->order_request->getAddress(),
            'payer_country' => $this->order_request->country,
            'payer_city' => $this->order_request->city,
            'payer_zip' => $this->order_request->postal_code,
            'term_url_3ds' => route('payment.3ds.callback', ['order_id' => $this->order_request->id]),
            'recurring_init' =>'N',
            'req_token' => 'N',
        ];
        
        $this->validatePayload($payload);
        return $payload;
    }
    private function getStatusPayLoad()
    {
        $payload = [
            'merchant_id' => $this->merchant_key,
            'order_id' => $this->order_request->id,
            'gway_Payment_Id' => $this->order_request->gateway_payment_id,
            'hash' => $this->generateStatusHash(),
        ];

        $this->validatePayload($payload);
        return $payload;
    }
    public function getPaymentStatus(){
        $payload = $this->getStatusPayLoad();
        $response = Http::post($this->status_url, $payload);

        if ($response->failed()) {
            \Log::error('Failed to get payment status', [
                'response_status' => $response->status(),
                'response_body' => $response->body(),
                'payload' => $payload
            ]);
            throw new \Exception('Unable to get payment status from the gateway.');
        }

        $statusData = $response->json();
        \Log::info('Payment status response', ['statusData' => $statusData]);

        if ($statusData['status'] === 'settled') {
            $this->order_request->status = 'paid';
        } else {
            $this->order_request->status = 'failed';
        }

        $this->order_request->save();

        return $statusData;
    }
    public function generateInitiateLink($payer_ip): string
    {
        $this->getInitiatePayLoad($payer_ip);
        $payload = $this->getInitiatePayLoad($payer_ip);
        $response = Http::asForm()->post($this->initiate_url, $payload);
        if ($response->failed()) {
            \Log::error('Payment API Error', [
                'response_status' => $response->status(),
                'response_body' => $response->body(),
                'payload' => $payload
            ]);
        }
        $response->throw(); // This will throw an exception on any failure

        $redirectUrl = $response->json('redirect_url');
        $gwayPaymentId = basename($redirectUrl);
        $this->order_request->link_generated_at = now();
        $this->order_request->save();
        \Log::info('Payment API Initiation Response', [
        'response_body' => $response->json(),
        'response_headers' => $response->headers(),
        ]);
        return $redirectUrl;
    }
}
