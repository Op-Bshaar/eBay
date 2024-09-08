﻿import { useEffect, useState } from "react";
import api from "../../api";
import { useLocation } from "react-router-dom";
import "./SearchPage.css";
import "../../Loader.css";
import { isAxiosError } from "axios";
import Product from "../../Product";
import ProductView from "../../components/ProductView/ProductView";
async function load(
  query: string,
  abortController: AbortController | null,
  setAbortController: (abortController: AbortController | null) => void,
  setErrorElement: (errorElement: JSX.Element | null) => void,
  retryButton: () => JSX.Element,
  setProducts: (products: Product[]) => void
) {
  try {
    if (query) {
      if (abortController) {
        abortController.abort();
      }
      setErrorElement(null);
      const _abortController = new AbortController();
      setAbortController(_abortController);
      const response = await api.get(
        `products/search?query=${encodeURIComponent(query)}`,
        {
          signal: _abortController.signal,
        }
      );
      const products: Product[] = [];
      // TODO: read products from response
      const productlist = response.data;
      productlist.forEach((item: any) => {
        products.push(new Product(item.id,item.price,item.seller_id,item.title, item.description, item.image))
      });
      setProducts(products);
      // TODO: display products
    }
  } catch (error) {
    if (isAxiosError(error) && error.request && !error.response) {
      setErrorElement(
        <div className="error-message">
          تعذر الاتصال, تحقق من الاتصال بالشبكة.{retryButton()}
        </div>
      );
    } else {
      setErrorElement(
        <div className="error-message">حدث خطأ ما.{retryButton()}</div>
      );
    }
  } finally {
    setAbortController(null); // Reset controller after the request is done
  }
}
function useSearchResult(): [
  products: Product[],
  JSX.Element | null,
  () => boolean
] {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") ?? "";
  const [errorElement, setErrorElement] = useState<JSX.Element | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const RetryButton = (retry: () => Promise<void>) => (
    <button className="retry-button" onClick={retry}>
      أعد المحاولة.
    </button>
  );
  const loadSearchResult = async () => {
    await load(
      query,
      abortController,
      setAbortController,
      setErrorElement,
      () => RetryButton(loadSearchResult),
      setProducts
    );
  };
  const isLoading = () => abortController != null;
  //load search result everytime location changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadSearchResult();
  }, [location]);
  return [products, errorElement, isLoading];
}
function SearchPage() {
  const [products, errorElement, isLoading] = useSearchResult();
  return (
    <div className="tagawal-extralight search-page">
      <div className={"center-message"}>
        {errorElement}
        {products.length === 0 && !isLoading && (
          <div className="error-message">لا توجد منتجات مطابقة.</div>
        )}
        {isLoading() && <div className="loader" />}
        {products.map((product, index) => (
          <ProductView key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
export default SearchPage;
