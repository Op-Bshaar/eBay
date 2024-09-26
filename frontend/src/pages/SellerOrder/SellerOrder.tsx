import { useParams } from "react-router-dom";
import ErrorMessage from "../../components/errorMessage/Error";
import { useCallback, useEffect, useState } from "react";
import api from "../../helpers/api";
import { OrderItem } from "../../utils/Order";
import { useRequireAuthentication } from "../login/LoginRedirect";
import "../../styles/Loader.css";
import { isAxiosError } from "axios";

function SellerOrder() {
  useRequireAuthentication();
  const { order_id } = useParams();
  const { order, messageElement } = useOrder(order_id);
  if (!order) {
    return messageElement;
  }
  return <p>{`${JSON.stringify(order)}`}</p>;
}
function useOrder(order_id?: string) {
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fetchOrder = useCallback((order_id?: string) => {
    if (order_id) {
      setIsLoading(true);
      setErrorMessage("");
      api
        .get(`/sellers/orders/${order_id}`)
        .then((response) => {
          const data = response.data;
          setOrder(data);
        })
        .catch((error) => {
          console.log(error);
          if (isAxiosError(error) && error.response?.status === 404) {
            /* empty */
          } else {
            setErrorMessage("حدث خطأ ما.");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);
  useEffect(() => fetchOrder(order_id), [fetchOrder, order_id]);
  const notFound = (
    <ErrorMessage className="center-text big-message">
      الطلب غير موجود.
    </ErrorMessage>
  );
  const errorElement = (
    <ErrorMessage className="center-text big-message">
      {errorMessage}
      <button className="link" onClick={() => fetchOrder(order_id)}>
        إعادة المحاولة.
      </button>
    </ErrorMessage>
  );
  let messageElement = null;
  if (!order_id || (!order && !errorMessage && !isLoading)) {
    messageElement = notFound;
  } else if (isLoading) {
    messageElement = (
      <div>
        <div className="loader center-loader" />
      </div>
    );
  } else if (errorMessage) {
    messageElement = errorElement;
  }
  return { order, messageElement };
}
export default SellerOrder;
