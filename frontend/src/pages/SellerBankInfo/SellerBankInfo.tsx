import ErrorMessage from "../../components/errorMessage/Error";
import { useSellerContext } from "../../context/SellerContext/SellerContext";
import "./SellerBankInfo.css";
function SellerBankInfo() {
    const { seller } = useSellerContext();
    if (!seller) {
        return (
            <ErrorMessage>
                حدث خطأ ما.
            </ErrorMessage>
        );
    }
    return <BankInfoForm/>
}
function BankInfoForm() {
    return (
        <div>
            <form className="seller-bank-info-form">
                <label htmlFor="bank_name">
                    اسم البنك
                </label>
                <input id="bank_name" name="bank_name" minLength={3} maxLength={255} required />
                <label htmlFor="recepient_name">
                    اسم المستفيد
                </label>
                <input id="recepient_name" name="recepient_name" minLength={6} maxLength={100} pattern="^[A-Za-z\u0600-\u06FF\s'-]$" required />
                <label htmlFor="account_number">
                    رقم الحساب
                </label>
                <input id="account_number" name="account_number" minLength={3} maxLength={255} required />
                <label htmlFor="Iban">
                    الآيبان (IBAN)
                </label>
                <input id="Iban" name="Iban" minLength={3} maxLength={255} required />
            </form>
            <button className="button">تعديل</button>
        </div>
    );
}
export default SellerBankInfo;