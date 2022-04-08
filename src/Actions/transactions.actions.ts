import { format, startOfMonth } from "date-fns";
import numeral from "numeral";
import { groupBy, head, map, pathOr, propOr } from "ramda";
import { AmplitudeAnalytics } from "../AppAnalytics";
import { AppNotification } from "../Components";
import { APP_ROUTES } from "../Navigation";
import Store from "../Redux/store";
import { FormValuesType } from "../Screens/Expense/types";
import { NavigationService, TransactionsApiHandlers } from "../Services";
import TransactionsHelpers from "../Services/transactions";
import { PostTaxClaimsDetailsType, WalletCardProps } from "../types";
import { createFormData, dateToLLFormat, isEmptyOrNil } from "../Utils";
import { toggleAppScreenLoader } from "./appLoader.actions";

const {
  formatUserReimbursements,
  formatUserSubscriptionsList,
  formatUserWalletTransactionHistory,
  formatPretaxAccountTransactionHistory,
  formatTransactionsHistory,
  formatUserOrders,
  getUserOrderDetails,
  getReimbursementsDetails,
  getSubscriptionDetails,
  formatHsaAccountDetails,
  formatInitialPretaxReimbursements,
  formatPretaxReimbursement,
  formatUserWalletTwicCardTransactionDetails,
  formatCategoriesAndSubcategories,
} = TransactionsHelpers;

const formatResponseForTransactionData = (resp, transformer) => {
  if (resp.error) return [];
  return transformer(resp.data);
};

/**
 * Fetches the orders data based on the logged in user's auth token
 *
 * @returns
 */
export const getUserOrders = (params) => {
  const { limit, currentPage } = params;
  return async (dispatch, getState) => {
    const isInitialPage = currentPage === 0;
    if (isInitialPage) {
      dispatch(toggleAppScreenLoader(true));
    }

    const state = getState();
    const employeeWallets: Array<WalletCardProps> = pathOr([], ["userProfile", "userInfo", "wallets"], state);
    const fetchUserOrders = await TransactionsApiHandlers.getUserOrders({
      currentPage,
      limit,
    });
    const { count, page } = pathOr({ count: 0, page: 0 }, ["data", "data"], fetchUserOrders);

    const _formatUserOrders = (response) => formatUserOrders(response, employeeWallets);
    const transactions = formatResponseForTransactionData(fetchUserOrders, _formatUserOrders);

    if (isInitialPage) {
      setTimeout(() => {
        dispatch(toggleAppScreenLoader(false));
      }, 500);
    }

    return {
      transactions,
      count,
      page,
    };
  };
};

/**
 * Fetches the account transactions History data based on the logged in user's auth token and account id
 *
 * @returns
 */
type ParamsType = {
  appliedWalletsFilters?: string;
};

export const getUserAccountTransactionHistory = ({ walletId, initialValue, currentPage, limit, dateQueryString = "", type = "" }) => {
  const params: ParamsType = {};
  if (!isEmptyOrNil(walletId)) params.appliedWalletsFilters = walletId;
  if (isEmptyOrNil(walletId) && initialValue) params.appliedWalletsFilters = "";
  if (isEmptyOrNil(params)) return null;

  const { appliedWalletsFilters } = params;
  return async (dispatch, getState) => {
    const isInitialPage = currentPage === 0;
    if (isInitialPage) {
      dispatch(toggleAppScreenLoader(true));
    }

    const state = getState();
    const employeeWallets: Array<WalletCardProps> = pathOr([], ["userProfile", "userInfo", "wallets"], state);
    const fetchUserTransactionsHistory = await TransactionsApiHandlers.getUserAccountTransactionsHistory({ currentPage, limit, walletId: appliedWalletsFilters, dateQueryString, type });
    const { count, page } = pathOr({ count: 0, page: 0 }, ["data", "data"], fetchUserTransactionsHistory);

    const _formatWalletTransactionHistory = (response) => formatUserWalletTransactionHistory(response, employeeWallets);
    const transactions = formatResponseForTransactionData(fetchUserTransactionsHistory, _formatWalletTransactionHistory);

    setTimeout(() => {
      dispatch(toggleAppScreenLoader(false));
    }, 500);

    return {
      transactions,
      count,
      page,
    };
  };
};

