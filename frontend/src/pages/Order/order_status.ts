export const order_status: ReadonlyMap<string, string> = new Map([
    ['pending', 'بانتظار الدفع'],
    ['paid', 'تم الدفع'],
    ['failed', 'فشل الدفع'],
    ['declined', 'رفض الدفع'],
    ['canceled', 'ملفي'],
    ['timeout', 'ملغي لعدم الدفع'],
    ['notified-seller', 'تم إبلاغ البائع'],
]);
export function getSellerStatus(status: string) {
    if (status === 'notified-seller') {
        status = 'paid';
    }
    else if (status === 'timeout' || status === 'declined' || status === 'failed') {
        status = 'canceled';
    }
    return status;
}
export function getOrderStatus(status: string): string {
    // Check if the status exists in the map
    return order_status.get(status) ?? status;
}