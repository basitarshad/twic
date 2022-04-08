import changeCase from "change-case";
import { format, startOfMonth } from "date-fns";
import { append, clone, curry, find, findIndex, forEach, forEachObjIndexed, groupBy, has, head, lensIndex, map, pathOr, pipe, prop, propEq, propOr, set, sort, uniq, whereEq } from "ramda";
import pick from "ramda/es/pick";
import { capitalizeFirstLetterOfEachWord } from "Utils/index";
import colors from "../Themes/Colors";
import {
  AccountTransactionCardType,
  ExpenseType,
  HowToAccessType,
  HsaAccountContributionDataType,
  MerchantDetailProps,
  OrderAndTransactionType,
  OrdersType,
  PostTaxClaimsDetailsType,
  PretaxClaimsDetailType,
  PretaxClaimsItemType,
  SubscriptionType,
  TransactionDetailsType,
  TwicCardTransactionType,
} from "../types";
import { findCountryCurrencyCode, getPointsToAmount, isEmptyOrNil, sortListByKey, dateToLLFormat } from "../Utils";
import VendorHelpers from "./vendors";

const getReimbursementsDetails = (reimbursements, wallets, stipendConfig, userCountry = "us"): PostTaxClaimsDetailsType => {
  return map((transaction) => {
    const employeeWalletId = pathOr("", ["reimbursement", "default_employee_wallet_id"], transaction);
    const walletUsed = head(pathOr([], ["reimbursement", "employee_wallets_used"], transaction));
    const status = propOr("", "status", transaction);
    const walletIdForDetails = status === "approved" ? propOr("", "employee_wallet_id", walletUsed) : employeeWalletId;
    const countryCurrency = findCountryCurrencyCode(userCountry);
    const timestamp = pathOr("", ["reimbursement", "transaction_date"], transaction);
    const approvedAmount_ = pathOr(-1, ["reimbursement", "amount_approved"], transaction);
    const approvedAmount = approvedAmount_ === -1 ? approvedAmount_ : getPointsToAmount({ points: approvedAmount_, stipendConfig });
    // const unit = stipendConfig.displayAsAmount ? '$' : 'pts';
    // const amountString = amountApproved > 0 ? getPriceString(getPointsToAmount({ points: amountApproved, stipendConfig }), unit, stipendConfig.displayAsAmount) : '';
    // const amountString = getPriceString({ price: getPointsToAmount({ points: amountApproved, stipendConfig }), unit: countryCurrency, displayAsAmount: true });
    const date = format(new Date(timestamp), "MMM, yyyy");
    const transactionDate = date !== "Invalid date" ? date : "-";
    const processedDate = pathOr("", ["reimbursement", "date_processed"], transaction);
    const nextApprovalDate = pathOr("", ["reimbursement", "next_approval_date"], transaction);
    const payoutStatus = pathOr("", ["reimbursement", "payout_status"], transaction);
    const claimStatusUpdationDate = propOr("", "updated", transaction);

    return {
      id: propOr("", "id", transaction),
      title: propOr("", "title", transaction),
      transactionDate,
      completeTransactionDate: timestamp,
      timestamp,
      amount: pathOr(0, ["reimbursement", "amount"], transaction),
      approvedAmount,
      status,
      receipt: pathOr("", ["reimbursement", "attachment", "0"], transaction),
      receipts: pathOr("", ["reimbursement", "attachment"], transaction),
      category: pathOr("N/A", ["reimbursement", "category"], transaction),
      note: pathOr("", ["reimbursement", "note"], transaction),
      employeeNote: pathOr("-", ["reimbursement", "employee_note"], transaction),
      reimbursementVendor: pathOr("", ["reimbursement", "reimbursement_vendor"], transaction),
      walletName: getWalletNameFromEmployeeWallet(wallets, walletIdForDetails),
      brandingColor: getBrandingColorFromEmployeeWallet(wallets, walletIdForDetails),
      walletAmount: getTotalAmountFromEmployeeWallet(wallets, walletIdForDetails),
      processedDate: !isEmptyOrNil(processedDate) ? format(new Date(processedDate), "MM/dd/yyyy") : "",
      nextApprovalDate: !isEmptyOrNil(nextApprovalDate) ? format(new Date(nextApprovalDate), "MM/dd/yyyy") : "",
      createdAt: formatDate(transaction.created),
      createdAtTimeStamp: propOr("", "created", transaction),
      employeeWalletId,
      payoutStatus,
      claimStatusUpdationDate,
      isMultiMonth: pathOr(false, ["reimbursement", "is_multi_month"], transaction),
      // for multi month reimbursement line items
      isLineItem: pathOr(false, ["reimbursement", "is_line_item"], transaction),
      // reference id for the parent reimbursement if this is a multi month reimbursement
      referenceId: propOr("", "reference_id", transaction),
      // reimbursement history for multi month reimbursements
      reimbursementHistory: propOr([], "reimbursement_history", transaction),
      // To differentiate between postTax and pretax
      isPretax: false,
    };
  }, reimbursements);
};