/**
 * Fetches the user wallet transactions details data based on the logged in user's auth token and account id
 *
 * @returns
 */
export const getUserWalletTransactionDetails = (params: { id: string; isTwicCardTransacton: boolean }) => {
  const { id, isTwicCardTransacton } = params;
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));
    const transactionDataKey = isTwicCardTransacton ? "twic_card_transaction" : "transaction";
    const state = getState();
    const employeeWallets: Array<WalletCardProps> = pathOr([], ["userProfile", "userInfo", "wallets"], state);
    const fetchUserWalletTransactionDetails = await TransactionsApiHandlers.getUserWalletTransactionsDetails({ id, isTwicCardTransacton });
    const fetchUserWalletTransactionResponse = pathOr([], ["data", "data", transactionDataKey], fetchUserWalletTransactionDetails);
    if (!isEmptyOrNil(fetchUserWalletTransactionResponse)) {
      if (isTwicCardTransacton) {
        const transaction = formatUserWalletTwicCardTransactionDetails(fetchUserWalletTransactionResponse);
        dispatch(toggleAppScreenLoader(false));
        return {
          transaction,
        };
      } else {
        const transactions = getUserOrderDetails([fetchUserWalletTransactionResponse], employeeWallets);
        dispatch(toggleAppScreenLoader(false));
        return {
          transaction: head(transactions),
        };
      }
    }

    setTimeout(() => {
      dispatch(toggleAppScreenLoader(false));
    }, 500);
  };
};

/**
 * Fetches the account transactions History data based on the logged in user's auth token and account id
 *
 * @returns
 */
export const getUserPretaxAccountTransactionHistory = (params) => {
  const { limit, flexAccountKey } = params;
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));

    const fetchUserTransactionsHistory = await TransactionsApiHandlers.getUserPretaxAccountTransactionsHistory({ limit, flexAccountKey });
    const transactionsResponse = pathOr([], ["data", "data", "transactions"], fetchUserTransactionsHistory);
    const count = transactionsResponse.length;

    const _formatWalletTransactionHistory = (response) => formatPretaxAccountTransactionHistory(response);
    const transactions = formatResponseForTransactionData(fetchUserTransactionsHistory, _formatWalletTransactionHistory);

    setTimeout(() => {
      dispatch(toggleAppScreenLoader(false));
    }, 500);

    return {
      transactions,
      count,
      page: 0,
    };
  };
};

/**
 * Fetches the Reimbursements data based on the logged in user's auth token
 *
 * @returns
 */
export const getUserReimbursements = (params) => {
  return async (dispatch, getState) => {
    const state = getState();
    const stipendConfig = pathOr({}, ["userProfile", "stipendConfig"], state);
    const userCountry = pathOr("us", ["userProfile", "userInfo", "country"], state);
    const employeeWallets: Array<WalletCardProps> = pathOr([], ["userProfile", "userInfo", "wallets"], state);
    const { appliedStatusFilters, limit, currentPage } = params;
    const fetchUserReimbursements = await TransactionsApiHandlers.getUserReimbursements(appliedStatusFilters, limit, currentPage);
    if (fetchUserReimbursements.error) {
      const error = pathOr("", ["error", "response", "data", "error"], fetchUserReimbursements);
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: error || "Something went wrong. Please try again.",
      });
      dispatch(toggleAppScreenLoader(false));
      return {};
    } else {
      const { count, page } = pathOr({ count: 0, page: 0 }, ["data", "data"], fetchUserReimbursements);
      const _formatUserReimbursements = (response) => formatUserReimbursements(response, employeeWallets, stipendConfig, userCountry);
      const formattedReimbursements = formatResponseForTransactionData(fetchUserReimbursements, _formatUserReimbursements);
      return {
        posttaxReimbursements: formattedReimbursements,
        count,
        page,
      };
    }
  };
};

