import { HsaAccountContributionDataType, PretaxAccountsType, WalletCardProps } from "../../../../types";

//HsaAccountCard Types
export type HsaAccountCardsType = {
  accountDetails: PretaxAccountsType;
  showTransactionsTitle?: boolean;
};

// HsaAccountCardContribution Types
export type ContributionsYTDType = {
  totalContribution: string;
  userCountry: string;
};

export type HsaTransactionsTabStyledType = {
  activeTab: boolean;
};
export type ContributionDetailsBarProps = {
  backgroundColor?: string;
  flex?: number;
};

export type ContributionDetailsBarDetailsProps = {
  borderBottomWidth?: number;
  paddingTop?: number;
};

export type ContributionDetailsBarCheckBoxProps = {
  backgroundColor?: string;
};

export type ContributionType = {
  name: string;
  value: string;
};

export type ContributionDetailsType = {
  contributionsData: { contributions: ContributionType[]; familyLimit: string; singleLimit: string; totalContribution: string };
  totalLimit: string;
  userCountry: string;
  year: string;
};

export type YearToDatePickerType = {
  year: string;
  setFieldValue: (field: "year", value: any, shouldValidate?: boolean | undefined) => void;
  items: (string | number)[];
};

export type HsaAccountCardContributionDetailsType = {
  hsaAccountData: HsaAccountContributionDataType;
  year: string;
  setFieldValue: (field: "year", value: any, shouldValidate?: boolean | undefined) => void;
  userCountry: string;
};

// HsaAccountCardHeaderInfo Types
export type AccountLogoAndTitleSectionProps = {
  flex?: number; //Colors
  alignItems?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
};

export type HsaAccountCardHeaderType = {
  accountDetails: PretaxAccountsType;
  hsaAccountData: HsaAccountContributionDataType;
  userCountry: string;
};

// HsaAccountCardInvestment Types
export type HelpTooltipContainerProps = {
  paddingTop?: number;
};

//HsaAccountDetails Types
export type ContentSectionContainerProps = {
  borderBottomWidth?: number;
  paddingTop?: number;
};

export type HsaAccountDetailsType = {
  accountDetails: PretaxAccountsType;
  hsaAccountData: HsaAccountContributionDataType;
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
