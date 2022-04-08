import { propOr, find, propEq, toLower } from "ramda";
import { APP_CONSTANTS } from "Constants";
import { isEmptyOrNil } from "Utils";
import * as yup from "yup";
import { EligibleCategoriesType, EligibleCategoriesWithCountType } from "./types";
import { AppNotification } from "Components";

export const validationSchema = (isPreTaxWallet = false) =>
  yup.object().shape({
    default_employee_wallet_id: yup.string().nullable().strict(true).required("Please select an account"),
    category: yup
      .string()
      .nullable()
      .test("match", "Category is required", function (category) {
        const eligibleCategories = this.parent.eligibleCategories;
        if (!isEmptyOrNil(eligibleCategories) && isEmptyOrNil(category)) {
          return this.createError({
            message: "Category is required",
            path: "category",
          });
        }
        return true;
      }),
    pretaxCategory: yup
      .string()
      .nullable()
      .test("match", "Category is required", function (category) {
        const eligibleCategories = this.parent.pretaxEligibleCategories;
        if (!isEmptyOrNil(eligibleCategories) && isEmptyOrNil(category)) {
          return this.createError({
            message: "Category is required",
            path: "pretaxCategory",
          });
        }
        return true;
      }),
    searchedCategory: yup.string().nullable(),
    subcategory_alias: yup.string().nullable().strict(true).required(""),
    category_alias: yup.string().nullable().strict(true).required(""),
    amount: yup.string().matches(APP_CONSTANTS.AMOUNT_GER_EXP, "Amount must be a number").required("Amount is required"),
    reimbursement_vendor: yup.string().required("Please provide vendor name"),
    note: yup.string().required("Please provide a short description"),
    receipts: yup
      .array()
      .required("Please upload a receipt")
      .min(1)
      .of(
        yup
          .object()
          .shape({
            fileName: yup.string().required("Please upload a receipt"),
            uri: yup.string(),
            base64: yup.string().required("File is not being converted to base64"),
            contentType: yup.string(),
          })
          .label("File"),
      ),
    files: yup
      .array()
      .required("Please upload a receipt")
      .min(1)
      .of(
        yup
          .object()
          .shape({
            name: yup.string().required("Please upload a receipt"),
            uri: yup.string(),
            type: yup.string(),
          })
          .label("File"),
      ),
    transaction_date: yup.date().required("Please select Purchase Date"),
    pretaxSelected: yup.boolean(),
    ...(isPreTaxWallet && {
      claimant: yup
        .object()
        .shape({
          dependentId: yup.string().required(),
          dependentStatus: yup.string(),
          employeeFullName: yup.string(),
          firstName: yup.string().required(),
          lastName: yup.string().required(),
          middleInitial: yup.string(),
          relationship: yup.string(),
        })
        .required("Claimant is required"),
    }),
  });

const filterCategoriesLogic = (categoryObj, splitValue) => {
  // THIS REDUCE LOGIC IS FOR COUNT. IF WE ARE SURE TO NOT USE IT THEN REMOVE THIS LOGIC
  // CURRENTLY WE ARE NOT USING THE THE COUNT
  const categoryObjWithCount = splitValue.reduce(
    (acc, val) => {
      if (categoryObj.subcategoryAlias || categoryObj.subcategoryId || categoryObj.subcategoryId || categoryObj.categoryAlias || categoryObj.walletCategoryId || categoryObj.subcategoryAlias) {
        if (
          categoryObj.subcategoryAlias.toLowerCase().includes(val.toLowerCase()) ||
          categoryObj.subcategoryId.toLowerCase().includes(val.toLowerCase()) ||
          categoryObj.categoryAlias.toLowerCase().includes(val.toLowerCase()) ||
          categoryObj.walletCategoryId.toLowerCase().includes(val.toLowerCase()) ||
          categoryObj.subcategoryAlias.toLowerCase().includes(val.toLowerCase())
        ) {
          return { ...acc, count: acc.count + 1 };
        }
      }
      return acc;
    },
    { ...categoryObj, count: 0 },
  );
  if (categoryObjWithCount.count !== 0) return categoryObjWithCount;
  return null;
};