/**
 * Fetches the User Subscriptions data based on the logged in user's auth token
 *
 * @returns
 */
export const getUserSubscriptionsList = (params) => {
  return async (dispatch, getState) => {
    const state = getState();
    const vendorsList = pathOr([], ["marketplace", "vendorsList"], state);

    const _formatUserSubscriptionsList = (response) => {
      const formattedList = formatUserSubscriptionsList(response, vendorsList);
      const groupedListByStatus = TransactionsHelpers.groupSubscriptionsByStatus(formattedList);
      const transformedList = map((group) => ({ ...group, data: [group.data] }), groupedListByStatus);
      return transformedList;
    };

    const { appliedStatusFilters, limit, currentPage } = params;
    const isInitialPage = currentPage === 0;

    if (isInitialPage) {
      dispatch(toggleAppScreenLoader(true));
    }

    const fetchUserSubscriptionsResponse = await TransactionsApiHandlers.getUserSubscriptions(appliedStatusFilters, limit, currentPage);
    const { count, page } = pathOr({ count: 0, page: 0 }, ["data", "data"], fetchUserSubscriptionsResponse);

    const subscriptions = formatResponseForTransactionData(fetchUserSubscriptionsResponse, _formatUserSubscriptionsList);

    if (isInitialPage) {
      setTimeout(() => {
        dispatch(toggleAppScreenLoader(false));
      }, 500);
    }

    return {
      subscriptions,
      count,
      page,
    };
  };
};

/**
 * Fetches specific subscription Details data
 *
 * @returns
 */
export const getUserSubscriptionDetails = (params) => {
  return async (dispatch, getState) => {
    //dispatch(toggleAppScreenLoader(true))
    const state = getState();
    const vendorsList = pathOr([], ["marketplace", "vendorsList"], state);
    const { id } = params;

    let subscription = {};
    const fetchSubscriptionDetails = await TransactionsApiHandlers.getUserSubscriptionDetails(id);

    if (!fetchSubscriptionDetails.error) {
      const subscriptionResponse = pathOr({}, ["data", "data", "subscription"], fetchSubscriptionDetails);
      subscription = head(getSubscriptionDetails([subscriptionResponse], vendorsList));
      //dispatch(toggleAppScreenLoader(false))
    }

    return subscription;
  };
};

/**
 * Fetches Transactions made for a specific subscription. A subscription ID is provided.
 *
 * @returns
 */
export const getTransactionHistoryForSubscription = (params) => {
  const { limit, currentPage, subscriptionId } = params;
  return async (dispatch, getState) => {
    const isInitialPage = currentPage === 0;
    if (isInitialPage) {
      dispatch(toggleAppScreenLoader(true));
    }

    const state = getState();
    const employeeWallets: Array<WalletCardProps> = pathOr([], ["userProfile", "userInfo", "wallets"], state);
    const fetchUserTransactionsHistory = await TransactionsApiHandlers.getTransactionsForSubscription({ currentPage, limit, subscriptionId });
    const { count, page } = pathOr({ count: 0, page: 0 }, ["data", "data"], fetchUserTransactionsHistory);

    const _formatTransactionHistory = (response) => formatTransactionsHistory(response, employeeWallets);
    const transactions = formatResponseForTransactionData(fetchUserTransactionsHistory, _formatTransactionHistory);

    if (isInitialPage) {
      setTimeout(() => {
        dispatch(toggleAppScreenLoader(false));
      }, 500);
    }

    return {
      transactions,
      count,
      page,
    };
  };
};

/**
 * send a new reimbursement request
 *
 * @param {*} params
 * @returns
 */
