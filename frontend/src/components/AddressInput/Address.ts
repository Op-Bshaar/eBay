export interface Address {
    country: string;
    city: string;
    district: string;
    street: string;
    postalCode: string;
}
export const emptyAddress = {
    country: "",
    city: "",
    district: "",
    street: "",
    postalCode: "",
}
export function addressToText(address: Address) {
    return `${address.street}, ${address.district}, ${address.city}, ${address.country}, ${address.postalCode}`;
}
export default Address;