const formatInitialPretaxReimbursements = (pretaxReimbursements, userReimbursementMethod): PretaxClaimsItemType[] => {
  return pretaxReimbursements.map((reimbursement) => {
    return {
      amount: propOr(-1, "claim_amount", reimbursement),
      approvedAmount: propOr(-1, "claim_amount_approved", reimbursement),
      status: propOr("", "claim_status", reimbursement),
      createdAtTimeStamp: propOr("", "created", reimbursement),
      createdAt: formatDate(propOr("", "created", reimbursement)),
      id: propOr("", "id", reimbursement),
      isPretax: true,
      title: propOr("", "claim_category", reimbursement),
      transactionId: propOr("", "transaction_id", reimbursement),
      settlementDate: propOr("", "settlement_date", reimbursement),
      sequenceNumber: propOr("", "seq_number", reimbursement),
      reimbursementMethod: propOr("", "reimbursement_method", reimbursement) || userReimbursementMethod,
    };
  });
};

const getSubscriptionDetails = (subscriptionsList, vendorsList): SubscriptionType[] => {
  return map((subscription) => {
    const vendorId = propOr("", "vendor_id", subscription);
    const productId = propOr("", "product_id", subscription);

    return {
      title: propOr("", "vendor_title", subscription),
      createdAt: formatDate(subscription.created),
      createdAtTimeStamp: propOr("", "created", subscription),
      cancellationRequestedDate: formatDate(subscription.cancellation_requested_date),
      cancellationRequestedDateTimeStamp: propOr("", "cancellation_requested_date", subscription),
      nextBillDate: formatDate(subscription.next_bill_date),
      vendorId,
      productId,
      imageUri: findProductImage(vendorsList, vendorId, productId),
      status: subscription.status,
      amount: propOr("", "total_amount", subscription),
      usePoints: propOr("", "use_points", subscription),

      //Below properties are used for transactions details on transaction and subscription details screen
      id: propOr("", "id", subscription),
      name: propOr("", "title", subscription),
      howToAccess: findHowToAccess(vendorsList, vendorId, productId),
      websiteUrl: findVendorWebsiteUrl(vendorsList, vendorId),
    };
  }, subscriptionsList);
};

