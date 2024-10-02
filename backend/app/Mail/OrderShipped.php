<?php

namespace App\Mail;

use App\Models\OrderRequestItem;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderShipped extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $buyer_first_name;
    public $buyer_last_name;
    public $seller;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(OrderRequestItem $order)
    {
        $this->order = $order;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->seller = $this->order->product->seller;
        $this->buyer_first_name = $this->order->orderRequest->first_name;
        $this->buyer_last_name = $this->order->orderRequest->last_name;
        return $this->subject('تم إرسال طلبك إلى الشحن')
                    ->view('emails.order_shipped');
    }
}
