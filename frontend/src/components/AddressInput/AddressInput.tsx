import React, { useCallback, useRef } from 'react';
import AddressPage, { addressToText } from './Address';
import "./AddressForm.css";
import { addressMaxLengths } from '../../constants/Constants';
interface AddressInputProps {
    address: AddressPage;
    setAddress: (address: AddressPage) => void;
    isValid: boolean;
    setIsValid: (isValid: boolean) => void;
    className?: string;
}
function AddressInput({ address, setAddress, isValid, setIsValid, className = ""}: AddressInputProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const countryInputRef = useRef<HTMLSelectElement>(null);
    const cityInputRef = useRef<HTMLInputElement>(null);
    const districtInputRef = useRef<HTMLInputElement>(null);
    const streetInputRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);
    const _isValid = formRef.current?.checkValidity() === true;
    if (_isValid !== isValid) {
        setIsValid(_isValid);
    }
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.currentTarget;
        setAddress({
            ...address,
            [name]: value,
        });
    };
    return (
        <form className={`address-form ${className}`} ref={formRef}>
            <select id="country" name="country" onChange={handleChange} ref={countryInputRef} required>
                <option value="SA">المملكة العربية السعودية</option>
            </select>
            <label htmlFor="street" >عنوان الشارع:</label>
            <input id="street" name="street" onChange={handleChange} ref={streetInputRef}
                maxLength={addressMaxLengths.street } placeholder="2929 ريحانة بنت زيد" required />
            <label htmlFor="district">الحي:</label>
            <input id="district" name="district" onChange={handleChange} ref={districtInputRef}
                maxLength={addressMaxLengths.district} placeholder="8118 حي العارض" required />
            <label htmlFor="city">المدينة:</label>
            <input id="city" name="city" onChange={handleChange} ref={cityInputRef}
                maxLength={addressMaxLengths.city} placeholder="الرياض" required />
            <label htmlFor="country">الدولة:</label>
            <label htmlFor="postal-code">الرمز البريدي:</label>
            <input maxLength={addressMaxLengths.postal_code}  className="postal-code-input" autoComplete="postal-code" id="postal-code"
                pattern="^\d+$" name="postalCode" inputMode="numeric"
                onChange={handleChange} placeholder="13337" ref={postalCodeRef} required />
        </form>
    );
}

export default AddressInput;