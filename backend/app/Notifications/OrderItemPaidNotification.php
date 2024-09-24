<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class OrderItemPaidNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $orderItem;
    protected $seller;
    protected $address;
    public function __construct($orderItem, $seller,$address)
    {
        $this->orderItem = $orderItem;
        $this->seller = $seller;
        $this->address = $address;
    }

    public function via($notifiable)
    {
        return ['mail']; 
    }

    public function toMail($notifiable)
    {
        $user = $this->seller->user;
        return (new MailMessage)
                    ->subject('إشعار طلب منتج')
                    ->greeting('أهلاً ' . $user->first_name . ' ' . $user->last_name)
                    ->line('لديك طلب جديد.')
                    ->line('المنتج: ' . $this->orderItem->product->title)
                    ->line('الرجاء شحن المنتج على العنوان التالي:')
                    ->line($this->address . ' .')  
                    ->action('عرض الطلب', url(env('FRONT_URL') .'/seller/orders/' . $this->orderItem->order_request_id))
                    ->line('عند إكمال عملية الشحن, يرجى رفع معلومات الشحن في المنصة.')
                    ->line('شكراً لتعاملك معنا.');
    }
}
