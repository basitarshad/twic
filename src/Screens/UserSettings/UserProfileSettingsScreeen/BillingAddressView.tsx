import * as React from "react";
import { View } from "react-native";
import useAxios from "axios-hooks";
import { connect } from "react-redux";
import { propOr, pathOr } from "ramda";
import { Formik, FormikProps } from "formik";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { PrimaryButton } from "twic_mobile_components";

import { AppScreenTitleContainer, AppNotification, AppHeading, AddressForm } from "Components";
import { Metrics, Colors, Fonts } from "Themes";
import { APP_ENDPOINTS } from "Services";
import { fetchUserProfile } from "Actions";
import { validateZipcode } from "Utils";
import { toggleAppScreenLoader } from "Actions/appLoader.actions";
import { APP_CONSTANTS } from "Constants";
import { BillingAddressFormFieldsType, BillingAddressViewType } from "./types";

const formValidationSchema = (userCountry: string) => {
  return yup.object().shape({
    street: yup.string().required("Street Address is required"),
    street_ext: yup.string(),
    zip: yup
      .string()
      .required("Zip code is required")
      .test("match", "Enter correct Zip code", function (zip) {
        if (zip) {
          const zipCode = validateZipcode(userCountry, zip);
          if (!zipCode) {
            return this.createError({
              message: "Kindly enter correct zip code",
              path: "zip",
            });
          } else return true;
        }
        return true;
      }),
    locality: yup.string().required("City is required"),
    state: userCountry === "us" ? yup.string().nullable().required("State is required") : yup.string().nullable(),
  });
};

const BillingAddressView = (props: BillingAddressViewType) => {
  const { getUserProfile, toggleLoader } = props;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const userInfo = useSelector((state) => pathOr("us", ["userProfile", "userInfo"], state));
  const { street, street_ext, locality, state, zip } = propOr({}, "address", userInfo);

  const [userAddressResponse, updateUserAddress] = useAxios({ url: APP_ENDPOINTS.USER_PROFILE, method: "POST" }, { manual: true });
  const { data = {}, error } = userAddressResponse;

  const updateUserAddressHandler = React.useCallback((values: BillingAddressFormFieldsType) => {
    const formattedAddress = { ...values, city: values.locality };
    toggleLoader(true);
    updateUserAddress({ data: { shipping_address: formattedAddress } });
  }, []);

  React.useEffect(() => {
    if (error) {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: "Failed to update address. Please try again.",
      });
      toggleLoader(true);
      return;
    }
    const success = pathOr(false, ["success"], data);

    if (success) {
      getUserProfile();
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "Address updated successfully!",
      });
      toggleLoader(false);
    }
  }, [data, error]);

  return (
    <>
      <AppScreenTitleContainer
        customStyle={{
          marginBottom: Metrics.baseMargin + 6,
          marginTop: Metrics.doubleBaseMargin,
          paddingVertical: 0,
          paddingHorizontal: 0,
          fontWeight: 600,
        }}
      >
        <AppHeading fontSize={Fonts.size.medium} textTransform="capitalize" fontWeight={"bold"} paddingTop={0}>
          Primary Residence
        </AppHeading>
      </AppScreenTitleContainer>
      <Formik
        initialValues={{
          street,
          street_ext,
          locality,
          state,
          zip,
        }}
        validationSchema={() => formValidationSchema(userCountry)}
        onSubmit={(values: BillingAddressFormFieldsType) => {
          updateUserAddressHandler(values);
        }}
      >
        {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, dirty, isValid }: FormikProps<BillingAddressFormFieldsType>) => {
          const { street, street_ext, locality, state, zip } = values;
          const handleFieldChange = (fieldName, value) => {
            setFieldTouched(fieldName, true);
            setFieldValue(fieldName, value);
          };

          return (
            <>
              <AddressForm
                config={{
                  line1: {
                    name: "street",
                    value: street,
                    error: propOr("", "street", errors),
                    touched: propOr("", "street", touched),
                    label: "Street Address",
                    testId: "line1",
                  },
                  line2: {
                    name: "street_ext",
                    value: street_ext,
                    error: propOr("", "street_ext", errors),
                    touched: propOr("", "street_ext", touched),
                    label: `Apt, Building, Suite ${touched.street_ext || values.street_ext ? "(optional)" : ""}`,
                    testId: "line2",
                  },
                  zip: {
                    name: "zip",
                    value: zip,
                    error: propOr("", "zip", errors),
                    touched: propOr("", "zip", touched),
                    label: "Zip Code",
                    testId: "zip",
                  },
                  state: {
                    name: "state",
                    value: state,
                    error: propOr("", "state", errors),
                    touched: propOr("", "state", touched),
                    label: "State",
                    placeholder: "State",
                    testId: "state",
                    hide: userCountry !== "us",
                  },
                  city: {
                    name: "locality",
                    value: locality,
                    error: propOr("", "locality", errors),
                    touched: propOr("", "locality", touched),
                    label: "City",
                    testId: "city",
                  },
                }}
                onFieldChange={handleFieldChange}
                onFieldTouched={setFieldTouched}
              />
              <View style={{ alignItems: "center", marginTop: 35 }}>
                <PrimaryButton
                  testId="change-address-save-button"
                  buttonColor={Colors.newPrimary}
                  disabled={Boolean(!isValid || !dirty)}
                  disabledColor={Colors.newDisabledPrimary}
                  onClickHandler={handleSubmit}
                  buttonStyle={{ height: 48 }}
                  buttonLabel="Save"
                  width={APP_CONSTANTS.MUI_BTN_WIDTH}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserProfile: () => dispatch(fetchUserProfile()),
    toggleLoader: (loaderVisibility: boolean) => dispatch(toggleAppScreenLoader(loaderVisibility)),
  };
};

export default connect(null, mapDispatchToProps)(BillingAddressView);
