import { generatePath, Navigate, useParams } from "react-router-dom";
import OrderLoadingMessage from "./OrderLoadingMessage";
import useOrder from "./useOrder";
import { PAGE_URLS } from "../../constants/URL";
import OrderItemsView from "./OrderItemsView";
import { getOrderStatus } from "./order_status";
import { useState, useEffect } from "react";
import "./OrderPage.css";
import api from "../../helpers/api"; 

function OrderStatusPage() {
  const { order_id } = useParams();
  const { order, isLoadingOrder, loadingOrderErrorMessage, reloadOrder } =
    useOrder(order_id);

  const [averageRating, setAverageRating] = useState(0);
  const [isLoadingRating, setIsLoadingRating] = useState(true);
  const [ratingError, setRatingError] = useState<any>(null);

  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await api.get(`/api/orders/${order_id}/average-rating`);
        setAverageRating(response.data.average_rating);
        setIsLoadingRating(false);
      } catch (error) {
        setRatingError("f");
        setIsLoadingRating(false);
      }
    };
    fetchAverageRating();
  }, [order_id]);


  const handleReviewSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post(`/api/orders/${order_id}/review`, {
        rating,
      });
      alert("تم ارسال التقييم بنجاح!");


      const updatedRating = await api.get(`/api/orders/${order_id}/average-rating`);
      setAverageRating(updatedRating.data.average_rating);
    } catch (error) {
      alert("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingOrder || loadingOrderErrorMessage || !order) {
    return (
      <OrderLoadingMessage
        isLoadingOrder={isLoadingOrder}
        loadingOrderErrorMessage={loadingOrderErrorMessage}
        reloadOrder={reloadOrder}
        order={order}
      />
    );
  }

  if (order.status === "pending") {
    return <Navigate to={generatePath(PAGE_URLS.place_order, { order_id })} />;
  }

  return (
    <div className="order-page center-text">
      <div className="center-text order-status">
        {getOrderStatus(order.status)}
      </div>

      <OrderItemsView
        orderItems={order.items}
        showStatus={order.status === "paid"}
      />

      <div className="average-rating">
        {isLoadingRating
          ? "يتم تحميل التقييم..."
          : `متوسط التقيمات: ${averageRating.toFixed(2)}`}
        {ratingError && <p>{ratingError}</p>}
      </div>


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
          {isSubmitting ? "جاري التعديل..." : "تم ارسال التقييم "}
        </button>
      </form>
    </div>
  );
}

export default OrderStatusPage;
