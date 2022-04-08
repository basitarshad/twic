import { CategoryAndSubcategoryType } from "types";

export type ClaimantType = {
  dependentId: string;
  dependentStatus: string;
  employeeFullName: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  relationship: string;
};

export type ReceiptType = {
  uri: string;
  base64: null | string | undefined;
  fileName: string;
  contentType: string;
  size: number;
};

export type FileType = {
  uri?: string;
  name: string;
  type: string;
  size: number;
};

//TODO: change to ReimbursementFormData
export type FormValuesType = {
  category: string;
  subcategory: string;
  default_employee_wallet_id: string;
  amount: string;
  note: string;
  reimbursement_vendor: string;
  is_multi_month: boolean;
  transaction_date: undefined | Date;
  receipts: ReceiptType[];
  files: FileType[];
  searchedCategory: string;
  category_alias: string;
  subcategory_alias: string;
  eligibleCategories: any;
  pretaxEligibleCategories: {
    value: string;
    key: string;
    label: string;
    walletCategoryId: string;
  }[];
  categoryId: string;
  subcategoryId: string;
  pretaxCategory: string;
  selectedCategory: EligibleCategoriesType | Object;
  pretaxSelected: boolean;
  claimant: ClaimantType;
};

export type FieldNameTypes =
  | "category"
  | "searchedCategory"
  | "subcategory"
  | "default_employee_wallet_id"
  | "amount"
  | "note"
  | "reimbursement_vendor"
  | "is_multi_month"
  | "transaction_date"
  | "receipts"
  | "files"
  | "category_alias"
  | "subcategory_alias"
  | "eligibleCategories"
  | "categoryId"
  | "pretaxCategory"
  | "subcategoryId"
  | "selectedCategory";

export type EligibleCategoriesType = {
  value: string;
  label: string;
  walletCategoryId: string;
  categoryName: string;
} & CategoryAndSubcategoryType;

export type EligibleCategoriesWithCountType = { count: number } & EligibleCategoriesType;

export type CategoriesListType = {
  bestMatches: EligibleCategoriesWithCountType[];
  searchedCategories: EligibleCategoriesWithCountType[];
};

export type UploadReceiptType = {
  values: FormValuesType;
  touched: any;
  errors: any;
  handleFieldChange: (fieldName: FieldNameTypes, value: any) => void;
  setFieldError: (field: string, value: string | undefined) => void;
};
