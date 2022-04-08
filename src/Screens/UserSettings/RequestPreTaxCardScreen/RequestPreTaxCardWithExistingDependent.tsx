import * as React from "react";
import { View } from "react-native";
import { Formik, FormikProps } from "formik";
import { pathOr, propOr, toUpper } from "ramda";
import { If, Then } from "react-if";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { PrimaryButton, CheckBoxButton } from "twic_mobile_components";

import { RequestPreTaxCardWithExistingDependentFormInitialValues, FormFieldsType, existingDependentPreTaxFormValidations } from "./meta";
import { AppHeading, AppScreenTitle, AppScreenTitleContainer, AddressForm, ScreenContainer } from "../../../Components";
import { Fonts, Metrics, Colors } from "../../../Themes";
import { requestPreTaxCard, requestPreTaxCardWithDemographics } from "../../../Actions";
import { capitalizeFirstLetter, isEmptyOrNil } from "../../../Utils";
import { RequestPretaxCardContainer } from "./StyledComponents";
import { RequestPreTaxCardWithExistingDependentType } from "./types";
import { APP_CONSTANTS } from "Constants";

const RequestPreTaxCardWithExistingDependent = (props: RequestPreTaxCardWithExistingDependentType) => {
  const { navigation, requestPreTaxCard, requestPreTaxCardWithDemographics, userProfile } = props;
  const userCountry = pathOr("us", ["userInfo", "country"], userProfile);
  const dependentInfo = pathOr("", ["route", "params", "dependentInfo"], props);
  const demographics = pathOr("", ["route", "params", "demographics"], props);
  const dependentId: string = propOr("", "dependentId", dependentInfo);
  const firstName: string = propOr("", "firstName", dependentInfo);
  const lastName: string = propOr("", "lastName", dependentInfo);
  const fullName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;

  const requestForPreTaxCard = (values: FormFieldsType) => {
    const { dependentId, billingAddressLineOne, billingAddressLineTwo, billingZipCode, billingState, billingCity, shippingAddressLineOne, shippingAddressLineTwo, shippingZipCode, shippingState, shippingCity, sameShippingAndBillingAddress } = values;

    const billingAddress = {
      line1: billingAddressLineOne,
      line2: billingAddressLineTwo,
      zip: billingZipCode,
      state: billingState,
      city: billingCity,
      country: toUpper(userCountry),
    };

    const payload = {
      address: { ...billingAddress },
      shipping_address: sameShippingAndBillingAddress
        ? { ...billingAddress }
        : {
            line1: shippingAddressLineOne,
            line2: shippingAddressLineTwo,
            zip: shippingZipCode,
            state: shippingState,
            city: shippingCity,
            country: toUpper(userCountry),
          },
    };

    isEmptyOrNil(dependentId) ? requestPreTaxCardWithDemographics(payload) : requestPreTaxCard(dependentId, payload, "updateDependent");
  };

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} enableOnAndroid={true} extraScrollHeight={100}>
        <RequestPretaxCardContainer style={{ paddingBottom: 0 }}>
          <AppScreenTitle paddingBottom={Metrics.doubleBaseMargin} fontWeight="bold">
            Request a Card for {fullName}
          </AppScreenTitle>
          <Formik
            initialValues={RequestPreTaxCardWithExistingDependentFormInitialValues(dependentId, demographics)}
            validationSchema={() => existingDependentPreTaxFormValidations(userCountry)}
            onSubmit={(values: FormFieldsType) => requestForPreTaxCard(values)}
          >
            {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, dirty, isValid }: FormikProps<FormFieldsType>) => {
              const {
                billingAddressLineOne,
                billingAddressLineTwo,
                billingZipCode,
                billingState,
                billingCity,
                shippingAddressLineOne,
                shippingAddressLineTwo,
                shippingZipCode,
                shippingState,
                shippingCity,
                sameShippingAndBillingAddress,
                dependentId,
              } = values;
              const handleFieldChange = (fieldName, value) => {
                setFieldTouched(fieldName, true);
                setFieldValue(fieldName, value);
              };
              const showShippingFields = sameShippingAndBillingAddress || false;

              return (
                <>
                  <AppScreenTitleContainer
                    customStyle={{
                      paddingVertical: 0,
                      marginBottom: Metrics.baseMargin + 6,
                      paddingHorizontal: 0,
                      fontWeight: 600,
                    }}
                  >
                    <AppHeading fontSize={Fonts.size.h4} textTransform="capitalize" paddingTop={Metrics.doubleBaseMargin} fontWeight="bold">
                      Billing Address
                    </AppHeading>
                  </AppScreenTitleContainer>
                  <AddressForm
                    config={{
                      line1: {
                        name: "billingAddressLineOne",
                        value: billingAddressLineOne,
                        error: propOr("", "billingAddressLineOne", errors),
                        touched: propOr("", "billingAddressLineOne", touched),
                        label: "Street Address",
                        testId: "line1",
                      },
                      line2: {
                        name: "billingAddressLineTwo",
                        value: billingAddressLineTwo,
                        error: propOr("", "billingAddressLineTwo", errors),
                        touched: propOr("", "billingAddressLineTwo", touched),
                        label: `Apt, Building, Suite ${touched.billingAddressLineTwo || values.billingAddressLineTwo ? "(optional)" : ""}`,
                        testId: "line2",
                      },
                      zip: {
                        name: "billingZipCode",
                        value: billingZipCode,
                        error: propOr("", "billingZipCode", errors),
                        touched: propOr("", "billingZipCode", touched),
                        label: "Zip Code",
                        testId: "zip",
                      },
                      state: {
                        name: "billingState",
                        value: billingState,
                        error: propOr("", "billingState", errors),
                        touched: propOr("", "billingState", touched),
                        label: "State",
                        placeholder: "State",
                        testId: "state",
                      },
                      city: {
                        name: "billingCity",
                        value: billingCity,
                        error: propOr("", "billingCity", errors),
                        touched: propOr("", "billingCity", touched),
                        label: "City",
                        testId: "city",
                      },
                    }}
                    onFieldChange={handleFieldChange}
                    onFieldTouched={setFieldTouched}
                  />

                  <AppScreenTitleContainer
                    customStyle={{
                      paddingVertical: 0,
                      marginBottom: Metrics.baseMargin + 6,
                      paddingHorizontal: 0,
                      fontWeight: 600,
                    }}
                  >
                    <AppHeading fontSize={Fonts.size.h4} textTransform="capitalize" paddingTop={Metrics.doubleSection} fontWeight="bold">
                      Shipping Address
                    </AppHeading>
                  </AppScreenTitleContainer>
                  <CheckBoxButton
                    fieldName="sameShippingAndBillingAddress"
                    fieldProps={{
                      title: "Same as Billing address",
                      checked: sameShippingAndBillingAddress,
                      onPress: () => handleFieldChange("sameShippingAndBillingAddress", !sameShippingAndBillingAddress),
                    }}
                  />
                  <If condition={!showShippingFields}>
                    <Then>
                      <AddressForm
                        config={{
                          line1: {
                            name: "shippingAddressLineOne",
                            value: shippingAddressLineOne,
                            error: propOr("", "shippingAddressLineOne", errors),
                            touched: propOr("", "shippingAddressLineOne", touched),
                            label: "Street Address",
                            testId: "shipping-line1",
                          },
                          line2: {
                            name: "shippingAddressLineTwo",
                            value: shippingAddressLineTwo,
                            error: propOr("", "shippingAddressLineTwo", errors),
                            touched: propOr("", "shippingAddressLineTwo", touched),
                            label: `Apt, Building, Suite ${touched.shippingAddressLineTwo || values.shippingAddressLineTwo ? "(optional)" : ""}`,
                            testId: "shipping-line2",
                          },
                          zip: {
                            name: "shippingZipCode",
                            value: shippingZipCode,
                            error: propOr("", "shippingZipCode", errors),
                            touched: propOr("", "shippingZipCode", touched),
                            label: "Zip Code",
                            testId: "shipping-zip",
                          },
                          state: {
                            name: "shippingState",
                            value: shippingState,
                            error: propOr("", "shippingState", errors),
                            touched: propOr("", "shippingState", touched),
                            label: "State",
                            placeholder: "State",
                            testId: "shipping-state",
                          },
                          city: {
                            name: "shippingCity",
                            value: shippingCity,
                            error: propOr("", "shippingCity", errors),
                            touched: propOr("", "shippingCity", touched),
                            label: "City",
                            testId: "shipping-city",
                          },
                        }}
                        onFieldChange={handleFieldChange}
                        onFieldTouched={setFieldTouched}
                      />
                    </Then>
                  </If>
                  <View style={{ alignItems: "center", marginTop: Metrics.doubleSection, marginBottom: Metrics.baseMargin }}>
                    <PrimaryButton
                      testId="add-dependent-save-button"
                      width={APP_CONSTANTS.MUI_BTN_WIDTH}
                      shadowOptions={{
                        width: 0,
                      }}
                      buttonColor={Colors.newPrimary}
                      disabledColor={Colors.newDisabledPrimary}
                      disabled={Boolean(!isValid)}
                      onClickHandler={handleSubmit}
                      buttonLabel="Submit"
                    />
                  </View>
                </>
              );
            }}
          </Formik>
        </RequestPretaxCardContainer>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestPreTaxCard: (id, payload, dependentType) => dispatch(requestPreTaxCard(id, payload, dependentType)),
    requestPreTaxCardWithDemographics: (payload) => dispatch(requestPreTaxCardWithDemographics(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestPreTaxCardWithExistingDependent);
