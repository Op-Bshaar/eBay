export const currencySymbol = 'ر.س.';
export const addressMaxLengths = {
    country: 100,
    city: 100,
    district: 100,
    street: 255,
    postal_code: 20,
}
export const redirectAfterLogin ="redirectAfterLogin";
export const displayMoney = (amount: string | number) => {
    if (typeof amount === 'number') {
        amount = new Intl.NumberFormat('en-UK', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
    return `${amount} ${currencySymbol}`;
}