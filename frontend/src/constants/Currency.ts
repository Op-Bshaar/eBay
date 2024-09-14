export const currencySymbol = 'ر.س.';
export function displayMoney(amount: string | number) {
    if (typeof amount === 'number') {
        amount = new Intl.NumberFormat('en-UK', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
    return `${amount} ${currencySymbol}`;
}