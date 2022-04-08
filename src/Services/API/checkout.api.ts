import { axiosInstance, axiosInstanceApi } from "./api.config";
import APP_ENDPOINTS from "./endpoints";
import ApiHelpers from "./helpers";
import { isEmptyOrNil } from "../../Utils";

const getSalesTax = async ({ country = "US", state, zip, amount }) => {
  try {
    const countryParam = !isEmptyOrNil(country) ? `country=${country}` : "";
    const stateParam = !isEmptyOrNil(country) ? `&state=${state}` : "";
    const zipParam = !isEmptyOrNil(zip) ? `&zip=${zip}` : "";
    const amountParam = !isEmptyOrNil(amount) ? `&amount=${amount}` : "";

    const response = await axiosInstanceApi.get(`${APP_ENDPOINTS.GET_SALES_TAX}?${countryParam}${stateParam}${zipParam}${amountParam}`);

    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

const getDynamicLocationPricing = async ({ productId = "", vendorId = "", location = "" }) => {
  try {
    const productIdParam = !isEmptyOrNil(productId) ? `product_id=${productId}` : "";
    const vendorIdParam = !isEmptyOrNil(vendorId) ? `&vendor_id=${vendorId}` : "";
    const locationParam = !isEmptyOrNil(location) ? `&location=${location}` : "";

    const response = await axiosInstanceApi.get(`${APP_ENDPOINTS.GET_DYNAMIC_LOCATION_PRICING}?${productIdParam}${vendorIdParam}${locationParam}`);

    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

const sendCheckoutRequest = async ({ data }) => {
  try {
    const response = await axiosInstanceApi.post(`${APP_ENDPOINTS.CHECKOUT}`, data);

    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

export default {
  getSalesTax,
  getDynamicLocationPricing,
  sendCheckoutRequest,
};
