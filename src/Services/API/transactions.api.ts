import { isEmptyOrNil } from "../../Utils";
import { axiosInstanceApi } from "./api.config";
import APP_ENDPOINTS from "./endpoints";
import ApiHelpers from "./helpers";

const getUserReimbursements = async (status, limit, page) => {
  const pageNumber = !isEmptyOrNil(page) ? `&page=${page}` : 0;
  const reimbursementStatus = !isEmptyOrNil(status) ? `&reimbursement_statuses=${status}` : "";
  const excludeLineItem = "&exclude_line_item_reimbursement=true";
  const updatedLimit = !isEmptyOrNil(limit) ? `&limit=${limit}` : "";
  const URL = `${APP_ENDPOINTS.USER_REIMBURSEMENTS}${pageNumber}
  ${reimbursementStatus}${excludeLineItem}${updatedLimit}&sort=-date`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

const getUserSubscriptions = async (status, limit, page) => {
  const pageNumber = !isEmptyOrNil(page) ? `page=${page}` : 0;
  const reimbursementStatus = !isEmptyOrNil(status) ? `&status=${status}` : "";
  const updatedLimit = !isEmptyOrNil(limit) ? `&limit=${limit}` : "";
  const URL = `${APP_ENDPOINTS.USER_SUBSCRIPTIONS}${pageNumber}${reimbursementStatus}${updatedLimit}&sort=-created`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

type getUserOrders = {
  currentPage: number;
  limit: number;
};
const getUserOrders = async ({ currentPage, limit }: getUserOrders) => {
  const pageNumberParam = !isEmptyOrNil(currentPage) ? `page=${currentPage}` : 0;
  const pageLimitParam = !isEmptyOrNil(limit) ? `&limit=${limit}` : "";

  const URL = `${APP_ENDPOINTS.USER_ORDERS}?${pageNumberParam}${pageLimitParam}&sort=-created&order_status=&types=store`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

type getUserAccountTransactionsHistory = {
  currentPage: number;
  limit: number;
  walletId?: string;
  dateQueryString: string;
  type: string;
};
const getUserAccountTransactionsHistory = async ({ currentPage, limit, walletId, dateQueryString, type }: getUserAccountTransactionsHistory) => {
  const pageNumberParam = !isEmptyOrNil(currentPage) ? `page=${currentPage}` : 0;
  const pageLimitParam = !isEmptyOrNil(limit) ? `&limit=${limit}` : "";
  const typeQueryString = !isEmptyOrNil(type) ? `&transaction_type=${type}` : "";
  const URL = `${APP_ENDPOINTS.USER_ACCOUNT_TRANSACTIONS_HISTORY_V2}/${walletId}/transactions?${pageNumberParam}${pageLimitParam}&sort=-created${dateQueryString}${typeQueryString}`;

  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

type getUserWalletTransactionsDetails = {
  id?: string;
  isTwicCardTransacton?: boolean;
};
const getUserWalletTransactionsDetails = async ({ id, isTwicCardTransacton }: getUserWalletTransactionsDetails) => {
  const endPoint = isTwicCardTransacton ? APP_ENDPOINTS.USER_WALLET_TWIC_CARD_TRANSACTION_DETAILS : APP_ENDPOINTS.USER_WALLET_TRANSACTION_DETAILS;
  const URL = `${endPoint}/${id}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

type getUserPretaxAccountTransactionsHistory = {
  flexAccountKey: number;
  limit: number;
};
const getUserPretaxAccountTransactionsHistory = async ({ limit, flexAccountKey }: getUserPretaxAccountTransactionsHistory) => {
  const pageLimitParam = !isEmptyOrNil(limit) ? `&record_count=${limit}` : "";
  const flexAccountKeyParam = !isEmptyOrNil(flexAccountKey) ? `flex_account_key=${flexAccountKey}` : "";

  const URL = `${APP_ENDPOINTS.USER_PRETAX_ACCOUNT_TRANSACTIONS_HISTORY}?${flexAccountKeyParam}${pageLimitParam}&include_denied=false`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

type getTransactionsForSubscription = {
  currentPage: number;
  limit: number;
  walletTypeId?: string;
  subscriptionId?: string;
};
const getTransactionsForSubscription = async ({ currentPage, limit, walletTypeId, subscriptionId }: getTransactionsForSubscription) => {
  const subscriptionIdParam = !isEmptyOrNil(subscriptionId) ? `subscription_id=${subscriptionId}&` : "";
  const pageNumberParam = !isEmptyOrNil(currentPage) ? `page=${currentPage}` : 0;
  const pageLimitParam = !isEmptyOrNil(limit) ? `&limit=${limit}` : "";

  const URL = `${APP_ENDPOINTS.USER_TRANSACTIONS}?${subscriptionIdParam}${pageNumberParam}${pageLimitParam}&sort=-date`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

const getUserSubscriptionDetails = async (id) => {
  const URL = `${APP_ENDPOINTS.USER_SUBSCRIPTION_DETAILS}${id}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

const getTransactionById = async (id) => {
  const URL = `${APP_ENDPOINTS.USER_TRANSACTIONS}/${id}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

const getSingleTransactionById = async (id) => {
  const URL = APP_ENDPOINTS.SINGLE_TRANSACTION(id);
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};
//You can only test form-data when app is not in debugging mode
const submitNewReimbursement = async (data) => {
  try {
    const response = await axiosInstanceApi.post(`${APP_ENDPOINTS.SUBMIT_NEW_REIMBURSEMENT}`, data);

    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

const submitNewReimbursementForPretaxAccount = async (data) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axiosInstanceApi.post(`${APP_ENDPOINTS.PRETAX_REIMBURSEMENT}`, data, config);

    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

const submitNewExpense = async (data) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axiosInstanceApi.post(`${APP_ENDPOINTS.PRETAX_EXPENSES}`, data, config);

    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);

    return { error, data: null };
  }
};

// Get user HSA Account details
const getHsaAccountDetails = async (flexAccountId, requireDataUrl) => {
  const URL = `${APP_ENDPOINTS.PRETAX_ACCOUNTS}/${flexAccountId}/${requireDataUrl}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

// Fetch pretax reimbursements
const fetchPretaxReimbursements = async () => {
  const URL = APP_ENDPOINTS.PRETAX_REIMBURSEMENT;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};
// Fetch pretax reimbursement by id
const fetchPretaxReimbursementById = async (id) => {
  const URL = `${APP_ENDPOINTS.PRETAX_REIMBURSEMENT}/${id}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

// Fetch post-tax wallet categories by wallet id
const fetchPosttaxWalletCategoriesById = async (walletId) => {
  const URL = `${APP_ENDPOINTS.GET_POSTTAX_WALLET_CATEGORIES}?employee_wallet_id=${walletId}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

// Fetch pretax receipt by id
const fetchPretaxReceipt = async (id) => {
  const URL = `${APP_ENDPOINTS.PRETAX_REIMBURSEMENT_RECEIPT}/${id}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const fetchClaimDetailsById = async (params) => {
  const URL = `${APP_ENDPOINTS.USER_PRETAX_ACCOUNT_TRANSACTIONS_HISTORY_V2}/${params}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

const fetchHsaExpenses = async ({ accountId, recordCount }) => {
  const URL = `${APP_ENDPOINTS.PRETAX_EXPENSES}/?employee_account_id=${accountId}&record_count=${recordCount}`;
  try {
    const response = await axiosInstanceApi.get(URL);
    return { ...response };
  } catch (error) {
    ApiHelpers.logoutOn401(error);
    return { error, data: null };
  }
};

export default {
  getUserReimbursements,
  fetchPretaxReimbursements,
  fetchPretaxReimbursementById,
  fetchPosttaxWalletCategoriesById,
  fetchPretaxReceipt,
  getUserOrders,
  getUserSubscriptionDetails,
  getUserSubscriptions,
  getTransactionsForSubscription,
  getTransactionById,
  submitNewReimbursement,
  submitNewReimbursementForPretaxAccount,
  getUserAccountTransactionsHistory,
  getUserPretaxAccountTransactionsHistory,
  getUserWalletTransactionsDetails,
  getHsaAccountDetails,
  fetchClaimDetailsById,
  submitNewExpense,
  fetchHsaExpenses,
  getSingleTransactionById,
};