export const filterBestMatches = (note: string, eligibleCategories: EligibleCategoriesType[]) => {
  if (!isEmptyOrNil(note)) {
    const splitValue = note.split(" ").filter((val) => !isEmptyOrNil(val));
    const searchedCategories = eligibleCategories.reduce((acc: EligibleCategoriesWithCountType[], categoryObj) => {
      const filteredValue = filterCategoriesLogic(categoryObj, splitValue);
      if (!isEmptyOrNil(filteredValue)) return [...acc, filteredValue];
      return acc;
    }, []);
    return searchedCategories;
  } else {
    return [];
  }
};
export const getWalletCategories = (wallet) => {
  switch (toLower(wallet.accountTypeClassCode)) {
    case "transit":
      return APP_CONSTANTS.COMMUTER_CATEGORIES;
    case "parking":
      return APP_CONSTANTS.PARKING_CATEGORIES;
    case "other":
      return toLower(wallet.accountType) === "dca" ? APP_CONSTANTS.DEPENDENT_CARE_CATEGORIES : APP_CONSTANTS.PRETAX_CATEGORIES;
    default:
      return APP_CONSTANTS.PRETAX_CATEGORIES;
  }
};
export const filterSearchedInputCategories = (searchedCategory: string, eligibleCategories: EligibleCategoriesType[]) => {
  if (!isEmptyOrNil(searchedCategory)) {
    const splitValue = searchedCategory.split(" ").filter((val) => !isEmptyOrNil(val));
    const searchedCategories = eligibleCategories.reduce((acc: EligibleCategoriesWithCountType[], categoryObj) => {
      const filteredValue = filterCategoriesLogic(categoryObj, splitValue);
      if (!isEmptyOrNil(filteredValue)) return [...acc, filteredValue];
      return acc;
    }, []);
    return searchedCategories;
  } else {
    return eligibleCategories;
  }
};

const findInitialWalletValue = (walletId: string, userWallets): string => {
  const wallet = userWallets.find((wallet) => wallet.value === walletId) || {};
  return propOr("", "value", wallet);
};

const checkPretaxSelectedOnInitialRender = (accountType: string) => (accountType === "pretax" ? true : false);

export const getFormInitialValues = (walletId, userWallets, accountType) => ({
  // POSTTAX ACCOUNT
  categoryId: "",
  subcategoryId: "",
  category: "",
  subcategory: "",
  searchedCategory: "",
  subcategory_alias: "",
  category_alias: "",
  eligibleCategories: [],
  selectedCategory: {},

  // PRETAX ACCOUNT
  pretaxCategory: "",
  pretaxEligibleCategories: [],

  // COMMON
  default_employee_wallet_id: findInitialWalletValue(walletId, userWallets),
  amount: "",
  note: "",
  reimbursement_vendor: "",
  is_multi_month: false,
  transaction_date: undefined,
  receipts: [],
  files: [],
  pretaxSelected: checkPretaxSelectedOnInitialRender(accountType),
  claimant: {
    dependentId: "",
    dependentStatus: "",
    employeeFullName: "",
    firstName: "",
    lastName: "",
    middleInitial: "",
    relationship: "",
  },
});

export const findRequiredWallet = (walletId: string, userWallets) => find(propEq("value", walletId), userWallets) || {};

export const appErrorNotificationForFilePicker = (error) => {
  const sizeLimit = "Kindly upload files with size less than 10MB. ";
  const incompatibleFile = "File type incompatible. Please upload either a JPG, JPEG, PNG, PDF, HEIC file ";
  let description = "";
  switch (error) {
    case "incompatible_file":
      description = incompatibleFile;
      break;
    case "size_limit_reached":
      description = sizeLimit;
      break;
    case "incompatible_file&size_limit_reached":
      description = sizeLimit + "\n" + incompatibleFile;
      break;
  }
  if (description)
    AppNotification.toggleErrorNotification({
      message: "Error",
      description,
    });
};

export const pickerFilesFormatter = (files, fileTypeAttribute) => {
  const updatedFiles = files.filter((file) => ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/heic"].includes(file[fileTypeAttribute]));
  let error = "";
  if (updatedFiles.length < files.length) {
    error = "incompatible_file";
  }
  const formattedFiles = updatedFiles.filter((file) => (file.size ? file.size <= 10000000 : false));
  if (formattedFiles.length < updatedFiles.length) {
    error += error ? "&size_limit_reached" : "size_limit_reached";
  }
  appErrorNotificationForFilePicker(error);

  return { formattedFiles };
};
