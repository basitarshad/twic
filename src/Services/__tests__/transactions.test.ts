import { TransactionsHelpers } from "../index";
import {
  hsaAccountDetailsFormattedData,
  hsaAccountExpensesApiResponse,
  hsaAccountExpensesFormattedData,
  hsaAccountInvestmentsApiResponse,
  hsaAccountSummaryApiResponse,
  productResponse,
  pretaxClaimApiResponse,
  pretaxClaimReceiptApiResponse,
  pretaxClaimFormatterData,
  ordersApiResponse,
  walletsApiResponse,
  ordersListFormatted,
  posttaxReimbursementsListApiResponse,
  stipendConfig,
  userReimbursementsFormattedData,
  subscriptionsList,
  vendorsList,
  formattedSubscriptionList,
  posttaxWalletTransactionsApiResponse,
  userWalletTransactionHistoryFormatted,
} from "../__mock__/transactions.mock";
import {
  formattedSubscriptionByStatus,
  formattedTransactionsHistory,
  formattedUserOrders,
  pretaxAccountTransactionHistoryFormatted,
  pretaxTransactionsListApi,
  subscriptionsTransactionHistoryApiResponse,
  groupByStatusSubscription,
  userOrdersList,
  formattedPostTaxReimbursements,
  postTaxReimbursementsApiResponse,
  previousPaginatedAccountTransactions,
  newPaginatedAccountTransactions,
  combinedFormattedPaginatedList,
  walletTransactionsDetails,
  walletTransactionDetailsFormatted,
  pretaxReimbursementsApiResponse,
  pretaxReimbursementsFormatted,
  postTaxReimbursementDetails,
  formattedPostTaxReimbursement,
  userWalletTwicCardTransactionDetails,
  formattedUserWalletTwicCardTransactionDetails,
} from "../__mock__/transactionsFileTwo.mock";

describe("transactions.ts", () => {
  it("Format Product Categories information", () => {
    const response = TransactionsHelpers.getProductCategories(productResponse);
    expect(response).toEqual(["smart_devices"]);
  });

  it("Format HSA Account: Expenses information", () => {
    const response = TransactionsHelpers.formatExpense(hsaAccountExpensesApiResponse);
    expect(response).toEqual(hsaAccountExpensesFormattedData);
  });

  it("Format HSA Account: Detailed information", () => {
    const response = TransactionsHelpers.formatHsaAccountDetails({
      fetchHsaAccountSummary: hsaAccountSummaryApiResponse,
      fetchHsaAccountinvestments: hsaAccountInvestmentsApiResponse,
    });
    expect(response).toEqual(hsaAccountDetailsFormattedData);
  });

  it("Format Pretax reimbursement", () => {
    const response = TransactionsHelpers.formatPretaxReimbursement(pretaxClaimApiResponse, pretaxClaimReceiptApiResponse);
    expect(response).toEqual(pretaxClaimFormatterData);
  });

  it("Format Orders listing", () => {
    const response = TransactionsHelpers.getUserOrderDetails(ordersApiResponse, walletsApiResponse);
    expect(response).toEqual(ordersListFormatted);
  });

  it("Format Reimbursements list", () => {
    const response = TransactionsHelpers.formatUserReimbursements(
      {
        data: {
          transactions: posttaxReimbursementsListApiResponse,
        },
      },
      walletsApiResponse,
      stipendConfig,
      "us",
    );
    expect(response).toEqual(userReimbursementsFormattedData);
  });

  it("Format Subscriptions list", () => {
    const response = TransactionsHelpers.formatUserSubscriptionsList(
      {
        data: {
          subscriptions: subscriptionsList,
        },
      },
      vendorsList,
    );
    expect(response).toEqual(formattedSubscriptionList);
  });

  it("Format Posttax accounts transactions list", () => {
    const response = TransactionsHelpers.formatUserWalletTransactionHistory(
      {
        data: {
          employee_wallet_transactions: posttaxWalletTransactionsApiResponse,
        },
      },
      walletsApiResponse,
    );
    expect(response).toEqual(userWalletTransactionHistoryFormatted);
  });

  it("Format Pretax accounts transactions list", () => {
    const response = TransactionsHelpers.formatPretaxAccountTransactionHistory({
      data: {
        transactions: pretaxTransactionsListApi,
      },
    });
    expect(response).toEqual(pretaxAccountTransactionHistoryFormatted);
  });

  it("Format users orders list", () => {
    const response = TransactionsHelpers.formatUserOrders(
      {
        data: {
          transactions: userOrdersList,
        },
      },
      walletsApiResponse,
    );
    expect(response).toEqual(formattedUserOrders);
  });

  it("Format subscriptions transaction history list", () => {
    const response = TransactionsHelpers.formatTransactionsHistory(
      {
        data: {
          transactions: subscriptionsTransactionHistoryApiResponse,
        },
      },
      walletsApiResponse,
    );
    expect(response).toEqual(formattedTransactionsHistory);
  });

  it("Group subscription by status", () => {
    const response = TransactionsHelpers.groupSubscriptionsByStatus(groupByStatusSubscription);
    expect(response).toEqual(formattedSubscriptionByStatus);
  });

  describe("Format date", () => {
    it("With empty values", () => {
      const response = TransactionsHelpers.formatDate("");
      expect(response).toEqual("");
    });

    it("With time stamp", () => {
      const response = TransactionsHelpers.formatDate(1622527942976);
      expect(response).toEqual("Jun 1, 2021");
    });
  });

  it("Get paginated transactions list", () => {
    const response = TransactionsHelpers.getPaginatedList({
      currentList: previousPaginatedAccountTransactions,
      newList: newPaginatedAccountTransactions,
    });
    expect(response).toEqual(combinedFormattedPaginatedList);
  });

  it("Get wallet transaction details screen when moved after checkout", () => {
    const response = TransactionsHelpers.getWalletTransactionDetails(walletTransactionsDetails, walletsApiResponse);
    expect(response).toEqual(walletTransactionDetailsFormatted);
  });

  it("Pretax reimbursements list", () => {
    const response = TransactionsHelpers.formatInitialPretaxReimbursements(pretaxReimbursementsApiResponse, "");
    expect(response).toEqual(pretaxReimbursementsFormatted);
  });

  it("Post tax reimbursement formatter", () => {
    const response = TransactionsHelpers.formatUserWalletTwicCardTransactionDetails(userWalletTwicCardTransactionDetails);
    expect(response).toEqual(formattedUserWalletTwicCardTransactionDetails);
  });
});
