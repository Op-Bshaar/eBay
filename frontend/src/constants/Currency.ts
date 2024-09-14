export const currencySymbol = 'ر.س.';
export function displayMoney(ammount:string | number) {
    return `${ammount} ${currencySymbol}`;
}