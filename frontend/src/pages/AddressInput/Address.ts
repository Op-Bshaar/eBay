export interface Address {
    country: string;
    city: string;
    district: string;
    street: string;
    postal_code: string;
}
export const emptyAddress = {
    country: "",
    city: "",
    district: "",
    street: "",
    postal_code: "",
}
const countries: ReadonlyMap<string, string> = new Map([
    ["SA", "المملكة العربية السعودية"],
]);
export function addressToText(address: Address) {
    return `${address.street}, ${address.district}, ${address.city}, ${countries.get(address.country)}, ${address.postal_code}`;
}
export default Address;