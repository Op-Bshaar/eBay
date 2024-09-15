<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $status;

    /**
     * Create a new message instance.
     *
     * @param  $order
     * @param  $status
     * @return void
     */
    public function __construct($order, $status)
    {
        $this->order = $order;
        $this->status = $status;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $html = "<p>Hi,</p><p>The payment status has been updated.</p><p>Order ID: {$this->order->id}</p><p>Status: {$this->status}</p><p>Thank you.</p>";
        
        return $this->subject('Payment Status Update')
                    ->html($html);
    }
    
}
