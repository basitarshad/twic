import { setGeneralInfo } from "Actions";
import { AppHeading, AppScreenTitleContainer } from "Components";
import NewFormikInputField from "Components/Commons/FormFields/FormikFields/NewFormikInputField";
import { APP_CONSTANTS } from "Constants";
import { Formik, FormikProps } from "formik";
import * as React from "react";
import { View } from "react-native-animatable";
import { connect } from "react-redux";
import { useAccountsHook } from "Screens/Marketplace/useAccountsHook";
import { Colors, Fonts, Metrics } from "Themes";
import { PrimaryButton } from "twic_mobile_components";
import * as yup from "yup";
import { GeneralInfoFieldsType, GeneralInfoType } from "./types";

const GeneralInfoValidations = yup.object().shape({
  preferredFirstName: yup.string(),
  preferredEmail: yup.string().email("Invalid Personal Email").strict(true),
});

const Generalinfo = (props: GeneralInfoType) => {
  const { setGeneralInfo, userPreferredFirstName, userPersonalEmail, userCountry } = props;
  const { isPreTaxAccount } = useAccountsHook();

  const onSubmitForm = async (values: GeneralInfoFieldsType, actions: any) => {
    await setGeneralInfo({
      preferred_first_name: values.preferredFirstName,
      personal_email: values.preferredEmail,
    });
  };

  return (
    <Formik
      initialValues={{
        preferredFirstName: userPreferredFirstName,
        preferredEmail: userPersonalEmail,
      }}
      validationSchema={GeneralInfoValidations}
      onSubmit={(values: GeneralInfoFieldsType, actions: any) => onSubmitForm(values, actions)}
    >
      {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, dirty, isValid }: FormikProps<GeneralInfoFieldsType>) => {
        const { preferredFirstName, preferredEmail } = values;
        const handleFieldChange = (fieldName, value) => {
          setFieldTouched(fieldName, true);
          setFieldValue(fieldName, value);
        };

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
              <AppHeading fontSize={Fonts.size.medium} textTransform="capitalize" paddingTop={Metrics.doubleBaseMargin} fontWeight={"bold"}>
                Preferred First Name
              </AppHeading>
            </AppScreenTitleContainer>
            <NewFormikInputField
              fieldName="preferredFirstName"
              fieldProps={{
                label: "Preferred First Name (optional)",
                value: preferredFirstName,
                onChangeHandler: (value: string) => handleFieldChange("preferredFirstName", value),
                errorMessage: (touched.preferredFirstName && errors.preferredFirstName) || "",
                testId: "preferred-first-name",
              }}
            />
            {userCountry === "us" && isPreTaxAccount && (
              <>
                <AppScreenTitleContainer
                  customStyle={{
                    paddingVertical: 0,
                    marginBottom: Metrics.baseMargin + 6,
                    paddingHorizontal: 0,
                    fontWeight: 600,
                    marginTop: 20,
                  }}
                >
                  <AppHeading fontSize={Fonts.size.medium} textTransform="capitalize" paddingTop={Metrics.doubleBaseMargin} fontWeight={"bold"}>
                    Preferred Email
                  </AppHeading>
                </AppScreenTitleContainer>
                <NewFormikInputField
                  fieldName="email"
                  fieldProps={{
                    label: "Personal Email (optional)",
                    value: preferredEmail,
                    onChangeHandler: (value: string) => handleFieldChange("preferredEmail", value),
                    errorMessage: (touched.preferredEmail && errors.preferredEmail) || "",
                    testId: "personal-email",
                  }}
                />
              </>
            )}
            <View style={{ marginTop: 35, marginBottom: 10 }}>
              <PrimaryButton
                testId="preferred-first-name-save-button"
                disabled={!(Boolean(touched.preferredFirstName) || Boolean(touched.preferredEmail))}
                disabledColor={Colors.newDisabledPrimary}
                buttonColor={Colors.newPrimary}
                width={APP_CONSTANTS.MUI_BTN_WIDTH}
                onClickHandler={handleSubmit}
                buttonLabel="Save"
              />
            </View>
          </>
        );
      }}
    </Formik>
  );
};
const mapStateToProps = (state) => {
  return {
    userPreferredFirstName: state.userProfile.userInfo.preferredFirstName,
    userPersonalEmail: state.userProfile.userInfo.personalEmail,
    userCountry: state.userProfile.userInfo.country,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setGeneralInfo: (params) => dispatch(setGeneralInfo(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Generalinfo);