const formatPretaxReimbursement = (reimbursement, receipt?: any): PretaxClaimsDetailType => {
  const merchantName = propOr("", "merchant_name", reimbursement);
  const claimDescription = propOr("", "claim_description", reimbursement);
  const merchant = !isEmptyOrNil(merchantName) ? merchantName : claimDescription;
  const offsetAmount = propOr("", "offset_amount", reimbursement);
  const claimAmount_ = propOr("", "claim_amount", reimbursement);
  const claimAmount = typeof offsetAmount === "number" ? claimAmount_ - offsetAmount : claimAmount_;
  const createdAt = formatDate(propOr("", "created", reimbursement));
  const purchaseDate = formatDate(propOr("", "service_start_date", reimbursement)) || createdAt;
  return {
    id: propOr("", "id", reimbursement),
    title: propOr("", "claim_category", reimbursement),
    createdAt,
    transactionDate: formatDate(propOr("", "transaction_date", reimbursement)),
    amount: claimAmount,
    approvedClaimAmount: propOr(-1, "claim_amount_approved", reimbursement),
    offsetAmount,
    note: propOr("", "note", reimbursement),
    receipts: !isEmptyOrNil(receipt) ? [propOr("", "Base64", receipt)] : [],
    receiptTitle: propOr("", "FileName", receipt),
    status: propOr("", "claim_status", reimbursement),
    merchant,
    settlementDate: propOr("", "settlement_date", reimbursement),
    purchaseDate,
  };
};

const getUserOrderDetails = (orders, wallets): OrdersType[] => {
  return map((order): OrderAndTransactionType => {
    const vendorId = pathOr("", ["store", "vendor_code_name"], order);
    const productId = pathOr("", ["store", "product_code_name"], order);
    const name: string = propOr("", "title", order);
    const last4: string | null = pathOr(null, ["payment", "last4"], order);
    const transactionDate: string = formatDate(order.created);

    const usedWalletsList = pathOr([], ["payment", "employee_wallets_used"], order);
    const formatWalletsList = (transactionWalletsList) => getFormattedEmployeeWalletsUsed(wallets, transactionWalletsList);
    const formattedWalletsList = pipe(
      formatWalletsList,
      map((wallet: FormattedWalletData) => {
        const name = getWalletNameFromEmployeeWallet(wallets, wallet.walletId);
        return {
          ...wallet,
          name: !isEmptyOrNil(name) ? name : `${wallet.walletTypeId} Wallet`,
          brandingColor: getBrandingColorFromEmployeeWallet(wallets, wallet.walletId),
        };
      }),
    )(usedWalletsList);
    return {
      amount: pathOr(0, ["payment", "total"], order),
      transactionDate,
      createdAtTimeStamp: propOr("", "created", order),
      name,
      last4,
      //Below properties are used for order details on transaction and subscription details screen
      id: propOr("", "id", order),
      status: propOr("", "status", order),
      //@ts-ignore
      createdAt: formatDate(order.created),
      payment: {
        totalPayment: pathOr(0, ["payment", "total"], order),
        paymentOutOfPocket: pathOr(0, ["payment", "out_of_pocket"], order),
        pointsUsed: pathOr(0, ["payment", "points_used"], order),
        employeeWalletsUsed: formattedWalletsList,
      },
      vendorId,
      productId,
      salesTax: pathOr("", ["store", "order_detail", "sales_tax"], order),
      howToAccess: pathOr([], ["vendor", "hta"], order),
    };
  }, orders);
};

/**
 * Parses response from the endpoint.USER_PROFILE and returns required user profile data
 *
 * @param {*} response
 * @returns
 */
