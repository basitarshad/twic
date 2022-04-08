import { axiosInstanceApi } from "./api.config";
import APP_ENDPOINTS from "./endpoints";

const fetchVendorById = async ({ id }) => {
  const URL = `${APP_ENDPOINTS.GET_VENDOR_BY_ID}${id}`;

  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

const fetchVendorBySubscriptionId = async ({ id }) => {
  const URL = `${APP_ENDPOINTS.GET_VENDOR_BY_SUBSCRIPTION_ID}/${id}`;

  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

const fetchVendorByTransactionId = async ({ id }) => {
  const URL = `${APP_ENDPOINTS.GET_VENDOR_BY_TRANSACTION_ID}/${id}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

export default {
  fetchVendorById,
  fetchVendorByTransactionId,
  fetchVendorBySubscriptionId,
};
