import { isEmptyOrNil } from "../../Utils";

import { axiosInstance, axiosInstanceApi } from "./api.config";
import APP_ENDPOINTS from "./endpoints";
import ApiHelpers from "./helpers";

type loginUserWithPassword = {
  email: string;
  password: string;
};
const loginUserWithPassword = async (data: loginUserWithPassword) => {
  try {
    const response = await axiosInstanceApi.post(APP_ENDPOINTS.AUTH, data);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

const getUserProfile = async () => {
  try {
    const response = await axiosInstanceApi.get(APP_ENDPOINTS.USER_PROFILE);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const getUserCountryStates = async (userCountry) => {
  try {
    const response = await axiosInstanceApi.get(APP_ENDPOINTS.USER_COUNTRY_STATES(userCountry));
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

const getUserNotificationSettings = async () => {
  try {
    const response = await axiosInstanceApi.get(APP_ENDPOINTS.USER_NOTIFICATION_SETTINGS);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const updateUserNotificationsPermissions = async (data) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axiosInstanceApi.put(APP_ENDPOINTS.UPDATE_USER_NOTIFICATIONS_SETTINGS, data, config);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const sendResetLinkToEmail = async (data) => {
  try {
    const response = await axiosInstanceApi.post(APP_ENDPOINTS.RESET_PASSWORD, data);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

const updatePushNotificationToken = async (deviceInfo) => {
  try {
    const response = await axiosInstanceApi.post(APP_ENDPOINTS.USER_PUSH_NOTIFICATION_TOKEN, deviceInfo);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const updatePaymentMethod = async (result) => {
  try {
    const response = await axiosInstanceApi.post(APP_ENDPOINTS.USER_PAYMENT_DETAILS, { nonce: result.nonce });
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const getPaymentMethod = async () => {
  try {
    const response = await axiosInstanceApi.get(APP_ENDPOINTS.USER_PAYMENT_DETAILS);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const getUserTwicCardInfo = async () => {
  try {
    const response = await axiosInstanceApi.get(APP_ENDPOINTS.USER_TWIC_CARD_DETAILS);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const fetchTwicCardInfo = async (id: string) => {
  try {
    const response = await axiosInstanceApi.get(`${APP_ENDPOINTS.USER_TWIC_CARD_DETAILS}/${id}`);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const updateUserAvatar = async (data: FormData) => {
  try {
    const response = await axiosInstanceApi.post(APP_ENDPOINTS.USER_PROFILE, data);

    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const fetchVenueActivities = async () => {
  try {
    const response = await axiosInstanceApi.get(APP_ENDPOINTS.VENUE_ACTIVITIES);
    return { ...response };
  } catch (error) {
    console.log("error in fetching activities", error);
    return { error, data: null };
  }
};

const updateUserSettings = async ({ payload }) => {
  try {
    const response = await axiosInstanceApi.post(APP_ENDPOINTS.USER_PROFILE, payload);
    return { ...response };
  } catch (error) {
    console.log("error in updating user settings", error);
    return { error, data: null };
  }
};

const connectBankAccount = async ({ payload }) => {
  try {
    const response = await axiosInstanceApi.post(APP_ENDPOINTS.CONNECT_BANK_ACCOUNT, payload);
    return { ...response };
  } catch (error) {
    console.log("error in updating external payment method", error);
    return { error, data: null };
  }
};

const changeAccountPassword = async (params) => {
  try {
    const response = await axiosInstanceApi.put(APP_ENDPOINTS.CHANGE_ACCOUNT_PASSWORD, { ...params });
    return { ...response };
  } catch (error) {
    console.log("error in changing password", error);
    return { error, data: null };
  }
};

const updateUserProfile = async (params) => {
  try {
    const response = await axiosInstanceApi.post(APP_ENDPOINTS.USER_PROFILE, { ...params });
    return { ...response };
  } catch (error) {
    console.log("error in setting user profile", error);
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};
const resetAccountPassword = async (params) => {
  try {
    const response = await axiosInstanceApi.put(APP_ENDPOINTS.CHANGE_ACCOUNT_PASSWORD, { ...params });
    return { ...response };
  } catch (error) {
    console.log("error in resetting password", error);
    return { error, data: null };
  }
};

const getPreTaxAccounts = async () => {
  try {
    const response = await axiosInstanceApi.get(APP_ENDPOINTS.PRETAX_ACCOUNTS);
    return { ...response };
  } catch (error) {
    console.log("error in getting pre-tax accounts details", error);
    return { error, data: null };
  }
};

const getPreTaxAccountPlan = async (accountTypeId: string) => {
  try {
    const response = await axiosInstanceApi.get(`${APP_ENDPOINTS.PRETAX_ACCOUNT_PLAN}/${accountTypeId}`);
    return { ...response };
  } catch (error) {
    console.log("error in getting pre-tax accounts details", error);
    return { error, data: null };
  }
};

// Get PreTax cards
const getPreTaxCards = async () => {
  try {
    const response = await axiosInstanceApi.get(APP_ENDPOINTS.PRETAX_CARDS);
    return { ...response };
  } catch (error) {
    console.log("error in getting pre-tax cards", error);
    return { error, data: null };
  }
};

// Get dependents
const getUserDependents = async (params: any) => {
  const URL = `${APP_ENDPOINTS.USER_DEPENDENTS}${params}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// Update dependents
const updateDependent = async (params: any) => {
  const { id, payload, dependentRequestType = "put" } = params;
  const URL = `${APP_ENDPOINTS.USER_DEPENDENTS}/${id}`;
  try {
    const response = await axiosInstanceApi[dependentRequestType](URL, payload);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// get user demographic data
const getCdhUserProfile = async (params: { requestType?: "get" | "put" | "post"; payload?: any }, apiVersion = "v1") => {
  const { requestType = "get", payload = {} } = params;
  const URL = `${APP_ENDPOINTS.USER_DEMOGRAPHIC_V2}`;
  try {
    const response = await axiosInstanceApi[requestType](URL, payload);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// create pretax card
const createPreTaxCard = async (params) => {
  const URL = `${APP_ENDPOINTS.PRETAX_CARDS}`;
  try {
    const response = await axiosInstanceApi.post(URL, params);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

// deactivate benefit card
const deactivateBenefitCard = async (cardProxyNumber: string) => {
  const URL = `${APP_ENDPOINTS.PRETAX_CARDS}/${cardProxyNumber}/inactivate`;
  try {
    const response = await axiosInstanceApi.put(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

// Get Alegeus Authentication
const connectPreTaxAlegeusAccounts = async (redirectUrl: string, accountId: number | undefined, defaultOptions: number) => {
  const URL = `${APP_ENDPOINTS.USER_ALEGEUS_AUTHENTICATION}`;

  try {
    const response = await axiosInstanceApi.get(URL, {
      params: {
        redirect: `/Page/${redirectUrl}?accountId=${!isEmptyOrNil(accountId) ? accountId : ""}&options=${defaultOptions}`,
      },
    });
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// Get User CDH details
const fetchCdhUserDetails = async () => {
  const URL = `${APP_ENDPOINTS.USER_CDH_DETAILS}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// Activate connected account
const activateConnectedAccount = async () => {
  const URL = `${APP_ENDPOINTS.ACTIVATE_BANK_ACCOUNT}`;
  try {
    const response = await axiosInstanceApi.put(URL);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

//  Manual bank account
const manualBankLink = async (params: { account_number: string; account_type_code: string; bank_token_id: string }) => {
  const URL = `${APP_ENDPOINTS.MANUAL_BANK_LINK}`;
  try {
    const response = await axiosInstanceApi.post(URL, params);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// Verify Manual bank account
const verifyManualBankLink = async () => {
  const URL = `${APP_ENDPOINTS.VERIFY_MANUAL_BANK_LINK}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// fetch cardholder info
const fetchCardholderInfo = async (billingAddress: Object) => {
  const URL = `${APP_ENDPOINTS.CARDHOLDER_INFO}`;
  try {
    const response = await axiosInstanceApi.get(URL, billingAddress);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// update cardholder info
const updateCardholderInfo = async (billingAddress: Object) => {
  const URL = `${APP_ENDPOINTS.CARDHOLDER_INFO}`;
  try {
    const response = await axiosInstanceApi.put(URL, billingAddress);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// Update User reimbursement method for payments
const updateReimbursementMethod = async (payload: { reimbursement_method: string }) => {
  const URL = `${APP_ENDPOINTS.USER_CDH_DETAILS}`;
  try {
    const response = await axiosInstanceApi.put(URL, payload);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

const createTwicCard = async ({ payload }) => {
  try {
    const response = await axiosInstanceApi.post(APP_ENDPOINTS.TWIC_CARD, payload);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

// Replace Twic Card
const replaceTwicCard = async (id: string, payload: Object) => {
  const URL = `${APP_ENDPOINTS.TWIC_CARD}/${id}/replace`;
  try {
    const response = await axiosInstanceApi.post(URL, payload);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// Update Twic Card status
const updateTwicCardStatus = async (id: string, payload: Object) => {
  const URL = `${APP_ENDPOINTS.TWIC_CARD}/${id}`;
  try {
    const response = await axiosInstanceApi.put(URL, payload);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

// Update Twic Card status
const getTokenFromMagicLink = async (id: string, token: string) => {
  const URL = `${APP_ENDPOINTS.SEND_MAGIC_LINK}?id=${id}&tk=${token}&return_token=true`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    return { error, data: null };
  }
};

export default {
  loginUserWithPassword,
  getUserProfile,
  updatePushNotificationToken,
  getUserNotificationSettings,
  updateUserNotificationsPermissions,
  sendResetLinkToEmail,
  updatePaymentMethod,
  getPaymentMethod,
  getUserTwicCardInfo,
  fetchTwicCardInfo,
  createTwicCard,
  updateTwicCardStatus,
  replaceTwicCard,
  updateUserAvatar,
  fetchVenueActivities,
  updateUserSettings,
  connectBankAccount,
  getCdhUserProfile,
  changeAccountPassword,
  resetAccountPassword,
  getPreTaxAccounts,
  getPreTaxCards,
  getUserDependents,
  updateDependent,
  createPreTaxCard,
  deactivateBenefitCard,
  connectPreTaxAlegeusAccounts,
  fetchCdhUserDetails,
  activateConnectedAccount,
  updateReimbursementMethod,
  verifyManualBankLink,
  manualBankLink,
  updateCardholderInfo,
  fetchCardholderInfo,
  getPreTaxAccountPlan,
  updateUserProfile,
  getTokenFromMagicLink,
  getUserCountryStates,
};