const formatHsaAccountDetails = (response): HsaAccountContributionDataType => {
  const { fetchHsaAccountSummary, fetchHsaAccountinvestments } = response;
  const hsaSummary = pathOr({}, ["data", "data", "summary"], fetchHsaAccountSummary);
  const hsaInvestments = pathOr({}, ["data", "data", "investments"], fetchHsaAccountinvestments);

  const getFieldName = new Map([
    ["employer_contributions", "Employer"],
    ["employee_contributions", "You"],
  ]);

  const getContributionsData = (object, totalValue) => {
    const contributionValues = pick(["employer_contributions", "employee_contributions"], object) as any;
    const contributionArray = Object.keys(contributionValues).map((key) => ({ name: getFieldName.get(key), value: contributionValues[key].toFixed(2) }));
    return contributionArray.reverse();
  };

  const CURRENT_YEAR = new Date().getFullYear();
  let contributions = {};
  if (!isEmptyOrNil(hsaSummary)) {
    const contributionsYearsData = pick(["year_to_date", "current_year", "prior_year"], hsaSummary) as any;
    contributions = {
      [CURRENT_YEAR.toString()]: {
        singleLimit: contributionsYearsData.current_year.single_limit.toFixed(2),
        familyLimit: contributionsYearsData.current_year.family_limit.toFixed(2),
        totalContribution: contributionsYearsData.current_year.total_contributions.toFixed(2),
        contributions: getContributionsData(contributionsYearsData.year_to_date, contributionsYearsData.current_year.single_limit),
      },
      [(CURRENT_YEAR - 1).toString()]: {
        singleLimit: contributionsYearsData.prior_year.single_limit.toFixed(2),
        familyLimit: contributionsYearsData.prior_year.family_limit.toFixed(2),
        totalContribution: contributionsYearsData.prior_year.total_contributions.toFixed(2),
        contributions: getContributionsData(contributionsYearsData.prior_year, contributionsYearsData.prior_year.single_limit),
      },
    };
  }
  const totalBalance = propOr(0, "total_balance", hsaInvestments) as number;
  const portfolioBalance = propOr(0, "portfolio_balance", hsaInvestments) as number;
  const accountNumber = pathOr("", ["trust_account", "number"], hsaSummary);
  const hsaAccountNumber: string = propOr("", "hsa_account_number", hsaSummary);
  const accountMinBalance = pathOr(0, ["trust_account", "min_balance"], hsaSummary);
  return {
    contributions,
    balances: {
      totalBalance: totalBalance.toFixed(2),
      portfolioBalance: portfolioBalance.toFixed(2),
    },
    account: {
      hsaAccountNumber,
      accountNumber,
      accountMinBalance,
    },
  };
};

const formatExpense = (response): ExpenseType[] => {
  return response.map((expense) => {
    return {
      companyId: expense.company_id,
      created: expense.created,
      description: expense.description,
      employeeAccountId: expense.employee_account_id,
      employeeId: expense.employee_id,
      id: expense.id,
      receiptLinks: expense.receipt_links,
      reimbursementVendor: expense.reimbursement_vendor,
      status: expense.status,
      amount: expense.total_amount,
      updated: expense.updated,
    };
  });
};

const getProductCategories = (product: MerchantDetailProps): Array<string> => {
  const categories = product.productsList && product.productsList.reduce((acc, item) => [...acc, ...item.categories], []);
  return uniq(categories);
};

type WalletTransactionsDetailsPaymentType = {
  employeeWalletsUsed: Array<{
    amount: number;
    brandingColor: string;
    companyWalletConfigurationId: string;
    name: string;
    walletId: string;
    walletTypeId: string;
  }>;
  paymentOutOfPocket: number;
  totalPayment: number;
};

type WalletTransactionsDetailsType = {
  amount: number;
  brandingColor: string;
  createdAt: string;
  createdAtTimeStamp: string;
  currentWalletAmount: number;
  employeeWalletId: string;
  howToAccess: HowToAccessType[];
  id: string;
  last4: string;
  name: string;
  payment: WalletTransactionsDetailsPaymentType;
  productId: string;
  status: string;
  transactionDate: string;
  transactionSubtype: string;
  transactionType: string;
  vendorId: string;
  walletName: string;
  walletTypeId: string;
};