export const submitNewReimbursement = (newReimbursement) => {
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));

    const { type } = newReimbursement;
    const formData = createFormData({ data: newReimbursement, fieldNameToMap: "file", fieldNameForApi: "file[]" });
    const reimbursementSubmissionResponse = await TransactionsApiHandlers.submitNewReimbursement(formData);

    if (!reimbursementSubmissionResponse.error) {
      const response = pathOr({}, ["data", "data"], reimbursementSubmissionResponse);
      const id = propOr("", "id", response);

      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "New reimbursement submitted successfully!",
      });
      const fetchReimbursementResponse = await TransactionsApiHandlers.getTransactionById(id);
      dispatch(
        AmplitudeAnalytics.newReimbursementSubmitted({
          cost: newReimbursement.amount,
          transaction_date: dateToLLFormat(newReimbursement.transaction_date),
          vendor_name: newReimbursement.reimbursement_vendor,
          account: newReimbursement.default_employee_wallet_id,
          category: newReimbursement.category,
          is_recurring: newReimbursement.is_recurring,
          type: "posttax",
        }),
      );
      if (!fetchReimbursementResponse.error) {
        NavigationService.replaceScreen(APP_ROUTES.CLAIM_SUBMISSION, { type, claimType: "posttax" });
      }
    }

    if (reimbursementSubmissionResponse.error) {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: "Something went wrong. Please try again.",
      });
    }

    dispatch(toggleAppScreenLoader(false));
  };
};

/**
 * send a new reimbursement request for pretax account
 *
 * @param {*} params
 * @returns
 */
export const submitNewReimbursementForPretaxAccount = (newReimbursement) => {
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));
    const { type } = newReimbursement;

    const reimbursmentSubmissionResponse = await TransactionsApiHandlers.submitNewReimbursementForPretaxAccount(newReimbursement);

    if (!reimbursmentSubmissionResponse.error) {
      dispatch(
        AmplitudeAnalytics.newReimbursementSubmitted({
          cost: newReimbursement.amount,
          transaction_date: dateToLLFormat(newReimbursement.transaction_date),
          vendor_name: newReimbursement.reimbursement_vendor,
          account: newReimbursement.default_employee_wallet_id,
          category: newReimbursement.category,
          is_recurring: newReimbursement.is_recurring,
          type: "pretax",
        }),
      );

      NavigationService.replaceScreen(APP_ROUTES.CLAIM_SUBMISSION, { type, claimType: "pretax" });
    }

    if (reimbursmentSubmissionResponse.error) {
      const error = pathOr("", ["error", "response", "data", "error"], reimbursmentSubmissionResponse);
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: error || "Something went wrong. Please try again.",
      });
    }

    dispatch(toggleAppScreenLoader(false));
  };
};

/**
 * send a new expense request
 *
 * @param {*} params
 * @returns
 */
export const submitNewExpense = (values: { data: FormValuesType }) => {
  return async (dispatch) => {
    const { data: newExpense } = values;
    const { amount, receiptDate, reimbursementVendor, description, walletId, files } = newExpense;
    const replacedCommaWithDot = amount.replace(/,/g, ".");
    const amountInNumber = numeral(replacedCommaWithDot).value();
    dispatch(toggleAppScreenLoader(true));
    const updatedFields = {
      total_amount: amountInNumber,
      employee_account_id: walletId,
      receipt_date: receiptDate,
      reimbursement_vendor: reimbursementVendor,
      description: description,
      file: files,
    };
    const formData = createFormData({ data: updatedFields, fieldNameToMap: "file", fieldNameForApi: "file[]" });

    const expenseSubmissionResponse = await TransactionsApiHandlers.submitNewExpense(formData);

    if (!expenseSubmissionResponse.error) {
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "New expense submitted successfully!",
      });
      dispatch(
        AmplitudeAnalytics.newExpenseSubmitted({
          cost: replacedCommaWithDot,
          transaction_date: dateToLLFormat(receiptDate),
          vendor_name: reimbursementVendor,
          account: walletId,
          type: "pretax",
        }),
      );
      NavigationService.replaceScreen(APP_ROUTES.EXPENSE_SUBMISSION, { walletId });
    }

    if (expenseSubmissionResponse.error) {
      const error = pathOr("", ["error", "response", "data", "error"], expenseSubmissionResponse);
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: error || "Something went wrong. Please try again.",
        autoHide: false,
      });
    }

    dispatch(toggleAppScreenLoader(false));
  };
};

