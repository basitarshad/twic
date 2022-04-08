import * as React from "react";
import { pathOr, toUpper } from "ramda";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import { Formik, FormikProps } from "formik";
import { Else, If, Then } from "react-if";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PrimaryButton, SecondaryButton } from "twic_mobile_components";

import { Metrics, Colors, Fonts } from "../../Themes";
import { createTwicCard } from "../../Actions";
import { AppText, AppScreenTitle, NewFormikInputField, AddressForm, ScreenContainer } from "../../Components";
import { isEmptyOrNil } from "../../Utils";
import { APP_CONSTANTS } from "../../Constants";
import { PHYSICAL, VIRTUAL } from "./Components/constants";
import { CreateTwicCardFormFieldsType, CreateTwicCardUpdatedAddressType } from "./types";
import { GetTwicCardContainer } from "./StyledComponents";
import { CreateTwicFormValidations, TwicCardInfoFormValidation } from "./metadata";
import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";

const formatAddress = (address: CreateTwicCardUpdatedAddressType) => {
  const { zip, line2, ...rest } = address;
  return !isEmptyOrNil(line2)
    ? {
        ...rest,
        line2,
        postal_code: zip,
      }
    : {
        ...rest,
        postal_code: zip,
      };
};

const onFormSubmit = (values: CreateTwicCardFormFieldsType, cardType: string) => {
  const { billingAddress, firstName, lastName, phoneNumber } = values;
  const formatedBillingAddress = formatAddress(billingAddress);
  const formatedValues = {
    billing_address: formatedBillingAddress,
    shipping_address: formatedBillingAddress,
    first_name: firstName,
    last_name: lastName,
    // NEED TO SEND PHONE NUMBER WITH +1 FORMAT
    phone: `+1${phoneNumber}`,
    should_create_physical_card: cardType === PHYSICAL ? true : false,
    should_create_virtual_card: cardType === VIRTUAL ? true : false,
  };
  return formatedValues;
};

const GetScreenHeader = () => {
  return (
    <GetTwicCardContainer>
      <AppScreenTitle paddingBottom={Metrics.doubleBaseMargin} paddingTop={10}>
        Get Forma card
      </AppScreenTitle>
      <AppText color={Colors.placeholderColor}>Confirm the following information below to get your Forma card.</AppText>
    </GetTwicCardContainer>
  );
};

const SECTION_ONE = "basicInfo";
const SECTION_TWO = "addressForms";

