import * as React from "react";
import { View } from "react-native";
import { propOr, map } from "ramda";
import { useDispatch } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { Picker } from "twic_mobile_components";

import { fetchPosttaxWalletCategories } from "Actions";
import { isEmptyOrNil, sortListByKey } from "Utils";

import { EligibleCategoriesType } from "./types";
import { findRequiredWallet, validationSchema } from "./meta";
import { FormFieldContainer } from "Components";

const createCategories = async (selectedWallet, dispatch) => {
  const walletId = propOr("", "value", selectedWallet);

  if (!isEmptyOrNil(walletId)) {
    return await dispatch(fetchPosttaxWalletCategories(walletId));
  }
};
const getPretaxCategories = (selectedWallet) => {
  const categoriesList = selectedWallet.defaultCategories;
  const eligibleCategories = sortListByKey(
    "asc",
    "label",
    map(
      (category) => ({
        key: category,
        walletCategoryId: category,
        label: category,
        value: category,
      }),
      categoriesList,
    ),
  );
  return eligibleCategories;
};

const createCategoriesOnInitialCall = async (walletId: string, accountType: string, userWallets, dispatch) => {
  const wallet = findRequiredWallet(walletId, userWallets);
  return accountType === "pretax" ? getPretaxCategories(wallet) : await createCategories(wallet, dispatch);
};

export const AccountsPicker = ({ isMultiMonth, setValidationSchemaState, setCategoryLoader, values, userWallets, errors, setValues, formFieldsTopMargin }) => {
  const dispatch = useDispatch();
  const route: any = useRoute();
  const { walletId, account: accountType } = route.params;

  React.useEffect(() => {
    async function setCategoriesForInitialSelectedWallet() {
      const categories = await createCategoriesOnInitialCall(walletId, accountType, userWallets, dispatch);
      if (values.pretaxSelected) {
        setValidationSchemaState(validationSchema(true));
        setValues({ ...values, pretaxEligibleCategories: categories });
      } else {
        setValidationSchemaState(validationSchema(false));
        setValues({ ...values, eligibleCategories: categories });
      }
    }
    if (!isEmptyOrNil(walletId)) setCategoriesForInitialSelectedWallet();
  }, []);

  const onWalletChange = async (walletId: string, formValues, setValues: (values) => void) => {
    const selectedWallet = findRequiredWallet(walletId, userWallets);
    let is_multi_month = false;
    const defaultValues = {
      pretaxSelected: false,
      default_employee_wallet_id: walletId,
      category: "",
      subcategory: "",
      categoryId: "",
      subcategoryId: "",
      pretaxCategory: "",
      pretaxEligibleCategories: [],
      eligibleCategories: [],
      selectedCategory: {},
    };

    if (!isEmptyOrNil(selectedWallet)) {
      if (!isEmptyOrNil(formValues.amount)) {
        is_multi_month = isMultiMonth(formValues.amount, selectedWallet);
      }
      if (selectedWallet.isPretax) {
        setValidationSchemaState(validationSchema(true));
        const eligibleCategories = getPretaxCategories(selectedWallet);

        setValues({
          ...formValues,
          ...defaultValues,
          pretaxEligibleCategories: eligibleCategories,
          pretaxSelected: true,
          is_multi_month,
        });

        // @TODO: hack to show error on claim picker when acc picker changes
        setTimeout(() => {
          setValues({
            ...formValues,
            ...defaultValues,
            pretaxEligibleCategories: eligibleCategories,
            pretaxSelected: true,
            is_multi_month,
          });
        }, 0);
      } else {
        setCategoryLoader(true);
        setValidationSchemaState(validationSchema(false));
        const formattedCategories: EligibleCategoriesType = await createCategories(selectedWallet, dispatch);
        setValues({
          ...formValues,
          ...defaultValues,
          eligibleCategories: formattedCategories,
          pretaxSelected: false,
          is_multi_month,
        });
        setCategoryLoader(false);
      }
    } else {
      setValues({ ...formValues, ...defaultValues, default_employee_wallet_id: "", is_multi_month });
    }
  };

  return (
    <FormFieldContainer name={"default_employee_wallet_id"} formFieldsTopMargin={formFieldsTopMargin}>
      <Picker
        label={"Account"}
        value={values.default_employee_wallet_id}
        onValueChange={(walletId: string) => {
          onWalletChange(walletId, values, setValues);
        }}
        placeholderText={"Selected Wallet"}
        items={userWallets}
        errorMessage={errors.default_employee_wallet_id ? errors.default_employee_wallet_id : ""}
        testId="which-account-is-paying"
        textInputContainerStyle={{ marginTop: 10 }}
      />
    </FormFieldContainer>
  );
};
