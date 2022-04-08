import * as React from "react";
import { connect } from "react-redux";
import { pathOr, pathEq, propOr } from "ramda";
import { Formik } from "formik";
import { If, Then } from "react-if";
import { View } from "react-native";
import Collapsible from "react-native-collapsible";
import { PrimaryButton } from "twic_mobile_components";

import { useCheckoutContext } from "./context/CheckoutContext";
import { DisclaimerSection } from "./DisclaimerSection";
import { CardInformationSection } from "./CardInformationSection";
import { CheckoutDetailsSection } from "./CheckoutDetailsSection";
import { DNAProfileSection } from "./DNAProfileSection";
import { MembershipSection } from "./MembershipInformationSection";
import { ShippingAddressSection } from "./ShippingAddressSection";
import { LocationBasedPaymentsSection } from "./LocationBasedPaymentSection";
import { RowContainer, AppAlert, AppNotification } from "../../Components/Commons";
import { isEmptyOrNil } from "../../Utils";
import { Colors } from "../../Themes";
import { getSalesTaxInfo, showBrainTreeDropIn, checkoutProductFromTwicStore } from "../../Actions";
import { FormHelpers, FormSettings } from "./utils";
import { useMarketplaceVendorsContext } from "../Marketplace/MarketplaceVendorsContext";
import { APP_CONSTANTS } from "Constants";
import { ContactInformationSection } from "./ContactInformationSection";

const { formFields: FORM_FIELDS } = FormSettings;
const formFieldsTopMargin: Object = {};

const checkProductDetails = (detailsPath, valueToMatch, product) => pathEq(detailsPath, valueToMatch)(product);

// displays the checkout confirmation alert
const getCheckoutAlertOptions = ({ title, checkoutHandler }) => ({
  title,
  message: `Are you sure you want to proceed?`,
  alertActions: [
    {
      text: "Cancel",
      style: "cancel",
      onPress: () => console.log("cancelled"),
    },
    {
      text: "Confirm",
      onPress: () => {
        checkoutHandler();
      },
    },
  ],
});

// sends API request to fetch sales tax for the product based on the location
const fetchSalesTax = async (params) => {
  const { dispatch, product, getSalesTaxInfo, formValues, handleFieldChange, userCountry } = params;
  let salesTaxAmount = 0;
  if (!isEmptyOrNil(formValues.zip) && !isEmptyOrNil(formValues.state) && product.isSalesTaxRequired) {
    const salesTaxAmountResponse = await getSalesTaxInfo({ product, formValues, userCountry });
    salesTaxAmount = salesTaxAmountResponse.salesTaxAmount;

    handleFieldChange(FORM_FIELDS.salesTaxFound.fieldName, salesTaxAmountResponse.salesTaxFound);

    dispatch({
      type: "SET_CONTEXT_STATE",
      payload: {
        salesTaxAmount,
      },
    });
  }
};