const getWalletTransactionDetails = (transactions, wallets): WalletTransactionsDetailsType => {
  return map((transaction) => {
    const employeeWalletId = propOr("", "employee_wallet_id", transaction);
    const walletTypeId = propOr("", "wallet_type_id", transaction);
    const vendorId = pathOr("", ["transaction", "store", "vendor_code_name"], transaction);
    const productId = pathOr("", ["transaction", "store", "product_code_name"], transaction);
    const transactionSubtype = propOr("", "transaction_subtype", transaction);
    const name = propOr("", "title", transaction);
    const status = propOr("", "status", transaction);
    const last4 = pathOr("", ["transaction", "payment", "last4"], transaction);
    if (has("reimbursement", transaction)) {
      return getUserOrderDetails(transaction, wallets);
    }
    const usedWalletsList = pathOr([], ["transaction", "payment", "employee_wallets_used"], transaction);
    const formatWalletsList = (transactionWalletsList) => getFormattedEmployeeWalletsUsed(wallets, transactionWalletsList);
    const formattedWalletsList = pipe(
      formatWalletsList,
      map((wallet: FormattedWalletData) => {
        const name = getWalletNameFromEmployeeWallet(wallets, wallet.walletId);
        return {
          ...wallet,
          name: !isEmptyOrNil(name) ? name : `${wallet.walletTypeId} Wallet`,
          brandingColor: getBrandingColorFromEmployeeWallet(wallets, wallet.walletId),
        };
      }),
    )(usedWalletsList);

    return {
      walletTypeId,
      walletName: getWalletNameFromEmployeeWallet(wallets, employeeWalletId),
      amount: propOr(0, "amount", transaction),
      transactionType: propOr("", "transaction_type", transaction),
      transactionSubtype,
      currentWalletAmount: propOr(0, "current_wallet_amount", transaction),
      transactionDate: formatDate(transaction.transaction_date),
      createdAtTimeStamp: propOr("", "transaction_date", transaction),
      employeeWalletId,
      brandingColor: getBrandingColorFromEmployeeWallet(wallets, employeeWalletId),
      name,

      //Below properties are used for transactions details on transaction and subscription details screen
      id: pathOr("", ["transaction", "id"], transaction),
      createdAt: formatDate(transaction.created),
      payment: {
        totalPayment: pathOr(0, ["transaction", "payment", "total"], transaction),
        paymentOutOfPocket: pathOr(0, ["transaction", "payment", "out_of_pocket"], transaction),
        employeeWalletsUsed: formattedWalletsList,
      },
      last4,
      status,
      vendorId,
      productId,
      howToAccess: [],
    };
  }, transactions);
};

type GetUserWalletTransactionCardDetailsType = {
  walletTypeId: string;
  amount: number;
  transactionType: string;
  transactionSubtype: string;
  currentWalletAmount: number;
  transactionDate: string;
  createdAtTimeStamp: string;
  employeeWalletId: string;
  name: string;
  referenceTransactionType: string;
  referenceId: string;
  brandingColor: string;
};

const getUserWalletTransactionCardDetails = (transactions, wallets): GetUserWalletTransactionCardDetailsType[] => {
  return map((transaction): AccountTransactionCardType => {
    const employeeWalletId: string = propOr("", "employee_wallet_id", transaction);
    const brandingColor = getBrandingColorFromEmployeeWallet(wallets, employeeWalletId) as string;
    return {
      walletTypeId: propOr("", "wallet_type_id", transaction),
      amount: propOr(0, "amount", transaction),
      transactionType: propOr("", "transaction_type", transaction),
      transactionSubtype: propOr("", "transaction_subtype", transaction),
      currentWalletAmount: propOr(0, "current_wallet_amount", transaction),
      transactionDate: formatDate(transaction.transaction_date),
      createdAtTimeStamp: propOr("", "transaction_date", transaction),
      employeeWalletId,
      name: propOr("", "title", transaction),
      referenceTransactionType: propOr("", "reference_transaction_type", transaction),
      referenceId: propOr("", "reference_id", transaction),
      brandingColor,
    };
  }, transactions);
};

type TransactionPaymentType = {
  amount: number;
  payment_method: string;
  payment_source_id: string;
  payment_type: string;
};

const getPaymentOutOfPocket = (data: Array<TransactionPaymentType>) => {
  const paymentOutOfPocket = data.filter((item) => item.payment_method !== "employee_wallet");
  return paymentOutOfPocket.reduce((prev, cur) => {
    return (prev += cur.amount);
  }, 0);
};

