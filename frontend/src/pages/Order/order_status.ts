export const order_status: ReadonlyMap<string, string> = new Map([
    ['pending', 'قيد التنفيذ'],
    ['paid', 'تم الدفع'],
    ['failed', 'فشل الدفع'],
    ['declined', 'رفض الدفع'],
    ['canceled', 'ملفي'],
    ['timeout', 'ملغي'],
]);
export function getOrderStatus(status: string): string {
    // Check if the status exists in the map
    return order_status.get(status) ?? status;
}