const CreateTwicCard = (props) => {
  const { route } = props;
  const cardType = route.params.cardType || "";
  const [state, setState] = React.useState({
    currentSection: SECTION_ONE,
  });
  const { currentSection } = state;
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => pathOr("us", ["userProfile"], state));
  const userCountry = pathOr("us", ["userInfo", "country"], userProfile);
  const lastName = pathOr("", ["userInfo", "lastName"], userProfile);
  const firstName = pathOr("", ["userInfo", "firstName"], userProfile);
  const phone = pathOr("", ["userInfo", "phone"], userProfile);
  const phoneNumber = phone.substr(phone.length - 10, phone.length);
  const userBillingAddress = {
    line1: pathOr("", ["userInfo", "address", "street"], userProfile),
    line2: pathOr("", ["userInfo", "address", "street_ext"], userProfile),
    city: pathOr("", ["userInfo", "address", "locality"], userProfile),
    state: pathOr("", ["userInfo", "address", "state"], userProfile),
    zip: pathOr("", ["userInfo", "address", "zip"], userProfile),
    country: toUpper(userCountry),
  };
  return (
    <ScreenContainer>
      <Formik
        initialValues={{
          firstName,
          lastName,
          phoneNumber,
          billingAddress: userBillingAddress,
        }}
        validationSchema={CreateTwicFormValidations(userCountry)}
        onSubmit={async (values: CreateTwicCardFormFieldsType) => {
          const formatedValues = onFormSubmit(values, cardType);
          await dispatch(createTwicCard({ values: formatedValues, cardType }));
        }}
      >
        {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, dirty, isValid }: FormikProps<CreateTwicCardFormFieldsType>) => {
          const { firstName, lastName, phoneNumber, billingAddress } = values;
          const handleFieldChange = (fieldName, value) => {
            setFieldTouched(fieldName, true);
            setFieldValue(fieldName, value);
          };
          const isContinueButtonDisabled = () => {
            try {
              TwicCardInfoFormValidation.validateSync(
                { firstName, lastName, phoneNumber },
                {
                  abortEarly: false,
                },
              );
              return false;
            } catch (e) {
              return true;
            }
          };
          return (
            <>
              <View style={{ height: 44 }}>
                <If condition={currentSection === SECTION_ONE}>
                  <Then>
                    <SimpleHeaderBackHandler />
                  </Then>
                  <Else>
                    <SimpleHeaderBackHandler backHandler={() => setState({ ...state, currentSection: SECTION_ONE })} />
                  </Else>
                </If>
              </View>
              <View style={{ flex: 7, justifyContent: "flex-end", marginHorizontal: Metrics.newScreenHorizontalPadding }}>
                <If condition={currentSection === SECTION_ONE}>
                  <Then>
                    <View style={{ flex: 6, justifyContent: "flex-start" }}>
                      <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false} enableOnAndroid={true} extraScrollHeight={60}>
                        <GetScreenHeader />
                        <AppScreenTitle size={Fonts.size.h3} paddingBottom={Metrics.doubleBaseMargin}>
                          Your Info
                        </AppScreenTitle>
                        <NewFormikInputField
                          fieldName="firstName"
                          fieldProps={{
                            label: "First Name",
                            value: firstName,
                            onChangeHandler: (value: string) => handleFieldChange("firstName", value),
                            errorMessage: errors.firstName || "",
                            testId: "first-name",
                          }}
                        />
                        <NewFormikInputField
                          fieldName="lastName"
                          fieldProps={{
                            label: "Last Name",
                            value: lastName,
                            onChangeHandler: (value: string) => handleFieldChange("lastName", value),
                            errorMessage: errors.lastName || "",
                            testId: "last-name",
                          }}
                          containerStyle={{ marginTop: 25 }}
                        />
                        <NewFormikInputField
                          fieldName="phoneNumber"
                          fieldProps={{
                            label: "Phone Number",
                            value: phoneNumber,
                            onChangeHandler: (value: string) => handleFieldChange("phoneNumber", value),
                            errorMessage: errors.phoneNumber || "",
                            keyboardType: "numeric",
                            testId: "phone-number",
                          }}
                          containerStyle={{ marginTop: 25 }}
                        />
                      </KeyboardAwareScrollView>
                    </View>
                    <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: Metrics.baseMargin }}>
                      <SecondaryButton buttonLabel="Continue" onClickHandler={() => setState({ ...state, currentSection: SECTION_TWO })} width={APP_CONSTANTS.MUI_BTN_WIDTH} testId="continue-button" disabled={isContinueButtonDisabled()} />
                    </View>
                  </Then>
                  <Else>
                    <View style={{ flex: 6, justifyContent: "flex-start" }}>
                      <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false} enableOnAndroid={true} extraScrollHeight={150}>
                        <GetScreenHeader />
                        <AppScreenTitle size={Fonts.size.h3} paddingBottom={Metrics.doubleBaseMargin}>
                          Your Address
                        </AppScreenTitle>
                        <View style={{ marginBottom: Metrics.doubleSection }}>
                          <AddressForm
                            config={{
                              line1: {
                                name: "billingAddress.line1",
                                value: billingAddress.line1,
                                touched: pathOr(false, ["billingAddress", "line1"], touched),
                                error: pathOr("", ["billingAddress", "line1"], errors),
                                label: "Address",
                                testId: "line1",
                              },
                              line2: {
                                name: "billingAddress.line2",
                                value: billingAddress.line2,
                                touched: pathOr(false, ["billingAddress", "line2"], touched),
                                error: pathOr("", ["billingAddress", "line2"], errors),
                                label: `Unit, Apt or Suite ${touched.billingAddress?.line2 || billingAddress.line2 ? " (optional)" : ""}`,
                                testId: "line2",
                              },
                              city: {
                                name: "billingAddress.city",
                                value: billingAddress.city,
                                touched: pathOr(false, ["billingAddress", "city"], touched),
                                error: pathOr("", ["billingAddress", "city"], errors),
                                label: "City",
                                testId: "city",
                              },
                              zip: {
                                name: "billingAddress.zip",
                                value: billingAddress.zip,
                                touched: pathOr(false, ["billingAddress", "zip"], touched),
                                error: pathOr("", ["billingAddress", "zip"], errors),
                                label: "Zip Code",
                                testId: "zip",
                              },
                              state: {
                                name: "billingAddress.state",
                                value: billingAddress.state,
                                touched: pathOr(false, ["billingAddress", "state"], touched),
                                error: pathOr("", ["billingAddress", "state"], errors),
                                label: "State",
                                placeholder: "State",
                              },
                            }}
                            onFieldChange={handleFieldChange}
                            onFieldTouched={setFieldTouched}
                          />
                        </View>
                      </KeyboardAwareScrollView>
                    </View>
                    <View style={{ marginBottom: Metrics.baseMargin, paddingTop: Metrics.baseMargin }}>
                      <PrimaryButton
                        width={APP_CONSTANTS.MUI_BTN_WIDTH}
                        shadowOptions={{
                          width: "0%",
                        }}
                        disabledColor={Colors.newDisabledPrimary}
                        buttonColor={Colors.newPrimary}
                        disabled={Boolean(!isValid)}
                        onClickHandler={handleSubmit}
                        buttonLabel="Get Card"
                        testId="get-twic-card-button"
                      />
                    </View>
                  </Else>
                </If>
              </View>
            </>
          );
        }}
      </Formik>
    </ScreenContainer>
  );
};
export default CreateTwicCard;
