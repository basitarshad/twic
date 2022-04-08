import * as React from "react";
import { View } from "react-native";
import { Formik, FormikProps } from "formik";
import { propOr, pathOr } from "ramda";
import { Else, If, Then } from "react-if";
import { connect } from "react-redux";
import { PrimaryButton, CheckBoxButton } from "twic_mobile_components";

import { Fonts, Metrics, Colors } from "../../../Themes";
import { AppHeading, AppScreenTitle, AppScreenTitleContainer, AppText, IconWithText, AddressForm } from "../../../Components";
import DependentInformation from "./DependentInformation";
import { addUpdateDependentsFormValidations, createInitialValues } from "./meta";
import { AddUpdateDependentsFormType, FormFieldsType } from "./types";
import { isEmptyOrNil } from "../../../Utils";
import { NavigationService } from "../../../Services";
import { APP_ROUTES } from "../../../Navigation";
import { ArrowRightBlueSvgIcon, PlusCircleSvgIcon } from "../../../Components/SvgIcons";
import { APP_CONSTANTS } from "../../../Constants";
import { ScreenWrapper } from "../../../Components/Commons/ScreenWrapper";

const AddUpdateDependentsForm = (props: AddUpdateDependentsFormType) => {
  const { dependentInfo = {}, onSubmitForm, cardInfo = {}, userProfile, refetchDependent = () => {} } = props;
  const userCountry = pathOr("us", ["userInfo", "country"], userProfile);
  const firstName = propOr("", "firstName", dependentInfo);
  const lastName = propOr("", "lastName", dependentInfo);
  const dependentId = propOr("", "dependentId", dependentInfo);
  const fullNameIsEmpty = Boolean(isEmptyOrNil(firstName) && isEmptyOrNil(lastName));
  const showShippingToggleAndFields = isEmptyOrNil(dependentId) || false;

  return (
    <ScreenWrapper newDesignSystem>
      <AppScreenTitle textTransform={showShippingToggleAndFields ? "none" : "capitalize"} paddingBottom={Metrics.baseMargin}>
        {fullNameIsEmpty ? "Add a Dependent" : `${firstName} ${lastName}`}
      </AppScreenTitle>
      <If condition={!showShippingToggleAndFields}>
        <If condition={!isEmptyOrNil(cardInfo)}>
          <Then>
            <IconWithText
              text="View Benefits Card"
              onLinkPress={() =>
                NavigationService.navigate(APP_ROUTES.PRETAX_CARD_SCREEN_WITH_DEPENDENT_CARD, {
                  dependentInfo,
                  cardInfo,
                  refetchDependent,
                })
              }
              useSvgIcon={true}
              RenderSvgIcon={() => <ArrowRightBlueSvgIcon fillColor={Colors.newBlue} />}
              iconColor={Colors.newBlue}
              textStyle={{
                fontFamily: "TTCommons-DemiBold",
                width: "auto",
                fontWeight: "bold",
                color: Colors.newBlue,
                fontSize: APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.h4,
                textTransform: "none",
                bottom: 1,
              }}
              iconStyle={{
                marginHorizontal: 0,
                marginLeft: Metrics.baseMargin - 2,
              }}
              containerStyles={{
                marginVertical: Metrics.baseMargin,
              }}
              suffix
              testId="view-benefits-card"
            />
          </Then>
          <Else>
            <IconWithText
              text="Request a Card"
              onLinkPress={() =>
                NavigationService.navigate(APP_ROUTES.ADD_PRETAX_CARD_SCREEN, {
                  selectedDependent: dependentInfo,
                })
              }
              useSvgIcon={true}
              RenderSvgIcon={() => (
                <View style={{ marginTop: 5 }}>
                  <PlusCircleSvgIcon fillColor={Colors.newBlue} height={24} width={24} />
                </View>
              )}
              iconColor={Colors.newBlue}
              textStyle={{
                fontFamily: "TTCommons-DemiBold",
                width: "auto",
                fontWeight: APP_CONSTANTS.IS_ANDROID ? "400" : "bold",
                color: Colors.newBlue,
                fontSize: Fonts.size.h4,
                textTransform: "none",
              }}
              iconStyle={{
                marginHorizontal: 0,
                marginRight: Metrics.smallMargin,
              }}
              containerStyles={{
                marginVertical: Metrics.baseMargin,
              }}
              testId="request-benefits-card"
            />
          </Else>
        </If>
      </If>
      <If condition={showShippingToggleAndFields}>
        <Then>
          <AppText paddingTop={Metrics.doubleBaseMargin} paddingBottom={Metrics.doubleBaseMargin} color={Colors.darkGrey}>
            If you want your dependent like your kids, spouse or people that rely on you for pre-tax benefits you can add them in here.
          </AppText>
        </Then>
      </If>
      <Formik
        initialValues={createInitialValues(dependentInfo)}
        validationSchema={() => addUpdateDependentsFormValidations(userCountry)}
        onSubmit={(values: FormFieldsType) => {
          onSubmitForm(values);
        }}
      >
        {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, dirty, isValid }: FormikProps<FormFieldsType>) => {
          const {
            firstName,
            lastName,
            phoneNumber,
            billingAddressLineOne,
            billingAddressLineTwo,
            billingZipCode,
            billingState,
            shippingAddressLineOne,
            shippingAddressLineTwo,
            shippingZipCode,
            shippingState,
            sameShippingAndBillingAddress,
            dependentId,
            billingCity,
            shippingCity,
          } = values;
          const handleFieldChange = (fieldName, value) => {
            setFieldTouched(fieldName, true);
            setFieldValue(fieldName, value);
          };
          const showShippingFields = sameShippingAndBillingAddress || false;
          // Below check is made to differentite b/w update and add dependent flow

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
                <AppHeading fontSize={Fonts.size.h4} textTransform="capitalize" paddingTop={Metrics.doubleBaseMargin - 5} fontWeight={"bold"}>
                  Dependent Information
                </AppHeading>
              </AppScreenTitleContainer>
              <DependentInformation
                firstName={{
                  value: firstName,
                  error: propOr("", "firstName", errors),
                  touched: propOr("", "firstName", touched),
                  testId: "first-name",
                }}
                lastName={{
                  value: lastName,
                  error: propOr("", "lastName", errors),
                  touched: propOr("", "lastName", touched),
                  testId: "last-name",
                }}
                phoneNumber={{
                  value: phoneNumber,
                  error: propOr("", "phoneNumber", errors),
                  touched: propOr("", "phoneNumber", touched),
                  testId: "phone-number",
                }}
                changehandler={handleFieldChange}
              />
              <AppScreenTitleContainer
                customStyle={{
                  paddingVertical: 0,
                  marginBottom: Metrics.baseMargin + 6,
                  paddingHorizontal: 0,
                  fontWeight: 600,
                  marginTop: 20,
                }}
              >
                <AppHeading fontSize={Fonts.size.h4} textTransform="capitalize" paddingTop={Metrics.doubleBaseMargin} fontWeight={"bold"}>
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
                  city: {
                    name: "billingCity",
                    value: billingCity,
                    error: propOr("", "billingCity", errors),
                    touched: propOr("", "billingCity", touched),
                    label: "City",
                    testId: "city",
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
                }}
                onFieldChange={handleFieldChange}
                onFieldTouched={setFieldTouched}
              />

              <If condition={showShippingToggleAndFields}>
                <Then>
                  <AppScreenTitleContainer
                    customStyle={{
                      paddingVertical: 0,
                      marginBottom: Metrics.baseMargin + 6,
                      paddingHorizontal: 0,
                      fontWeight: 600,
                    }}
                  >
                    <AppHeading fontSize={Fonts.size.h4} textTransform="capitalize" paddingTop={Metrics.doubleSection} fontWeight={"bold"}>
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
                    containerStyle={{ marginTop: 10 }}
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
                          city: {
                            name: "shippingCity",
                            value: shippingCity,
                            error: propOr("", "shippingCity", errors),
                            touched: propOr("", "shippingCity", touched),
                            label: "City",
                            testId: "shipping-city",
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
                        }}
                        onFieldChange={handleFieldChange}
                        onFieldTouched={setFieldTouched}
                      />
                    </Then>
                  </If>
                </Then>
              </If>
              <View style={{ alignItems: "center", marginTop: Metrics.doubleSection, marginBottom: Metrics.baseMargin }}>
                <PrimaryButton
                  testId="add-dependent-save-button"
                  width={APP_CONSTANTS.MUI_BTN_WIDTH}
                  shadowOptions={{
                    width: 0,
                  }}
                  disabledColor={Colors.newDisabledPrimary}
                  buttonColor={Colors.newPrimary}
                  disabled={Boolean(!isValid || !dirty)}
                  onClickHandler={handleSubmit}
                  buttonLabel="Submit"
                />
              </View>
            </>
          );
        }}
      </Formik>
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};

export default connect(mapStateToProps, null)(AddUpdateDependentsForm);