export const fetchHsaExpenses = (accountId) => {
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));

    const fetchExpenseResponse = await TransactionsApiHandlers.fetchHsaExpenses({ accountId, recordCount: 100 });
    let expenses;
    if (!fetchExpenseResponse.error) {
      const reimbursementResponse = pathOr({}, ["data", "data", "expenses"], fetchExpenseResponse);
      expenses = TransactionsHelpers.formatExpense(reimbursementResponse);
    }

    dispatch(toggleAppScreenLoader(false));
    const groupExpenseByMonth = (transactions) => {
      const groupedList = groupBy((transaction: any) => format(startOfMonth(new Date(transaction.created)), "MMM yy"), transactions);
      const formattedList = Object.keys(groupedList).map((group) => {
        return {
          title: group,
          data: groupedList[group],
        };
      });
      return formattedList;
    };
    return groupExpenseByMonth(expenses);
  };
};

export const getTransactionById = (transactionId: string) => {
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));
    const state = getState();
    const wallets = pathOr([], ["userProfile", "userInfo", "wallets"], state);
    const stipendConfig = pathOr({}, ["userProfile", "stipendConfig"], state);
    const userCountry = pathOr("us", ["userProfile", "userInfo", "country"], state);
    let reimbursement = {};

    const fetchReimbursementResponse = await TransactionsApiHandlers.getTransactionById(transactionId);

    if (fetchReimbursementResponse.error) {
      const error = pathOr("", ["error", "response", "data", "error"], fetchReimbursementResponse);
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: error || "Something went wrong. Please try again.",
      });
      dispatch(toggleAppScreenLoader(false));
    } else {
      const reimbursementResponse = pathOr({}, ["data", "data", "transaction"], fetchReimbursementResponse);
      const formattedReimbursement: PostTaxClaimsDetailsType = head(getReimbursementsDetails([reimbursementResponse], wallets, stipendConfig, userCountry));
      reimbursement = formattedReimbursement;
    }

    dispatch(toggleAppScreenLoader(false));
    return reimbursement;
  };
};

export const getSingleTransactionById = (transactionId: string) => {
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));
    const state = getState();
    const employeeWallets: Array<WalletCardProps> = pathOr([], ["userProfile", "userInfo", "wallets"], state);
    const fetchOrderResponse_ = await TransactionsApiHandlers.getSingleTransactionById(transactionId);
    const fetchOrderResponse = pathOr({}, ["data", "data", "transaction"], fetchOrderResponse_);

    if (isEmptyOrNil(fetchOrderResponse)) {
      dispatch(toggleAppScreenLoader(false));
      return null;
    }

    const _formattedUserOrders = formatUserOrders({ data: { transactions: [fetchOrderResponse] } }, employeeWallets);
    dispatch(toggleAppScreenLoader(false));
    return _formattedUserOrders;
  };
};
/**
 * Fetches the HSA account data History data based on the logged in user's auth token and account id
 *
 * @returns
 */
export const getUserHSAAccountDetails = (flexAccountId: number | undefined) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));

    const fetchHsaAccountSummary = await TransactionsApiHandlers.getHsaAccountDetails(flexAccountId, "hsa-summary");
    const fetchHsaAccountinvestments = await TransactionsApiHandlers.getHsaAccountDetails(flexAccountId, "hsa-investments");
    const hsaAccountData = formatHsaAccountDetails({ fetchHsaAccountSummary, fetchHsaAccountinvestments });

    dispatch(toggleAppScreenLoader(false));
    return hsaAccountData;
  };
};

/**
 * Fetches pretax reimbursements
 *
 * @returns
 */
