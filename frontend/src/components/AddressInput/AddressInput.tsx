import React, { useEffect, useRef } from 'react';
import AddressPage from './Address';
import "./AddressForm.css";
import { addressMaxLengths } from '../../constants/Constants';
interface AddressInputProps {
    address: AddressPage;
    setAddress: (address: AddressPage) => void;
    isValid: boolean;
    setIsValid: (isValid: boolean) => void;
    className?: string;
    disabled?:boolean
}
function AddressInput({ address, setAddress, isValid, setIsValid, className = "", disabled = false}: AddressInputProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const countryInputRef = useRef<HTMLSelectElement>(null);
    const cityInputRef = useRef<HTMLInputElement>(null);
    const districtInputRef = useRef<HTMLInputElement>(null);
    const streetInputRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);
    const _isValid = formRef.current?.checkValidity() === true;
    useEffect(() => {
        if (_isValid !== isValid) {
            setIsValid(_isValid);
        }
    }, [_isValid, isValid, setIsValid, address]);
    // Set default country on mount if not already set
    useEffect(() => {
        if (!address.country) {
            setAddress({
                ...address,
                country: 'SA',
            });
        }
    }, [address, setAddress]);
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
            <label htmlFor="country">الدولة:</label>
            <select id="country" name="country" disabled={disabled}
                onChange={handleChange} ref={countryInputRef} required>
                <option value="SA">المملكة العربية السعودية</option>
            </select>
            <label  htmlFor="street" >عنوان الشارع:</label>
            <input id="street" name="street" onChange={handleChange} ref={streetInputRef} disabled={disabled}
                maxLength={addressMaxLengths.street } placeholder="2929 ريحانة بنت زيد" required />
            <label htmlFor="district">الحي:</label>
            <input id="district" name="district" onChange={handleChange} ref={districtInputRef}
                disabled={disabled} maxLength={addressMaxLengths.district} placeholder="8118 حي العارض" required />
            <label htmlFor="city">المدينة:</label>
            <input id="city" name="city" onChange={handleChange} ref={cityInputRef}
                disabled={disabled} maxLength={addressMaxLengths.city} placeholder="الرياض" required />
            <label htmlFor="postal-code">الرمز البريدي:</label>
            <input maxLength={addressMaxLengths.postal_code} className="postal-code-input" autoComplete="postal-code"
                id="postal-code" pattern="^\d+$" name="postal_code" inputMode="numeric"
                disabled={disabled} onChange={handleChange} placeholder="13337" ref={postalCodeRef} required />
        </form>
    );
}

export default AddressInput;