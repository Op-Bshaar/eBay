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
export function addressToText(address: Address) {
    return `${address.street}, ${address.district}, ${address.city}, ${address.country}, ${address.postal_code}`;
}
export default Address;