const getPointsUsed = (data: Array<TransactionPaymentType>) => {
  const pointsUsed = data.filter((item) => item.payment_method === "employee_wallet");
  return pointsUsed.reduce((prev, cur) => {
    return (prev += cur.amount);
  }, 0);
};

const formatUserWalletTwicCardTransactionDetails = (transaction): TwicCardTransactionType => {
  const transactionPayments: Array<TransactionPaymentType> = propOr([], "transaction_payments", transaction);
  return {
    name: pathOr("", ["merchant_details", "name"], transaction),
    id: propOr("", "id", transaction),
    status: propOr("", "status", transaction),
    payment: {
      totalPayment: propOr(0, "total_amount", transaction),
      paymentOutOfPocket: getPaymentOutOfPocket(transactionPayments),
      pointsUsed: getPointsUsed(transactionPayments),
    },
  };
};

const getPretaxAccountTransactionDetails = (transactions) => {
  const sortedTransactions = sort((a, b) => {
    return new Date(b.service_start_date).getTime() - new Date(a.service_start_date).getTime();
  }, transactions);
  return map((transaction) => {
    return {
      accountType: propOr(0, "account_type", transaction),
      claimKey: propOr(0, "claim_key", transaction),
      claimant: propOr(0, "claimant", transaction),
      desc: propOr(0, "description", transaction),
      status: propOr(0, "status", transaction),
      amount: propOr(0, "transaction_amount", transaction),
      transactionId: propOr(0, "transaction_id", transaction),
      transactionDate: formatDate(transaction.service_start_date),
      transactionType: propOr("", "transaction_type", transaction),
      createdAtTimeStamp: propOr("", "service_start_date", transaction),
    };
  }, sortedTransactions);
};

const getTransactionDetails = (transactions, userWallets): TransactionDetailsType[] => {
  return map((transaction) => {
    const vendorId = pathOr("", ["store", "vendor_code_name"], transaction);
    const productId = pathOr("", ["store", "product_code_name"], transaction);
    const transactionWallets = pathOr([], ["payment", "employee_wallets_used"], transaction);

    return {
      id: propOr("", "id", transaction),
      name: propOr("", "title", transaction),
      note: propOr("", "subscription_note", transaction),
      status: propOr("", "status", transaction),
      reference: propOr("", "reference_id", transaction),
      type: propOr("", "type", transaction),
      vendorId,
      productId,

      createdAtTimeStamp: propOr("", "created", transaction),
      createdAt: formatDate(transaction.created),
      payment: {
        totalPayment: pathOr(0, ["payment", "total"], transaction),
        paymentOutOfPocket: pathOr(0, ["payment", "out_of_pocket"], transaction),
        employeeWalletsUsed: getFormattedEmployeeWalletsUsed(userWallets, transactionWallets),
      },
    };
  }, transactions);
};

// helper functions to format data
const formatDate = (timestamp) => (isEmptyOrNil(timestamp) ? "" : dateToLLFormat(new Date(timestamp)));

const findProductImage = (vendorsList, vendorId, productId): string => {
  const vendor = VendorHelpers.findVendorById({ vendorsList, vendorId });
  return VendorHelpers.getProductImage(vendor, productId);
};

const findVendorWebsiteUrl = (vendorsList, vendorId): string => {
  const vendor = VendorHelpers.findVendorById({ vendorsList, vendorId });
  return propOr("", "website_url", vendor);
};

const findHowToAccess = (vendorsList, vendorId, productId): HowToAccessType[] => {
  const vendor = VendorHelpers.findVendorById({ vendorsList, vendorId });
  return VendorHelpers.getHowToAccessForSpecificProduct(vendor, productId);
};

type FormattedWalletData = { amount; name; walletTypeId; walletId };
const getFormattedEmployeeWalletsUsed = curry((userWallets, wallets): FormattedWalletData[] => {
  return map((wallet) => {
    return {
      amount: propOr(0, "amount", wallet),
      name: getWalletNameFromEmployeeWallet(userWallets, wallet.employee_wallet_id),
      walletTypeId: propOr(0, "wallet_type_id", wallet),
      walletId: propOr("", "employee_wallet_id", wallet),
      companyWalletConfigurationId: propOr("", "company_wallet_configuration_id", wallet),
    };
  }, wallets);
});

