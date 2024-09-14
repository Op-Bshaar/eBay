export interface Address {
    city: string;
    district: string;
    street: string;
    postalCode: string;
}
export const emptyAddress = {
    city: "",
    district: "",
    street: "",
    postalCode: "",
}
export function addressToText(address: Address) {
    return `${address.street}, ${address.district}, ${address.city}, ${address.postalCode}`;
}
export default Address;