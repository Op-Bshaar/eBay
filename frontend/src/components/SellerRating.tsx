import  { useEffect, useState } from 'react';
import api from '../helpers/api';
import { isAxiosError } from 'axios';
import ErrorMessage from '../../../admindashboard/src/components/errorMessage/Error';

function SellerRating({ seller_id }: { seller_id: string }) {
    const [rating, setRating] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const fetchRating = () => {
        if (error) {
            setError("");
        }
        if (!isLoading) {
            setIsLoading(true);
        }
        api.get(`/sellers/average-rating/${seller_id}`).then(response => {
            setRating(response.data.rating);
        }).catch((error) => {
            if (isAxiosError(error) && error.request && !error.response) {
                setError("تعذر الاتصال.")
            }
            else {
                setError("حدث خطأ ما.")
            }
        }).finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchRating, [seller_id]);
    if (isLoading) {
        return <span>يتم تحميل....</span>
    }
    if (error) {
        return (
            <ErrorMessage>
                {error}
                <button className="link" onClick={fetchRating}>
                    أعد المحاولة.
                </button>
            </ErrorMessage>
        );
    }
    if (!rating) {
        return (
            <span>
            لا توجد تقييمات.
            </span>
        );
    }
  return (
      <span>({rating}/5)</span>
  );
}
export default SellerRating;