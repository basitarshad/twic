import * as React from "react";
import { useFormik } from "formik";
import { If } from "react-if";
import Collapsible from "react-native-collapsible";
import { propOr, mapObjIndexed, head, toLower } from "ramda";
import numeral from "numeral";
import { PrimaryButton, InputField, DatePickerField } from "twic_mobile_components";
import { View } from "react-native";

import { AppNotification, FormFieldContainer } from "Components";
import { Colors, Fonts } from "Themes";
import { APP_CONSTANTS } from "Constants";
import { isEmptyOrNil } from "Utils";
import { CalendarSvgIcon } from "Components/SvgIcons";

import { InsufficientBalanceDialog } from "./InsufficientBalanceDialog";
import { findRequiredWallet, getFormInitialValues, validationSchema } from "./meta";
import { FormValuesType, FieldNameTypes } from "./types";
import { ClaimBtnWrapper } from "./StyledComponents";
import { UploadReceipt } from "./UploadReceipt";
import { AccountsPicker } from "./AccountsPicker";
import { CategoryPickersAndDescription } from "./CategoryPickersAndDescription";
import { DependentsPicker } from "./DependentsPicker";

const defaultValidationSchema = validationSchema(false);

const formFieldsTopMargin = {};

const NewReimbursementForm = (props) => {
  const { submitHandler, pretaxSubmitHandler, userWallets = [], pretaxEnabled = false, countryCurrency, walletId = "", accountType = "", scrollToPosition } = props;
  const [categoryLoader, setCategoryLoader] = React.useState(false);
  const [validateOnChange, setValidateOnChange] = React.useState(false);
  const [validationSchemaState, setValidationSchemaState] = React.useState(defaultValidationSchema);

  const isMultiMonth = (amount, selectedWallet) => {
    const currentBalance = parseFloat(propOr(`${countryCurrency}0`, "balance", selectedWallet).replace(countryCurrency, ""));
    return parseFloat(amount) > currentBalance;
  };

  const onSubmit = (values: FormValuesType) => {
    const { amount, eligibleCategories, pretaxSelected, claimant, pretaxEligibleCategories } = values;
    if ((pretaxSelected && isEmptyOrNil(pretaxEligibleCategories)) || (!pretaxSelected && isEmptyOrNil(eligibleCategories))) {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: "Something went wrong. Please try again.",
      });
      return;
    }
    const formattedAmount = numeral(amount.replace(/,/g, ".")).value();
    if (pretaxSelected) {
      const { files, receipts, subcategory, subcategory_alias, pretaxCategory, eligibleCategories, subcategoryId, categoryId, searchedCategory, category_alias, ...rest } = values;
      const firstReceipt: any = head(values.receipts) || {};
      const formattedReceipt = [
        {
          ...firstReceipt,
          file_name: toLower(firstReceipt.fileName),
          content_type: firstReceipt.contentType,
        },
      ];
      pretaxSubmitHandler({
        ...rest,
        category: pretaxCategory,
        receipt: formattedReceipt,
        transaction_date: new Date(values.transaction_date as any).toISOString(),
        is_recurring: values.is_multi_month,
        amount: formattedAmount,
        claimant: {
          dependent_id: claimant.dependentId,
          dependent_status: claimant.dependentStatus,
          employee_full_name: claimant.employeeFullName,
          first_name: claimant.firstName,
          last_name: claimant.lastName,
          middle_initial: claimant.middleInitial,
          relationship: claimant.relationship,
        },
      });
    } else {
      if (!isEmptyOrNil(eligibleCategories)) {
        submitHandler({
          file: values.files,
          amount: formattedAmount,
          transaction_date: new Date(values.transaction_date as any).toISOString(),
          reimbursement_vendor: values.reimbursement_vendor,
          default_employee_wallet_id: values.default_employee_wallet_id,
          category: values.categoryId,
          category_alias: values.category_alias,
          subcategory: values.subcategoryId,
          subcategory_alias: values.subcategory_alias,
          is_recurring: values.is_multi_month,
          note: values.note,
        });
      } else {
        submitHandler({
          file: values.files,
          amount: formattedAmount,
          transaction_date: new Date(values.transaction_date as any).toISOString(),
          reimbursement_vendor: values.reimbursement_vendor,
          default_employee_wallet_id: values.default_employee_wallet_id,
          is_recurring: values.is_multi_month,
          note: values.note,
        });
      }
    }
  };

  const formik = useFormik({
    initialValues: getFormInitialValues(walletId, userWallets, accountType),
    validationSchema: validationSchemaState,
    onSubmit,
    validateOnBlur: false,
    validateOnChange,
    validateOnMount: false,
  });
  const { values, errors, setFieldValue, setFieldTouched, isValid, dirty, handleSubmit, setValues: _setValues, setTouched, setFieldError, validateForm } = formik;

  const onSubmitHandler = () => {
    setValidateOnChange(true);
    validateForm()
      .then((formErrors) => {
        if (!isEmptyOrNil(formErrors)) {
          const sortedByLayoutValue = Object.keys(formFieldsTopMargin)
            .filter((errorViewPointKey) => Object.keys(formErrors).includes(errorViewPointKey))
            .sort((a, b) => formFieldsTopMargin[a] - formFieldsTopMargin[b]);
          scrollToPosition({ point: formFieldsTopMargin[sortedByLayoutValue[0]] });
        } else {
          handleSubmit();
        }
      })
      .catch(() => {});
  };

  const selectedWallet = React.useMemo(() => {
    return findRequiredWallet(values.default_employee_wallet_id, userWallets);
  }, [values.default_employee_wallet_id, userWallets]);

  const onAmountChange = (amount: string, formValues: FormValuesType, setValues: (values: FormValuesType) => void) => {
    const { default_employee_wallet_id } = formValues;
    let is_multi_month = false;

    if (!isEmptyOrNil(default_employee_wallet_id)) {
      is_multi_month = isMultiMonth(amount, selectedWallet);
    }
    setValues({
      ...formValues,
      amount,
      is_multi_month,
      default_employee_wallet_id,
    });
  };

  const handleFieldChange = (fieldName: FieldNameTypes, value) => {
    setFieldTouched(fieldName, true);
    setFieldValue(fieldName, value);
  };
  const setValues = (formData) => {
    const touchedFields = mapObjIndexed(() => true, formData);
    setTouched(touchedFields);
    _setValues(formData);
  };

  return (
    <>
      {/* Account paying (Wallet) */}
      <AccountsPicker formFieldsTopMargin={formFieldsTopMargin} isMultiMonth={isMultiMonth} setValidationSchemaState={setValidationSchemaState} setCategoryLoader={setCategoryLoader} userWallets={userWallets} {...formik} />

      {/* Vendor Name */}
      <FormFieldContainer name={"reimbursement_vendor"} formFieldsTopMargin={formFieldsTopMargin}>
        <InputField
          label="Merchant or provider"
          value={values.reimbursement_vendor}
          onChangeHandler={(name: string) => setFieldValue("reimbursement_vendor", name)}
          placeholder=""
          errorMessage={errors.reimbursement_vendor ? errors.reimbursement_vendor : ""}
          testId="vendor-name"
          inputFieldStyle={{ marginTop: 25 }}
        />
      </FormFieldContainer>
      {/* Amount (Cost) */}
      <FormFieldContainer name={"amount"} formFieldsTopMargin={formFieldsTopMargin}>
        <InputField
          label="Claim amount"
          prefix={countryCurrency}
          value={values.amount}
          onChangeHandler={(amount: string) => {
            onAmountChange(amount, values, setValues);
          }}
          placeholder=""
          keyboardType="numeric"
          errorMessage={errors.amount ? errors.amount : ""}
          testId="cost"
          inputFieldStyle={{ marginTop: 25, marginBottom: 15 }}
        />
      </FormFieldContainer>

      {/* Recurring claim dialog (Appears when we input amount more than the selected wallet amount) */}
      <Collapsible duration={500} collapsed={!values.is_multi_month}>
        <InsufficientBalanceDialog wallet={selectedWallet} countryCurrency={countryCurrency} />
      </Collapsible>

      <CategoryPickersAndDescription formFieldsTopMargin={formFieldsTopMargin} scrollToPosition={scrollToPosition} userWallets={userWallets} categoryLoader={categoryLoader} handleFieldChange={handleFieldChange} {...formik} />

      {/* Who is making the claim */}
      <If condition={pretaxEnabled && values.pretaxSelected}>
        <DependentsPicker formFieldsTopMargin={formFieldsTopMargin} {...formik} />
      </If>

      {/* Upload Recipet */}
      <FormFieldContainer name="receipts" formFieldsTopMargin={formFieldsTopMargin}>
        <UploadReceipt {...formik} handleFieldChange={handleFieldChange} setFieldError={setFieldError} />
      </FormFieldContainer>
      <View style={{ marginTop: 50 }} />
      <FormFieldContainer name="transaction_date" formFieldsTopMargin={formFieldsTopMargin}>
        <DatePickerField
          label="Purchase Date"
          onConfirmDate={(date: Date) => {
            setFieldValue("transaction_date", date);
          }}
          value={values.transaction_date}
          errorMessage={errors.transaction_date ? (errors.transaction_date as string) : ""}
          RenderCustomIcon={({ color }) => <CalendarSvgIcon width={17} height={17} color={color} />}
          datePickerProps={{ placeholder: "Purchase Date" }}
          customStyles={{
            placeholderText: {
              fontSize: Fonts.size.small,
              paddingTop: APP_CONSTANTS.IS_ANDROID ? 2 : 4,
              color: errors.transaction_date ? Colors.error : Colors.newDimGrey,
            },
            dateText: {
              fontSize: 17,
              fontFamily: "TTCommons-Regular",
              color: Colors.primaryText,
              paddingTop: 2,
            },
          }}
        />
      </FormFieldContainer>
      <ClaimBtnWrapper>
        <PrimaryButton
          testId="submit-claim-button"
          width={APP_CONSTANTS.MUI_BTN_WIDTH}
          shadowOptions={{
            height: 0,
            width: 0,
          }}
          buttonColor={Colors.newPrimary}
          onClickHandler={onSubmitHandler}
          buttonLabel="File Claim"
        />
      </ClaimBtnWrapper>
    </>
  );
};

export default NewReimbursementForm;
