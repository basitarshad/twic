export type PostTaxDetailsStateType = {
  reimbursementsCollapsed: boolean;
  isVisibleZoomView: {
    visibility: boolean;
    index: number;
  };
  xScrollPosition: number;
  claim: {
    id: string;
    title: string;
    status: string;
    receipts: Array<string>;
    createdAt: string;
    amount: number;
    isLineItem: boolean;
    referenceId: string;
    walletName: string;
    employeeNote: string;
    note: string;
    isPretax: boolean;
    receiptTitle: string;
    transactionId: string;
    settlementDate: string;
    sequenceNumber: string;
  };
  loader: boolean;
  parentReimbursement: Object;
  reimbursementHistory: Array<any>;
};

export type ReimbursementDetailScreenType = {
  route: any;
  getTransactionById: (transactionId: string) => any;
  fetchPretaxReimbursementByIdAndItsReceipt: (params: string) => any;
  fetchClaimByTransactionId: (transactionId: string, sequenceNumber: string, settlementDate: string) => any;
};
export type ReimbursementDetailsReceiptType = {
  name: string;
  uri: string;
};
export type ReimbursementDetailsReceiptsWithTypeType = {
  image: ReimbursementDetailsReceiptType[];
  pdf: ReimbursementDetailsReceiptType[];
};
export type ReimbursementDetailScreenSectionContentContainerProps = {
  alignItems: string;
  justifyContent?: string;
};
