export const BASE_URL = "http://127.0.0.1:8000";
export const API_URL = `${BASE_URL}/api`;
export const LOGIN_URL = "/login";
export const PAGE_URLS = {
    home: "/home",
    search: "/products/search",
    login: "/login",
    register: "/register",
    request_email_verification: "/request-email-verification",
    email_verification: "/email-verification",
    update_email: "/update-email",
    addressInput:"/address-input",
    password: "/password",
    restpassword: "/rest-password",
    email_verified_successfuly: "/email-verified-successfully",
    invalid_email_verification_link: "/invalid-email-verification-link",
    cart: '/cart',
    view_order:'/orders/:order_id',
    all_orders: '/orders/all',
    place_order:'/orders/place-order/:order_id',
    editprofile:'/editprofile',
    // edit:`/seller/edit`
    edit_password: '/edit-password',
    sellerPortal: "/seller-portal",

}