import { User } from "./User";

interface Seller {
    id: string;
    user_id: string;
    bank_name: string | null;
    bank_recepient_name: string | null;
    bank_account_number: string | null;
    iban: string | null;
    user: User | null;
}
export default Seller;