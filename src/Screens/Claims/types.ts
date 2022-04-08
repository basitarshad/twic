import { PostTaxClaimsDetailsType, PretaxClaimsDetailType, PretaxClaimsItemType } from "types";

export type TileSectionProps = {
  flex?: number; //Colors
  alignItems?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
};
export type PostTaxTransactionsItemType = {
  transaction: {
    amount: number;
    brandingColor: string;
    createdAtTimeStamp: Date;
    currentWalletAmount: number;
    employeeWalletId: string;
    name: string;
    referenceId: string;
    referenceTransactionType: string;
    transactionDate: string;
    transactionSubtype: string;
    transactionType: string;
    walletTypeId: string;
  };
};
export type PreTaxTransactionsItemType = {
  transaction: {
    accountType: string;
    amount: number;
    claimKey: string;
    claimant: string;
    createdAtTimeStamp: string;
    desc: string;
    status: string;
    transactionDate: string;
    transactionId: string;
    transactionType: string;
  };
};
export type HowDoISectionContentContainerProps = {
  alignItems: string;
  justifyContent?: string;
  flex?: number;
};

export type HowToAccessSectionContentContainerProps = {
  alignItems: string;
  justifyContent?: string;
  flex?: number;
};

export type PaymentSectionRowContainerType = {
  marginTop?: number;
};

export type ReimbursementTileRowProps = {
  paddingTop?: number;
};
export type ReimbursementCardSectionProps = {
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
  paddingTop?: number;
} & TileSectionProps;

export type ReimbursementSectionDefaultState = {
  totalPages: number;
  currentPage: number;
  currentList: Array<object>;
  isPageLoading: boolean;
  storedPretaxReimbursements: Array<object>;
  storedPosttaxReimbursements: Array<object>;
  refreshToken: string;
  refreshing: boolean;
  initialLoader: boolean;
};

export type SubscriptionTileRowProps = {
  paddingTop?: number;
};

export type SubscriptionCardSectionProps = {
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
  paddingTop?: number;
} & TileSectionProps;

export type PastPaymentsSectionContainerProps = {
  alignItems: string;
  justifyContent?: string;
};

export type SubscriptionDefaultState = {
  totalPages: number;
  currentPage: number;
  currentList: Array<object>;
  isPageLoading: boolean;
  emptyScreenLoader: boolean;
};

export type TransactionTabContainerType = {
  isSelected: boolean;
};

export type WalletTransactionTileSectionProps = {
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
};

export type walletTransactionHistoryDefaultState = {
  totalPages: number;
  currentPage: number;
  currentList: Array<object>;
  isPageLoading: boolean;
  emptyScreenLoader: boolean;
};

export type ExpenseDetailsReceiptTypesType = {
  image: ExpenseDetailsReceiptType[];
  pdf: ExpenseDetailsReceiptType[];
};

export type ExpenseDetailsReceiptType = {
  name: string;
  uri: string;
};

export type ExpenseDetailsStateType = {
  isVisibleZoomView: {
    visibility: boolean;
    index: number;
  };
  expense: {
    createdAt: string;
    amount: string;
    note: string;
    reimbursementVendor: string;
    receipts: Array<string>;
  };
};

export type ExpenseDetailsTypes = {
  route: any;
  getTransactionById: (transactionId: string) => any;
  fetchPretaxReimbursementByIdAndItsReceipt: (params: string) => any;
  fetchClaimByTransactionId: (transactionId: string, sequenceNumber: string, settlementDate: string) => any;
};

export type ReceiptListData = {
  image: ReceiptItemDataType[];
  pdf: ReceiptItemDataType[];
};

export type ReceiptItemDataType = {
  name: string;
  uri: string;
};

export type ReimbursementDetailsStateType = {
  reimbursementsCollapsed: boolean;
  loader: boolean;
  reimbursementHistory: Array<any>;
};

export type PreTaxClaimDetailsStateType = {
  reimbursementsCollapsed: boolean;
  claim: PretaxClaimsDetailType;
  loader: boolean;
  reimbursementHistory: Array<object>;
};

export type ReimbursementDetailScreenType = {
  route: any;
  getTransactionById: (transactionId: string) => any;
  fetchPretaxReimbursementByIdAndItsReceipt: (params: string) => any;
  fetchClaimByTransactionId: (transactionId: string, sequenceNumber: string, settlementDate: string) => any;
};

export type ReimbursementPolicyStateType = {
  reimbursementPolicyLink?: string,
  name?: string;
}