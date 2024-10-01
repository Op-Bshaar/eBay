import { ChangeEvent, FormEvent, useRef, useState } from "react";
import ErrorMessage from "../../components/errorMessage/Error";
import { useSellerContext } from "../../context/SellerContext/SellerContext";
import "./SellerBankInfo.css";
import "../../styles/Loader.css"
import InputError from "../../components/InputError/InputError";
import api from "../../helpers/api";
function SellerBankInfo() {
    const { seller } = useSellerContext();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [triggerValidate, setTriggerValidate] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const bankNameInputRef = useRef<HTMLInputElement>(null);
    const recepientNameInputRef = useRef<HTMLInputElement>(null);
    const accountNumberInputRef = useRef<HTMLInputElement>(null);
    const ibanInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        bank_name: seller?.bank_name ?? "",
        bank_recepient_name: seller?.bank_recepient_name ?? "",
        bank_account_number: seller?.bank_account_number ?? "",
        iban: seller?.iban ?? "",
    });
    const cancelEdit = () => {
        setIsEditing(false);
        setTriggerValidate(false);
        setFormData({
            bank_name: seller?.bank_name ?? "",
            bank_recepient_name: seller?.bank_recepient_name ?? "",
            bank_account_number: seller?.bank_account_number ?? "",
            iban: seller?.iban ?? "",
        });
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setFormData({
            ...formData,
            [name]: value,
        });
    }
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!triggerValidate) {
            setTriggerValidate(true);
        }
        const form = formRef.current;
        if (form) {
            const inputs = Array.from(form.elements).filter(
                (element) => (element as HTMLInputElement).checkValidity !== undefined
            ) as HTMLInputElement[];
            if (
                !form.checkValidity() ||
                inputs.some((input) => !input.checkValidity())
            ) {
                return;
            }
        }
        setIsLoading(true);
        api.put("/sellers/set-bank-info", formData)
            .then(() => {
                setIsEditing(false);
                setTriggerValidate(false);
            }).catch(error => {
                console.log(error);
            })
            .finally(() => setIsLoading(false))
    }
    if (!seller) {
        return (
            <ErrorMessage>
                حدث خطأ ما.
            </ErrorMessage>
        );
    }
    const bankInfoSet = !!seller.bank_name && !!seller.bank_recepient_name && !!seller.bank_account_number && !!seller.iban;
    const disableInput = (bankInfoSet && !isEditing) || isLoading;
    return (
        <form className="seller-bank-info-form" action="" ref={formRef}>
            <h2>
                المعلومات البنكية
            </h2>
            {isLoading && <span className="small-loader" />}
            <div className="bank-info-input-group">
                <label htmlFor="bank_name">
                    اسم البنك
                </label>
                <input id="bank_name" name="bank_name" value={formData.bank_name} minLength={3}
                    onChange={handleChange} maxLength={255} required disabled={disableInput} ref={bankNameInputRef} />

                <InputError
                    input={bankNameInputRef.current}
                    name="اسم البنك"
                    triggerValidate={triggerValidate}
                    value={formData.bank_name}
                />
            </div>
            <div className="bank-info-input-group">
                <label htmlFor="bank_recepient_name">
                    اسم المستفيد
                </label>
                <input
                    id="bank_recepient_name"
                    name="bank_recepient_name"
                    minLength={6}
                    maxLength={100}
                    pattern="^[أ-يa-zA-Z\s]+$"
                    required
                    disabled={disableInput}
                    value={formData.bank_recepient_name}
                    onChange={handleChange}
                    ref={recepientNameInputRef}
                />
                <InputError
                    input={recepientNameInputRef.current}
                    name="اسم المستفيد"
                    triggerValidate={triggerValidate}
                    value={formData.bank_recepient_name}
                />
            </div>
            <div className="bank-info-input-group">
                <label htmlFor="bank_account_number">
                    رقم الحساب
                </label>
                <input id="bank_account_number" name="bank_account_number" value={formData.bank_account_number} required
                    onChange={handleChange} minLength={14} maxLength={30} disabled={disableInput} ref={accountNumberInputRef} />

                <InputError
                    input={accountNumberInputRef.current}
                    name="رقم الحساب"
                    triggerValidate={triggerValidate}
                    value={formData.bank_account_number}
                />
            </div>
            <div className="bank-info-input-group">
                <label htmlFor="Iban">
                    الآيبان (IBAN)
                </label>
                <input id="Iban" name="Iban" value={formData.iban} pattern="^[A-Z]{2}[0-9]{2}[A-Z0-9]*$" required
                    onChange={handleChange} minLength={18} maxLength={34} disabled={disableInput} ref={ibanInputRef} />
                <InputError
                    input={ibanInputRef.current}
                    name="رقم الآيبان"
                    triggerValidate={triggerValidate}
                    value={formData.iban}
                />
            </div>
            <div className="bank-info-buttons-container">
                {(isEditing || !bankInfoSet) &&
                    <button className="button" type="submit" onClick={handleSubmit} disabled={isLoading}>
                        تأكيد
                    </button>}

                {bankInfoSet && !isLoading &&
                    (isEditing ?
                        <button type="button" onClick={cancelEdit} className="button">إلغاء</button> :
                        <button type="button" onClick={() => setIsEditing(true)} className="button">تعديل</button>)
                }
            </div>
            {(!bankInfoSet || isEditing) && < p > الرجاء إدخال بيانات الحساب الذي ترغب باستلام أرباحك عليه.</p>}
        </form>
    );
}
export default SellerBankInfo;