export const fetchPretaxReimbursements = async (isPretaxEnabled) => {
  if (!isPretaxEnabled) return [];

  const store = Store.getState();
  const userReimbursementMethod = pathOr("", ["userProfile", "reimbursementMethod"], store);

  const pretaxReimbursements = await TransactionsApiHandlers.fetchPretaxReimbursements();
  if (pretaxReimbursements.error) {
    const error = pathOr("", ["response", "data", "error"], pretaxReimbursements);
    AppNotification.toggleErrorNotification({
      message: "Error",
      description: error || "We are experiencing issues retrieving your pretax claims. Please try again shortly.",
    });
    return [];
  } else {
    const pretaxReimbursementsList = pathOr([], ["data", "data", "claims"], pretaxReimbursements);
    return formatInitialPretaxReimbursements(pretaxReimbursementsList, userReimbursementMethod);
  }
};

const getReceiptResponse = async (reimbursement) => {
  const base64receipt = head(propOr([], "receipts_info", reimbursement));
  const receiptId = !isEmptyOrNil(base64receipt) && propOr(undefined, "FileKey", base64receipt);
  const receiptResponse = receiptId ? await TransactionsApiHandlers.fetchPretaxReceipt(receiptId) : {};
  return receiptResponse;
};

/**
 * Fetches pretax reimbursement by id
 *
 * @returns
 */
export const fetchPretaxReimbursementByIdAndItsReceipt = (id) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const reimbursementResponse = await TransactionsApiHandlers.fetchPretaxReimbursementById(id);
    if (reimbursementResponse.error) {
      const error = pathOr("", ["response", "data", "error"], reimbursementResponse);
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: error || "Something went wrong. Please try again.",
      });
      dispatch(toggleAppScreenLoader(false));
      return {};
    } else {
      const reimbursement = pathOr([], ["data", "data", "claim"], reimbursementResponse);
      const hasReceipt = propOr(false, "has_receipt", reimbursement);
      const receiptResponse = hasReceipt ? await getReceiptResponse(reimbursement) : {};
      const formattedReimbursement =
        isEmptyOrNil(receiptResponse) || pathOr("", ["response", "data", "error"], receiptResponse) ? formatPretaxReimbursement(reimbursement, {}) : formatPretaxReimbursement(reimbursement, pathOr({}, ["data", "data", "receipt"], receiptResponse));
      dispatch(toggleAppScreenLoader(false));
      return formattedReimbursement;
    }
  };
};

/**
 * Fetches post-tax wallet categories
 *
 * @returns
 */
export const fetchPosttaxWalletCategories = (walletId) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const categoriesResponse = await TransactionsApiHandlers.fetchPosttaxWalletCategoriesById(walletId);
    if (categoriesResponse.error) {
      const error = pathOr("", ["response", "data", "error"], categoriesResponse);
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: error || "Something went wrong. Please try again.",
      });
      dispatch(toggleAppScreenLoader(false));
      return [];
    } else {
      const categories = pathOr([], ["data", "data", "categories"], categoriesResponse);
      dispatch(toggleAppScreenLoader(false));
      if (isEmptyOrNil(categories)) {
        return [];
      } else {
        return formatCategoriesAndSubcategories(categories);
      }
    }
  };
};

/**
 * Fetches reimbursement by id, sequence number and settlement date
 *
 * @returns
 */
export const fetchClaimByTransactionId = (id, sequenceNumber, settlementDate) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const reimbursementResponse = await TransactionsApiHandlers.fetchClaimDetailsById(`${id}?seq_number=${sequenceNumber}&settlement_date=${settlementDate}`);
    if (reimbursementResponse.error) {
      const error = pathOr("", ["response", "data", "error"], reimbursementResponse);
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: error || "Something went wrong. Please try again.",
      });
      dispatch(toggleAppScreenLoader(false));
      return {};
    } else {
      const reimbursement = pathOr([], ["data", "data", "transaction"], reimbursementResponse);
      const receiptResponse = await getReceiptResponse(reimbursement);
      const formattedReimbursement =
        isEmptyOrNil(receiptResponse) || pathOr("", ["response", "data", "error"], receiptResponse) ? formatPretaxReimbursement(reimbursement, {}) : formatPretaxReimbursement(reimbursement, pathOr({}, ["data", "data", "receipt"], receiptResponse));
      dispatch(toggleAppScreenLoader(false));
      return formattedReimbursement;
    }
  };
};
