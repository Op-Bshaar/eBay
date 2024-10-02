import { ForwardedRef, useState } from "react";
import api from "../../helpers/api";
import { OrderItem } from "../../utils/Order";
import "./RateOrder.css";
import React from "react";

type RateOrderProps = {
    order: OrderItem;
};

// Using React.forwardRef correctly
const RateOrder = React.forwardRef(
    ({ order }: RateOrderProps, ratePopupRef: ForwardedRef<HTMLDivElement>) => {
    const [rating, setRating] = useState(order.review ?? 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleReviewSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post(`/orders/rate/${order.id}`, {
                rating,
            });
            alert("تم ارسال التقييم بنجاح!");
        } catch (error) {
            alert("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    const product = order.product;
    return (
        <div className="rate-order-popup" ref={ratePopupRef}>
            <span>{product.title}</span>
            <span>{product.price}</span>

            <form onSubmit={handleReviewSubmit} className="review-form">
                <label>
                    التقييم:
                    <input
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        min="1"
                        max="5"
                        required
                    />
                </label>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "جاري التعديل..." : "أرسل التقييم"}
                </button>
                <p>الرجاء تقييم المنتج عند الاستلام لمساعدتنا على ضمان الجودة.</p>
            </form>
        </div>
    );
});
export default RateOrder;