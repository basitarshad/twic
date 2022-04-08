import React from "react";
import { PretaxAccountPlan, PretaxAccountsType, TwicCardType, WalletCardProps } from "../../types";
import { IconWithTextProps } from "Components/Commons/IconWithText";

// PostTaxAccountDetailScreen

export type PostTaxAccountState = {
  totalPages: number;
  currentPage: number;
  currentList: Array<object>;
  isPageLoading: boolean;
  loading: boolean;
};

export type PostTaxAccountTransactionsProps = {
  fetchAccountTransactionHistory: (params: { currentPage: number }) => Promise<any | null>;
  accountDetails: WalletCardProps;
};
export type PostTaxAccountGetTransactions = {
  currentPage: number;
  currentList: Array<object>;
};

// PreTaxAccountDetailScreen
export type PreTaxAccountTransactionsHeaderType = {
  accountDetails: PretaxAccountsType;
  planYear: string;
  setPlanYear: (value: string) => void;
  accountsYearList: any[];
};
export type PreTaxAccountState = {
  totalPages: number;
  currentPage: number;
  currentList: Array<object>;
  isPageLoading: boolean;
  loading: boolean;
};

export type PreTaxAccountGetTransactions = {
  currentPage: number;
  currentList: Array<object>;
};
//Accounts Screen Types
export type AccountsScreenType = {
  userWallets: WalletCardProps[];
  userPretaxAccounts: PretaxAccountsType[];
  userCountry: string;
  screenLoader: boolean;
};
// AccountTransactionHeader
export type AccountTransactionsHeaderType = {
  accountDetails: PretaxAccountsType;
  showTransactionsTitle: boolean;
  pretaxPlan?: PretaxAccountPlan;
};
// Accounts Card Component Types
export type AccountCardType = {
  userCountry: string;
  account: PretaxAccountsType | WalletCardProps;
};

export type AccountCardAmountContainerProps = {
  backgroundColor?: string; //Colors
};

export type AccountCardBorderContainerProps = {
  borderColor?: string;
};

export type AccountCardSectionProps = {
  flex?: number; //Colors
  alignItems?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
};

//Detailed Account Info Card Component Types
export type SaveActionButtonsContainerStyleType = {
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between";
};

export type DetailedAccountInfoCardHeaderType = {
  description: string;
  accountDetails: PretaxAccountsType | WalletCardProps;
  selectedAccountProperty: string;
};

//TODO: Merge Common types into single types
//TODO: Change Type to Props
export type DetailedAccountInfoCardBodySectionProps = {
  flex?: number; //Colors
  alignItems?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
};

export type DetailedAccountInfoCardBodyType = {
  amount: number;
  icon: any;
  backgroundImage: any;
  userCountry: string;
};

export type ActionButtonsType = {
  walletId: string;
  flexAccountId: string;
  isPretax: boolean;
  secondaryButtonOnClick: () => void;
  isTwicCardPaymentAllowed: boolean;
  showClaimButton: boolean;
};

export type ContentSectionContainerProps = {
  borderBottomWidth?: number;
  paddingTop?: number;
};

export type PretaxAccountDetailsDrawerProps = {
  planEndDate: string;
  gracePeriodEndDate: string;
  planStartDate: string;
  runoutPeriodDate: string;
  accountType: string;
  accountDisplayHeader: string;
  companyName: string;
};

export type DetailedAccountInfoCardType = {
  account: PretaxAccountsType | WalletCardProps;
  pretaxPlan?: PretaxAccountPlan;
};

//ViewTwicCard types
export type TwicCardDetailsType = {
  card: TwicCardType | any;
  onCloseHandler: () => void;
};

export type ViewTwicCardType = {
  buttonWidth: number;
  secondaryButtonContainerStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  buttonLabel?: string;
  buttonColor?: string;
  buttonShadowProps?: object;
  iconColor?: string;
  usePrimaryButton?: boolean;
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
