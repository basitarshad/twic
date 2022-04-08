import * as React from "react";
import { Formik, FormikProps } from "formik";
import { Image } from "react-native";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryButton } from "twic_mobile_components";

import { AppScreenTitle, AppText, NewFormikInputField, ScreenContainer } from "Components";
import { Colors, Fonts, Images, Metrics } from "Themes";
import { APP_CONSTANTS } from "Constants";
import { createTokenAndManuallyLinkTheBank } from "Actions";
import { pathOr, toLower } from "ramda";
import { findCountryCurrency } from "Utils";
import NewFormikPickerField from "Components/Commons/FormFields/FormikFields/NewFormikPickerField";

const manualBankLinkFormValidation = yup.object().shape({
  routingNumber: yup.number().typeError("Routing number must be a number").required("Routing number is required"),
  accountNumber: yup.number().typeError("Account number must be a number").required("Account number is required"),
  accountHolderName: yup.string().required("Account holder name is required"),
  accountType: yup.string().nullable().required("Account type is required"),
});

// below Margin-bottom is required as to show button UI in small screen devices
const ManualBankLinkContainer = styled.View`
  margin-bottom: ${Metrics.screenHeight * 0.035};
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
  height: ${Metrics.screenHeight};
`;

const ContentContainer = styled.View`
  flex: 2.75;
`;

const ActionsContainer = styled.View`
  flex: 1.25;
`;

const SslNote = styled.View`
  flex-direction: row;
  margin-bottom: ${Metrics.doubleBaseMargin};
  align-items: flex-start;
`;

type FormFieldsType = {
  routingNumber: string;
  accountNumber: string;
  accountHolderName: string;
  accountType: string;
};

const ManualBankLink = () => {
  const dispatch = useDispatch();
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const countryCurrency = findCountryCurrency(userCountry);

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false} enableOnAndroid={true} extraScrollHeight={100}>
        <ManualBankLinkContainer>
          <AppScreenTitle paddingTop={10} textTransform="capitalize" paddingBottom={Metrics.baseMargin}>
            Link External Account
          </AppScreenTitle>
          <AppText paddingBottom={Metrics.doubleBaseMargin} color={Colors.placeholderColor} style={{ alignItems: "center" }}>
            Enter your account number and routing number at your external financial institution
          </AppText>
          <Formik
            initialValues={{
              routingNumber: "",
              accountNumber: "",
              accountHolderName: "",
              accountType: "",
            }}
            validationSchema={manualBankLinkFormValidation}
            onSubmit={(values: FormFieldsType) => {
              const objectToCreateToken = {
                accountNumber: values.accountNumber,
                countryCode: userCountry,
                currency: toLower(countryCurrency),
                routingNumber: values.routingNumber,
                accountHolderName: values.accountHolderName,
                accountType: values.accountType,
                accountHolderType: "individual",
              };
              dispatch(createTokenAndManuallyLinkTheBank(objectToCreateToken));
            }}
          >
            {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, dirty, isValid }: FormikProps<FormFieldsType>) => {
              const handleFieldChange = (fieldName, value) => {
                setFieldTouched(fieldName, true);
                setFieldValue(fieldName, value);
              };
              const { accountType } = values;

              return (
                <>
                  <ContentContainer>
                    <NewFormikInputField
                      fieldName="routingNumber"
                      fieldProps={{
                        label: "Routing Number",
                        value: values.routingNumber,
                        onChangeHandler: (routingNumber) => {
                          handleFieldChange("routingNumber", routingNumber);
                        },
                        keyboardType: "numeric",
                        errorMessage: (touched.routingNumber && errors.routingNumber) || "",
                        testId: "routing-number",
                      }}
                    />
                    <NewFormikInputField
                      fieldName="accountNumber"
                      fieldProps={{
                        label: "Account Number",
                        value: values.accountNumber,
                        onChangeHandler: (accountNumber) => {
                          handleFieldChange("accountNumber", accountNumber);
                        },
                        keyboardType: "numeric",
                        errorMessage: (touched.accountNumber && errors.accountNumber) || "",
                        testId: "account-number",
                      }}
                      containerStyle={{ marginTop: 25 }}
                    />
                    <NewFormikInputField
                      fieldName="accountHolderName"
                      fieldProps={{
                        label: "Account Holder Name",
                        value: values.accountHolderName,
                        onChangeHandler: (accountHolderName) => {
                          handleFieldChange("accountHolderName", accountHolderName);
                        },
                        keyboardType: "default",
                        errorMessage: (touched.accountHolderName && errors.accountHolderName) || "",
                        testId: "account-holder-name",
                      }}
                      containerStyle={{ marginTop: 25 }}
                    />
                    <NewFormikPickerField
                      fieldName="Account_Type"
                      fieldProps={{
                        label: "Account Type",
                        value: accountType,
                        onValueChange: (value: string) => {
                          handleFieldChange("accountType", value);
                        },
                        placeholderText: "Selected Account",
                        items: [
                          { label: "Checking", value: "Checking", key: "Checking" },
                          { label: "Savings", value: "Savings", key: "Savings" },
                        ],
                        errorMessage: (touched.accountType && errors.accountType) || "",
                        testId: "account_type_saving_checking",
                      }}
                      containerStyle={{ marginTop: 25 }}
                    />
                  </ContentContainer>
                  <ActionsContainer>
                    <SslNote>
                      <Image source={Images.lockIcon} style={{ width: 25, height: 25 }} />
                      <AppText fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small} textAlign="justify" paddingLeft={Metrics.smallMargin} paddingRight={Metrics.screenHorizontalPadding} color={Colors.placeholderColor}>
                        In order for Forma to process direct deposits on your company's behalf, we need to comply with financial regulations and ask you to complete a quick identity check. We use Stripe to securely collect these information, and
                        you'll be taken to a secured form hosted by Stripe.
                      </AppText>
                    </SslNote>
                    <PrimaryButton
                      shadowOptions={{ width: "0%", height: 0 }}
                      testId="submit-button"
                      buttonLabel="Submit"
                      disabledColor={Colors.newDisabledPrimary}
                      disabled={Boolean(!isValid || !dirty)}
                      buttonColor={Colors.newPrimary}
                      onClickHandler={handleSubmit}
                      width={APP_CONSTANTS.MUI_BTN_WIDTH}
                    />
                  </ActionsContainer>
                </>
              );
            }}
          </Formik>
        </ManualBankLinkContainer>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default ManualBankLink;
