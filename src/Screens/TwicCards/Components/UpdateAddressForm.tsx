import * as React from "react";
import { View } from "react-native";
import { Formik, FormikProps } from "formik";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PrimaryButton } from "twic_mobile_components";

import { AddressForm, AppScreenTitle } from "../../../Components";
import { AddressType } from "../../../types";
import { Colors, Metrics } from "../../../Themes";
import { validateZipcode } from "../../../Utils";
import { UpdateAddressFormFieldsType } from "../types";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { APP_CONSTANTS } from "Constants";

const FormValidations = (userCountry: string) => {
  return yup.object().shape({
    line1: yup.string().required("Address is required."),
    line2: yup.string(),
    city: yup.string().required("City is required."),
    state: yup.string().nullable().required("State is required."),
    zip: yup
      .string()
      .required("Zip code is required")
      .test("match", "Invalid Zip code", function (zip) {
        if (zip) {
          const zipCode = validateZipcode(userCountry, zip);
          if (!zipCode) {
            return this.createError({
              message: "Invalid zip code",
              path: "zip",
            });
          } else return true;
        }
        return false;
      }),
  });
};

export const UpdateAddressForm = (props) => {
  const { route } = props;
  const address: AddressType = route.params.address || {};
  const onFormSubmit: (values) => void = route.params.onFormSubmit;
  const screenTitle: string = route.params.screenTitle || {};
  const { city, state, zip = "", line1, line2, country } = address;

  return (
    <ScreenWrapper newDesignSystem scrollView={false}>
      <Formik
        initialValues={{
          line1,
          line2,
          city,
          state,
          zip,
        }}
        validationSchema={FormValidations(country)}
        onSubmit={onFormSubmit}
      >
        {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, dirty, isValid }: FormikProps<UpdateAddressFormFieldsType>) => {
          const { line1, line2, city, state, zip } = values;
          const handleFieldChange = (fieldName, value) => {
            setFieldTouched(fieldName, true);
            setFieldValue(fieldName, value);
          };
          return (
            <>
              <View style={{ flex: 6 }}>
                <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false} enableOnAndroid={true} extraScrollHeight={60}>
                  <AppScreenTitle paddingBottom={Metrics.doubleBaseMargin} textTransform="capitalize">
                    {screenTitle}
                  </AppScreenTitle>
                  <AddressForm
                    config={{
                      line1: {
                        name: "line1",
                        value: line1,
                        touched: touched.line1,
                        error: errors.line1,
                        label: "Address",
                        testId: "line1",
                      },
                      line2: {
                        name: "line2",
                        value: line2,
                        touched: touched.line2,
                        error: errors.line2,
                        label: `Unit, Apt or Suite ${touched.line2 || line2 ? " (optional)" : ""}`,
                        testId: "line2",
                      },
                      city: {
                        name: "city",
                        value: city,
                        touched: touched.city,
                        error: errors.city,
                        label: "City",
                        testId: "city",
                      },
                      zip: {
                        name: "zip",
                        value: zip,
                        touched: touched.zip,
                        error: errors.zip,
                        label: "Zip Code",
                        testId: "zip",
                      },
                      state: {
                        name: "state",
                        value: state,
                        touched: touched.state,
                        error: errors.state,
                        label: "State",
                        placeholder: "State",
                        testId: "state",
                      },
                    }}
                    onFieldChange={handleFieldChange}
                    onFieldTouched={setFieldTouched}
                  />
                  <View style={{ marginBottom: Metrics.baseMargin, marginTop: Metrics.doubleSection }}>
                    <PrimaryButton
                      width={APP_CONSTANTS.MUI_BTN_WIDTH}
                      shadowOptions={{
                        width: "0%",
                      }}
                      buttonColor={Colors.newPrimary}
                      disabledColor={Colors.newDisabledPrimary}
                      disabled={Boolean(!isValid || !dirty)}
                      onClickHandler={handleSubmit}
                      buttonLabel="Save"
                      testId="update-address-submit-button"
                    />
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </>
          );
        }}
      </Formik>
    </ScreenWrapper>
  );
};
