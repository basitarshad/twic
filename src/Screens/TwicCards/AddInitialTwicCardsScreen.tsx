import * as React from "react";
import { Formik, FormikProps } from "formik";
import { pathOr, propOr, toUpper } from "ramda";
import { Else, If, Then } from "react-if";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { CheckBoxButton, PrimaryButton, SecondaryButton } from "twic_mobile_components";

import { createTwicCard } from "../../Actions";
import { AddressForm, AppScreenTitle, AppText, NewFormikInputField, ScreenContainer } from "../../Components";
import { Colors, Fonts, Metrics } from "../../Themes";
import { isEmptyOrNil } from "../../Utils";
import { APP_CONSTANTS } from "../../Constants";
import { PHYSICAL, VIRTUAL } from "./Components/constants";
import { InitialTwicCardAddressType, InitialTwicCardFormFieldsType } from "./types";
import { AddInitialTwicCardsContainer } from "./StyledComponents";
import { InitialTwicCardFormValidations, TwicCardInfoFormValidation } from "./metadata";
import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";

const SECTION_ONE = "basicInfo";
const SECTION_TWO = "addressForms";

const formatAddress = (address: InitialTwicCardAddressType, userCountry: string) => {
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

const onFormSubmit = (values: InitialTwicCardFormFieldsType, userCountry: string) => {
  const { billingAddress, mailingAddress, firstName, lastName, phoneNumber, shouldCreatePhysicalCard } = values;
  const { useDifferentMailingAddress, ...restMailingAddress } = mailingAddress;
  const formattedBillingAddress = formatAddress(billingAddress, userCountry);
  const formattedMailingAddress = formatAddress(restMailingAddress, userCountry);
  const formattedValues = {
    billing_address: formattedBillingAddress,
    shipping_address: useDifferentMailingAddress ? formattedMailingAddress : formattedBillingAddress,
    first_name: firstName,
    last_name: lastName,
    // NEED TO SEND PHONE NUMBER WITH +1 FORMAT
    phone: `+1${phoneNumber}`,
    should_create_physical_card: shouldCreatePhysicalCard,
    should_create_virtual_card: true,
  };
  return formattedValues;
};

const GetScreenHeader = () => {
  return (
    <AddInitialTwicCardsContainer>
      <AppScreenTitle paddingBottom={Metrics.doubleBaseMargin}>Get Forma card</AppScreenTitle>
      <AppText color={Colors.placeholderColor}>Confirm the following information below to get your Forma card.</AppText>
    </AddInitialTwicCardsContainer>
  );
};

const AddInitialTwicCardsScreen = () => {
  const [state, setState] = React.useState({
    currentSection: SECTION_ONE,
  });
  const { currentSection } = state;
  const dispatch = useDispatch();
  const userProfile: any = useSelector((state) => propOr({}, "userProfile", state));
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
          mailingAddress: {
            line1: "",
            line2: "",
            city: "",
            zip: "",
            state: "",
            country: toUpper(userCountry),
          },
          shouldCreatePhysicalCard: false,
          useDifferentMailingAddress: false,
        }}
        validationSchema={InitialTwicCardFormValidations(userCountry)}
        onSubmit={async (values: InitialTwicCardFormFieldsType) => {
          const { shouldCreatePhysicalCard } = values;
          const formatedValues = onFormSubmit(values, userCountry);
          await dispatch(createTwicCard({ values: formatedValues, cardType: shouldCreatePhysicalCard ? PHYSICAL : VIRTUAL }));
        }}
      >
        {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, isValid }: FormikProps<InitialTwicCardFormFieldsType>) => {
          const { firstName, lastName, phoneNumber, billingAddress, mailingAddress, shouldCreatePhysicalCard } = values;
          const { useDifferentMailingAddress = false } = mailingAddress;
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
              <View style={{ height: 44, paddingTop: 2 }}>
                <If condition={currentSection === SECTION_ONE}>
                  <Then>
                    <SimpleHeaderBackHandler />
                  </Then>
                  <Else>
                    <SimpleHeaderBackHandler backHandler={() => setState({ ...state, currentSection: SECTION_ONE })} />
                  </Else>
                </If>
              </View>
              <ScreenWrapper newDesignSystem scrollView={currentSection !== SECTION_ONE}>
                <If condition={currentSection === SECTION_ONE}>
                  <Then>
                    <View style={{ flex: 5, justifyContent: "flex-start" }}>
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
                    <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: Metrics.baseMargin }}>
                      <SecondaryButton onClickHandler={() => setState({ ...state, currentSection: SECTION_TWO })} buttonLabel="Continue" disabled={isContinueButtonDisabled()} width={APP_CONSTANTS.MUI_BTN_WIDTH} testId="continue-button" />
                    </View>
                  </Then>
                  <Else>
                    <View>
                      <GetScreenHeader />
                      <AppScreenTitle size={Fonts.size.h3} paddingBottom={Metrics.doubleBaseMargin}>
                        Your Address
                      </AppScreenTitle>
                      <AddressForm
                        config={{
                          line1: {
                            name: "billingAddress.line1",
                            value: billingAddress.line1,
                            touched: pathOr(false, ["billingAddress", "line1"], touched),
                            error: pathOr("", ["billingAddress", "line1"], errors),
                            label: "Address",
                            testId: "billing-line1",
                          },
                          line2: {
                            name: "billingAddress.line2",
                            value: billingAddress.line2,
                            touched: pathOr(false, ["billingAddress", "line2"], touched),
                            error: pathOr("", ["billingAddress", "line2"], errors),
                            label: `Unit, Apt or Suite ${touched.billingAddress?.line2 || billingAddress.line2 ? " (optional)" : ""}`,
                            testId: "billing-line2",
                          },
                          city: {
                            name: "billingAddress.city",
                            value: billingAddress.city,
                            touched: pathOr(false, ["billingAddress", "city"], touched),
                            error: pathOr("", ["billingAddress", "city"], errors),
                            label: "City",
                            testId: "billing-city",
                          },
                          zip: {
                            name: "billingAddress.zip",
                            value: billingAddress.zip,
                            touched: pathOr(false, ["billingAddress", "zip"], touched),
                            error: pathOr("", ["billingAddress", "zip"], errors),
                            label: "Zip Code",
                            testId: "billing-zip",
                          },
                          state: {
                            name: "billingAddress.state",
                            value: billingAddress.state,
                            touched: pathOr(false, ["billingAddress", "state"], touched),
                            error: pathOr("", ["billingAddress", "state"], errors),
                            label: "State",
                            placeholder: "State",
                            testId: "billing-state",
                          },
                        }}
                        onFieldChange={handleFieldChange}
                        onFieldTouched={setFieldTouched}
                      />
                      <View style={{ borderWidth: 1, borderColor: Colors.dimGrey, padding: Metrics.baseMargin, borderRadius: 5, marginBottom: shouldCreatePhysicalCard ? Metrics.baseMargin : 25, marginTop: 25 }}>
                        <CheckBoxButton
                          fieldName="shouldCreatePhysicalCard"
                          fieldProps={{
                            title: "+ Mail Debit Card",
                            checked: shouldCreatePhysicalCard,
                            onPress: () => handleFieldChange("shouldCreatePhysicalCard", !shouldCreatePhysicalCard),
                            textStyle: {
                              fontWeight: "bold",
                            },
                          }}
                          containerStyle={{
                            marginBottom: 0,
                          }}
                        />
                        <AppText paddingLeft={Metrics.screenHorizontalPadding} color={Colors.placeholderColor}>
                          We can also mail a physical debit card.
                        </AppText>
                      </View>
                      <If condition={shouldCreatePhysicalCard}>
                        <Then>
                          <CheckBoxButton
                            fieldName="mailingAddress.useDifferentMailingAddress"
                            fieldProps={{
                              title: "Use different mailing address",
                              checked: useDifferentMailingAddress,
                              textStyle: { color: Colors.placeholderColor },
                              onPress: () => handleFieldChange("mailingAddress.useDifferentMailingAddress", !useDifferentMailingAddress),
                            }}
                            containerStyle={{
                              paddingLeft: Metrics.baseMargin + 1,
                            }}
                          />
                        </Then>
                      </If>
                      <If condition={shouldCreatePhysicalCard && useDifferentMailingAddress}>
                        <Then>
                          <View style={{ marginTop: Metrics.baseMargin }}>
                            <AddressForm
                              config={{
                                line1: {
                                  name: "mailingAddress.line1",
                                  value: mailingAddress.line1,
                                  touched: pathOr(false, ["mailingAddress", "line1"], touched),
                                  error: pathOr("", ["mailingAddress", "line1"], errors),
                                  label: "Address",
                                  testId: "mailing-line1",
                                },
                                line2: {
                                  name: "mailingAddress.line2",
                                  value: mailingAddress.line2,
                                  touched: pathOr(false, ["mailingAddress", "line2"], touched),
                                  error: pathOr("", ["mailingAddress", "line2"], errors),
                                  label: `Unit, Apt or Suite ${touched.mailingAddress?.line2 || mailingAddress.line2 ? " (optional)" : ""}`,
                                  testId: "mailing-line2",
                                },
                                city: {
                                  name: "mailingAddress.city",
                                  value: mailingAddress.city,
                                  touched: pathOr(false, ["mailingAddress", "city"], touched),
                                  error: pathOr("", ["mailingAddress", "city"], errors),
                                  label: "City",
                                  testId: "mailing-city",
                                },
                                zip: {
                                  name: "mailingAddress.zip",
                                  value: mailingAddress.zip,
                                  touched: pathOr(false, ["mailingAddress", "zip"], touched),
                                  error: pathOr("", ["mailingAddress", "zip"], errors),
                                  label: "Zip Code",
                                  testId: "mailing-zip",
                                },
                                state: {
                                  name: "mailingAddress.state",
                                  value: mailingAddress.state,
                                  touched: pathOr(false, ["mailingAddress", "state"], touched),
                                  error: pathOr("", ["mailingAddress", "state"], errors),
                                  label: "State",
                                  placeholder: "State",
                                  testId: "mailing-state",
                                },
                              }}
                              onFieldChange={handleFieldChange}
                              onFieldTouched={setFieldTouched}
                            />
                          </View>
                        </Then>
                      </If>
                    </View>
                    <View style={{ marginBottom: Metrics.baseMargin, marginTop: Metrics.doubleSection }}>
                      <PrimaryButton
                        width={APP_CONSTANTS.MUI_BTN_WIDTH}
                        shadowOptions={{
                          width: "0%",
                        }}
                        buttonColor={Colors.newPrimary}
                        disabledColor={Colors.newDisabledPrimary}
                        disabled={Boolean(!isValid)}
                        onClickHandler={handleSubmit}
                        buttonLabel="Get Card"
                        testId="get-twic-card-button"
                      />
                    </View>
                  </Else>
                </If>
              </ScreenWrapper>
            </>
          );
        }}
      </Formik>
    </ScreenContainer>
  );
};

export default AddInitialTwicCardsScreen;