const getWalletNameFromEmployeeWallet = (wallets, employeeWalletId): string => {
  const wallet = find(whereEq({ walletId: employeeWalletId }), wallets);
  return propOr("", "name", wallet);
};

const getBrandingColorFromEmployeeWallet = (wallets, employeeWalletId): string => {
  const wallet = find(whereEq({ walletId: employeeWalletId }), wallets);
  return propOr(colors.primary, "brandingColor", wallet);
};

const getTotalAmountFromEmployeeWallet = (wallets, employeeWalletId): number => {
  const wallet = find(whereEq({ walletId: employeeWalletId }), wallets);
  return propOr(0, "amount", wallet);
};

type SectionListData = {
  title: string | number | symbol;
  data: SubscriptionType;
  isCollapsed?: boolean;
  id?: number;
};

// group the subscriptions by status
const groupSubscriptionsByStatus = (subscriptions): SectionListData[] => {
  const statuses = ["pending", "active", "pending_cancel"];
  const groupByStatus = (subscription: any) => {
    if (statuses.includes(subscription.status)) return "all";
    else return subscription.status;
  };

  const formatGroupedSubscriptions = (list) => {
    let id = 0;
    let transformedList: Array<SectionListData> = [];
    forEachObjIndexed((subscriptions, status) => {
      // changing status to title case
      id++;
      const title = changeCase.titleCase(String(status).replace(/\_/g, " "));
      const sortKey = status === "pending_cancel" ? "cancellationRequestedDateTimeStamp" : "createdAtTimeStamp";
      const sortOrder = status === "pending_cancel" ? "desc" : "asc";
      //@ts-ignore
      const data: Array<object> = sortListByKey(sortOrder, sortKey)(subscriptions);
      transformedList = append(
        {
          data,
          title,
          isCollapsed: title === "Cancelled" ? true : false,
          id,
        },
        transformedList,
      );
    }, list);

    //@ts-ignore
    const sortedList: Array<SectionListData> = sortListByKey("asc", "title")(transformedList);

    return sortedList;
  };

  return pipe(groupBy(groupByStatus), formatGroupedSubscriptions)(subscriptions);
};

type GroupTransactionsByDateType = {
  createdAtTimeStamp: string;
  title: string;
  data: AccountTransactionCardType[];
};

// group the transactions by date for the sections list
const groupTransactionsByDate = (transactions): GroupTransactionsByDateType[] => {
  const formattedGroupTransactionsByDate = (transaction) => format(new Date(transaction.createdAtTimeStamp), "MMM dd, yyyy");

  const formatGroupedTransactions = (list) => {
    let transformedList: Array<SectionListData> = [];

    forEachObjIndexed((transactions, date) => {
      const firstTransaction = head(transactions);
      transformedList = append(
        {
          data: transactions,
          title: date,
          // @ts-ignore
          createdAtTimeStamp: prop("createdAtTimeStamp", firstTransaction),
        },
        transformedList,
      );
    }, list);

    return transformedList;
  };

  return pipe(groupBy(formattedGroupTransactionsByDate), formatGroupedTransactions, sortListByKey("desc", "createdAtTimeStamp"))(transactions);
};

const groupTransactionsByMonth = (transactions, formatMonth) => {
  const groupedList = groupBy((transaction: any) => format(new Date(startOfMonth(new Date(transaction.createdAtTimeStamp))), formatMonth), transactions);

  const formattedList = Object.keys(groupedList).map((group) => {
    return {
      title: group,
      data: groupedList[group],
    };
  });
  return formattedList;
};

const formatUserSubscriptionsList = (response, vendorsList) => {
  const subscriptions = pathOr([], ["data", "subscriptions"], response);
  return getSubscriptionDetails(subscriptions, vendorsList);
};

