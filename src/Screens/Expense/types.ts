export type FileType = {
  uri: string;
  name: string;
  type: string;
};

export type FormattedWalletType = {
  value: string;
  label: string;
  balance: string;
  walletTypeId: string;
};

export type FormValuesType = {
  amount: string;
  walletId: string;
  description: string;
  reimbursementVendor: string;
  receiptDate: string;
  files: FileType[];
};

export type ExpenseFormFieldContainerType = {
  marginBottom?: number;
};
