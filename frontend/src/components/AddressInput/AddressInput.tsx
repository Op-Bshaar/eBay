import React, { useRef } from 'react';
import Address from './Address';
import "./AddressForm.css";
interface AddressInputProps {
    address: Address;
    setAddress: (address: Address) => void;
    isValid: boolean;
    setIsValid: (isValid: boolean) => void;
    className?: string;
}
function AddressInput({ address, setAddress, isValid, setIsValid, className = "" }: AddressInputProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const cityInputRef = useRef<HTMLInputElement>(null);
    const districtInputRef = useRef<HTMLInputElement>(null);
    const streetInputRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);
    const _isValid = formRef.current?.checkValidity() === true;
    if (_isValid !== isValid) {
        setIsValid(_isValid);
    }
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.currentTarget;
        setAddress({
            ...address,
            [name]: value,
        });
    };
    return (
        <form className={`address-form ${className}`} ref={formRef}>
            <label htmlFor="street">عنوان الشارع:</label>
            <input id="street" name="street" onChange={handleChange} ref={streetInputRef}
                placeholder="2929 ريحانة بنت زيد" required />
            <label htmlFor="district">الحي:</label>
            <input id="district" name="district" onChange={handleChange} ref={districtInputRef}
                placeholder="8118 حي العارض" required />
            <label htmlFor="city">المدينة:</label>
            <input id="city" name="city" onChange={handleChange} ref={cityInputRef}
                placeholder="الرياض" required />
            <label htmlFor="postal-code">الرمز البريدي:</label>
            <input className="postal-code-input" autoComplete="postal-code" id="postal-code"
                pattern="^\d+$" name="postalCode" inputMode="numeric"
                onChange={handleChange} placeholder="13337" ref={postalCodeRef} required />
        </form>
    );
}

export default AddressInput;