const formatUserWalletTransactionHistory = (response, wallets) => {
  const transactionsHistory = pathOr([], ["data", "employee_wallet_transactions"], response);
  const formattedTransactionsHistory = getUserWalletTransactionCardDetails(transactionsHistory, wallets);
  return groupTransactionsByMonth(formattedTransactionsHistory, "MMMM yyyy");
};

const formatPretaxAccountTransactionHistory = (response) => {
  const transactionsHistory = pathOr([], ["data", "transactions"], response);
  const formattedPretaxAccountTransactionsHistory = getPretaxAccountTransactionDetails(transactionsHistory);
  return groupTransactionsByMonth(formattedPretaxAccountTransactionsHistory, "MMM yyyy");
};

const formatUserOrders = (response, wallets): OrdersType[] => {
  const orders = pathOr([], ["data", "transactions"], response);
  const formattedTransactionsHistory = getUserOrderDetails(orders, wallets);
  return formattedTransactionsHistory;
};

const formatTransactionsHistory = (response, userWallets) => {
  const transactionsHistory = pathOr([], ["data", "transactions"], response);
  const formattedTransactionsHistory = getTransactionDetails(transactionsHistory, userWallets);
  return formattedTransactionsHistory;
};

const formatUserReimbursements = (params, wallets, stipendConfig, userCountry = "us") => {
  const reimbursements = pathOr([], ["data", "transactions"], params);
  return getReimbursementsDetails(reimbursements, wallets, stipendConfig, userCountry);
};

// get paginated list to display on the listing screen
const getPaginatedList = ({ currentList, newList }) => {
  const findIndexOfItem = (title, list) => findIndex(propEq("title", title))(list);

  let updatedList: Array<object> = clone(currentList);
  forEach((newItem: any) => {
    if (isEmptyOrNil(newItem)) return false;

    const { title, data } = newItem;
    const existingItem = find(propEq("title", title), currentList);

    // append into updated list if the item does not already exist
    if (isEmptyOrNil(existingItem)) {
      updatedList = append(newItem, updatedList);
    } else {
      // update the existing object in the current list and update the current list
      const existingIndex = findIndexOfItem(title, currentList);
      const existingIndexLens = lensIndex(existingIndex);
      const existingItemWithNewData = { ...existingItem, data: [...existingItem.data, ...data] };

      updatedList = set(existingIndexLens, existingItemWithNewData, updatedList);
    }
  }, newList);

  return updatedList;
};

const formatCategoriesAndSubcategories = (resp) => {
  const formattedList = resp.map(({ subcategory_id, subcategory_name, category_alias, alias, ...obj }) => ({
    subcategoryAlias: alias || "",
    subcategoryId: subcategory_id || "",
    subcategoryName: subcategory_name || "",
    categoryAlias: category_alias || "",
    subCategoryTitle: capitalizeFirstLetterOfEachWord(subcategory_id, "_"),
    walletCategoryId: obj.id,
    categoryName: obj.name,
    examples: obj.examples || [],
  }));
  return sortListByKey(
    "asc",
    "walletCategoryId",
    formattedList.sort((a, b) => (a.subCategoryTitle.toLowerCase() > b.subCategoryTitle.toLowerCase() ? 1 : -1)),
  );
};

export default {
  formatCategoriesAndSubcategories,
  formatUserReimbursements,
  formatUserSubscriptionsList,
  formatUserWalletTransactionHistory,
  formatPretaxAccountTransactionHistory,
  formatUserOrders,
  formatTransactionsHistory,
  groupSubscriptionsByStatus,
  formatDate,
  getReimbursementsDetails,
  getPaginatedList,
  getSubscriptionDetails,
  getWalletTransactionDetails,
  formatHsaAccountDetails,
  formatInitialPretaxReimbursements,
  formatPretaxReimbursement,
  formatUserWalletTwicCardTransactionDetails,
  getUserOrderDetails,
  formatExpense,
  getProductCategories,
};
