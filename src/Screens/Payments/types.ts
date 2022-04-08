import { AddressType, PretaxAccountsType, WalletType } from "../../types";

export type DirectDepositDisabledOnlyType = {
    userPreTaxAccounts: Array<PretaxAccountsType>;
    updatePaymentMethod: (reimbursementMethod: string) => void;
    wallets: Array<WalletType>;
    isAccountConnected: boolean;
    bankAccount: Object;
    userAddress: AddressType;
    reimbursementMethod: string;
  };


export type PretaxEnabledOnlyType = {
  userPreTaxAccounts: Array<PretaxAccountsType>;
  updatePaymentMethod: (reimbursementMethod: string) => void;
  wallets: Array<WalletType>;
  isAccountConnected: boolean;
  bankAccount: Object;
  userAddress: AddressType;
  reimbursementMethod: string;
};

export type PretaxPosttaxOrPosttaxEnabledType = {
  isAccountConnected: boolean;
  bankAccount: Object;
};

  

export type PaymentComponentSectionHeadingContentContainerProps = {
    alignItems: string;
    justifyContent?: string;
    width?: string;
  };

export type PaymentComponentActionButtonType = {
  needTouchableOpacity?: boolean;
  containerStyle?: object;
  primaryComponent: () => JSX.Element;
  secondaryComponent?: () => JSX.Element;
  onPress?: () => any;
};

export type PosttaxAccountsOnlyType = {
  wallets: Array<WalletType>;
};

export type ReimbursementMethodsType = {
  isCdhEnabled: boolean;
  userPreTaxAccounts: Array<PretaxAccountsType>;
  isDirectDepositEnabled: boolean;
  wallets: Array<WalletType>;
  isAccountConnected: boolean;
  bankAccount: Object;
  reimbursementMethod: string;
  userAddress: AddressType;
};