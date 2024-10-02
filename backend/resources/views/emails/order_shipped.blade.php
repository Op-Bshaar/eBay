<!DOCTYPE html>
<html dir="rtl">
<head>
    <title>تم شحن منتج</title>
</head>
<body>
    <p>
        قام البائع {{ $seller->user->first_name }}  {{  $seller->user->last_name }} بشحن المنتج التالي:<br>
        <table>
            <tr>
                <td>الاسم</td>
                <td>{{ $order->product->title }}</td>
            </tr>
            <tr>
                <td>السعر</td>
                <td>{{ $order->product->price }}</td>
            </tr>
            <tr>
                <td>رقم الطلب</td>
                <td>{{ $order->id }}</td>
            </tr>
        </table>
        إلى العنوان التالي:<br>
        {{ $order->orderRequest->getAddress() }}<br>
        معلومات الشحن:<br>
        <table>
            <tr>
                <td>شركة الشحن</td>
                <td>{{ $order->shipping_company}}</td>
            </tr>
            <tr>
                <td>رقم الشحنة</td>
                <td>{{ $order->shipment_number  }}</td>
            </tr>
            <tr>
                <td>اسم العميل</td>
                <td>{{ $buyer_first_name}}  {{  $buyer_last_name  }}</td>
            </tr>
        </table>
        <a href="{{ env('FRONT_URL') . '/admin/orders/items/' . $order->id }}" target="_blank">تفاصيل الطلب</a>
    </p>
</body>
</html>