export const CheckoutFormContent = (props) => {
  const { product, userProfile, getSalesTaxInfo, toggleBrainTreeUI, twicStoreCheckout, scrollToPosition } = props;
  const [validateOnChange, setValidateOnChange] = React.useState(false);
  const { state, dispatch } = useCheckoutContext();
  const token = pathOr("", ["userInfo", "payment", "token"], userProfile);
  const userCountry = pathOr("us", ["userInfo", "country"], userProfile);
  const userEmail = pathOr("", ["userInfo", "email"], userProfile);
  const { isOneTimeProduct, isShippingRequired, isPhoneNumberRequired, allowMembershipTransfer } = product;

  const { MarketPlaceDispatcher } = useMarketplaceVendorsContext();
  const isPaymentMethodAdded = !isEmptyOrNil(token);

  const isVendorPercisionNutrition = checkProductDetails(["vendorTitle"], "Precision Nutrition", product);
  const isVendorSoothe = checkProductDetails(["vendorId"], "soothe", product);
  const isVendorVitagene = checkProductDetails(["vendorId"], "vitagene", product);
  const isGymProduct = checkProductDetails(["vendorType"], "gym", product);
  const isStoreProduct = checkProductDetails(["vendorType"], "store", product);

  const isSubscribedAndShippingRequired = !isOneTimeProduct && isShippingRequired;
  const showShippingAddressSection = (isOneTimeProduct && isShippingRequired) || isVendorVitagene;
  const showMembershipSection = !isVendorVitagene && (isGymProduct || allowMembershipTransfer || isVendorPercisionNutrition);
  const showLimitedMembershipSection = !isVendorVitagene && !isOneTimeProduct && isStoreProduct;
  const showDesiredGymLocationField = isGymProduct && !["national_membership"].includes(product.productId) && !showLimitedMembershipSection;
  const showEmergencyContactFields = isGymProduct && !showLimitedMembershipSection;

  // const showMembershipSection = !isVendorVitagene && (isGymProduct || (!isOneTimeProduct && !isGymProduct));
  const isPaymentSectionApplicable = !isPaymentMethodAdded || isGymProduct || !isOneTimeProduct || (propOr(0, "employeeDueAmount", state) as number) > 0;
  const handleFormSubmission = (formValues) => {
    const checkoutAlertOptions = getCheckoutAlertOptions({
      title: "Complete Purchase",
      checkoutHandler: () => twicStoreCheckout({ formValues, checkoutContextData: state, MarketPlaceDispatcher, product }),
    });

    AppAlert(checkoutAlertOptions);
  };

  const getPaymentSectionVisibility = (formValues) => {
    const { use_points, total_amount } = formValues;
    return !use_points || total_amount > 0;
  };

  const initialFormValues = FormHelpers.getFormInitialValues({
    isVendorSoothe,
    isVendorVitagene,
    isSubscribedAndShippingRequired,
    showShippingAddressSection,
    showMembershipSection,
    showLimitedMembershipSection,
    userProfile,
    product,
    isPhoneNumberRequired,
    userEmail,
  });

  const checkoutFormSchema = FormHelpers.getFormValidationSchema({
    isVendorSoothe,
    isVendorVitagene,
    isSubscribedAndShippingRequired,
    showShippingAddressSection,
    showMembershipSection,
    showLimitedMembershipSection,
    product,
    userCountry,
    isPhoneNumberRequired: true,
    isEmailRequired: true,
    showDesiredGymLocationField,
    showEmergencyContactFields,
    isShippingRequired: isSubscribedAndShippingRequired || showShippingAddressSection || (showMembershipSection && isGymProduct),
  });

  const updateSalesTax = (params) => {
    fetchSalesTax({ ...params, dispatch, product, getSalesTaxInfo, userCountry });
  };

  React.useEffect(() => {
    dispatch({
      type: "SET_CONTEXT_STATE",
      payload: {
        product,
        userProfile,
        productPrice: product.proratedPrice ? product.proratedPrice : product.specialPrice,
      },
    });
  }, []);

  React.useEffect(() => {
    // set initial state for the context
    dispatch({
      type: "SET_CONTEXT_STATE",
      payload: {
        userProfile,
      },
    });
  }, [userProfile]);

  const showPaymentMethodErrorNotificaion = () => {
    AppNotification.toggleErrorNotification({
      message: "Error",
      description: "Please select payment method",
    });
    scrollToPosition({ point: 10 });
  };

  const onValidationErrorsHandler = (formErrors: Object, showPaymentMethodError: boolean) => {
    if (showPaymentMethodError) {
      showPaymentMethodErrorNotificaion();
    }
    if (Object.keys(formErrors).length === 1 && formErrors.hasOwnProperty("purchase_policy")) {
      if (showPaymentMethodError) {
        showPaymentMethodErrorNotificaion();
      } else {
        AppNotification.toggleErrorNotification({
          message: "Error",
          description: "Kindly agree to Purchase Policy",
        });
      }
    } else {
      if (formFieldsTopMargin.hasOwnProperty("dob")) formFieldsTopMargin["gender"] = formFieldsTopMargin["dob"];
      if (formFieldsTopMargin.hasOwnProperty("state")) {
        formFieldsTopMargin["zip"] = formFieldsTopMargin["state"];
        if (isOneTimeProduct) formFieldsTopMargin["sales_tax_found"] = formFieldsTopMargin["state"];
      }
      const sortedByLayoutValue = Object.keys(formFieldsTopMargin)
        .filter((errorViewPointKey) => Object.keys(formErrors).includes(errorViewPointKey))
        .sort((a, b) => formFieldsTopMargin[a] - formFieldsTopMargin[b]);
      if (showPaymentMethodError) showPaymentMethodErrorNotificaion();
      else scrollToPosition({ point: formFieldsTopMargin[sortedByLayoutValue[0]] });
    }
  };

  return (
    <Formik validateOnChange={validateOnChange} validateOnBlur={false} validateOnMount={false} initialValues={initialFormValues} validationSchema={checkoutFormSchema} onSubmit={(values) => handleFormSubmission(values)}>
      {({ values: formValues, errors: formErrors, touched, setFieldTouched, setFieldValue, handleSubmit, setFieldError, validateForm }) => {
        const handleFieldChange = (fieldName = "", value) => {
          if (fieldName === FORM_FIELDS.salesTaxFound.fieldName) {
            setFieldError(FORM_FIELDS.salesTaxFound.fieldName, value ? "" : "Sales tax not found");
          }
          // @ts-ignore
          setFieldTouched(fieldName, true);
          // @ts-ignore
          setFieldValue(fieldName, value);
        };

        const showPaymentMethodError = Boolean(!formValues.use_points && !isPaymentMethodAdded);

        const onSubmitHandler = () => {
          setValidateOnChange(true);
          validateForm().then((formErrors: Object) => {
            if (!isEmptyOrNil(formErrors)) {
              onValidationErrorsHandler(formErrors, showPaymentMethodError);
            } else {
              if (showPaymentMethodError) {
                showPaymentMethodErrorNotificaion();
              } else {
                handleSubmit();
              }
            }
          });
        };

        const showCardInformationSection = isPaymentSectionApplicable || getPaymentSectionVisibility(formValues);
        return (
          <View>
            {/* Location Based Payment for Soothe */}
            <If condition={isVendorSoothe}>
              <LocationBasedPaymentsSection formFieldsTopMargin={formFieldsTopMargin} formValues={formValues} formErrors={formErrors} handleFieldChange={handleFieldChange} setFieldError={setFieldError} />
            </If>

            <Collapsible
              duration={500}
              // style={{ paddingBottom: Metrics.baseMargin }}
              collapsed={isVendorSoothe && (isEmptyOrNil(formValues[FORM_FIELDS.location.fieldName]) || (propOr(0, "locationBasedPrice", state) as number) === 0)}
            >
              {/* checkout information */}
              <CheckoutDetailsSection formFieldsTopMargin={formFieldsTopMargin} formValues={formValues} formErrors={formErrors} handleFieldChange={handleFieldChange} />

              {/* card information section */}
              <If condition={showCardInformationSection}>
                <CardInformationSection formFieldsTopMargin={formFieldsTopMargin} isPaymentMethodAdded={isPaymentMethodAdded} formValues={formValues} formErrors={formErrors} handleFieldChange={handleFieldChange} />
              </If>

              <If condition={!isVendorSoothe}>
                <Then>
                  {/* DNA profile for information */}
                  <If condition={isVendorVitagene}>
                    <DNAProfileSection formFieldsTopMargin={formFieldsTopMargin} formValues={formValues} formErrors={formErrors} handleFieldChange={handleFieldChange} />
                  </If>

                  {/* Membership information */}
                  <If condition={showMembershipSection}>
                    <MembershipSection
                      touched={touched}
                      setFieldTouched={setFieldTouched}
                      formValues={formValues}
                      formErrors={formErrors}
                      handleFieldChange={handleFieldChange}
                      updateSalesTax={(params) => updateSalesTax({ ...params, handleFieldChange })}
                      isGymProduct={isGymProduct}
                      isShippingRequired={isShippingRequired}
                      formFieldsTopMargin={formFieldsTopMargin}
                      showDesiredGymLocationField={showDesiredGymLocationField}
                      showEmergencyContactFields={showEmergencyContactFields}
                    />
                  </If>

                  {/* Shipping Address information */}
                  <If condition={showShippingAddressSection || (isSubscribedAndShippingRequired && !showMembershipSection)}>
                    <ShippingAddressSection
                      touched={touched}
                      setFieldTouched={setFieldTouched}
                      formValues={formValues}
                      formErrors={formErrors}
                      handleFieldChange={handleFieldChange}
                      updateSalesTax={(params) => updateSalesTax({ ...params, handleFieldChange })}
                      formFieldsTopMargin={formFieldsTopMargin}
                    />
                  </If>

                  {/* Phone number Email Address information */}
                  <ContactInformationSection formFieldsTopMargin={formFieldsTopMargin} formValues={formValues} formErrors={formErrors} handleFieldChange={handleFieldChange} />
                </Then>
              </If>

              {/* contains twic policy toggle and payment submission button */}
              <DisclaimerSection formValues={formValues} formErrors={formErrors} handleFieldChange={handleFieldChange} />

              {/* Submit Button */}
              <RowContainer style={{ justifyContent: "center" }}>
                <If condition={!isPaymentMethodAdded && !showCardInformationSection}>
                  <PrimaryButton buttonLabel={"Add Default Payment Method"} onClickHandler={() => toggleBrainTreeUI()} width={APP_CONSTANTS.MUI_BTN_WIDTH} buttonColor={Colors.newPrimary} />
                </If>
              </RowContainer>
              <RowContainer style={{ justifyContent: "center" }}>
                <PrimaryButton buttonLabel={"Complete Purchase"} onClickHandler={onSubmitHandler} buttonColor={Colors.newPrimary} disabledColor={Colors.newDisabledPrimary} width={APP_CONSTANTS.MUI_BTN_WIDTH} testId="buy-product" />
              </RowContainer>
            </Collapsible>
          </View>
        );
      }}
    </Formik>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    twicStoreCheckout: (params) => dispatch(checkoutProductFromTwicStore(params)),
    getSalesTaxInfo: (params) => dispatch(getSalesTaxInfo(params)),
    toggleBrainTreeUI: () => dispatch(showBrainTreeDropIn()),
  };
};

export const CheckoutForm = connect(mapStateToProps, mapDispatchToProps)(CheckoutFormContent);
