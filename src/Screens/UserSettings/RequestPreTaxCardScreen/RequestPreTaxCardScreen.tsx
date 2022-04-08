import * as React from "react";
import { Formik, FormikProps } from "formik";
import { Dimensions, View } from "react-native";
import { connect } from "react-redux";
import { propOr } from "ramda";
import { PrimaryButton } from "twic_mobile_components";

import { AppHeading, AppScreenTitle, AppScreenTitleContainer, IconWithText } from "../../../Components";
import { Fonts, Metrics, Colors } from "../../../Themes";
import { UserDependentBasicInfoType } from "../../../types";
import { PlusCircleSvgIcon } from "../../../Components/SvgIcons";
import { APP_ROUTES } from "../../../Navigation";
import { NavigationService } from "../../../Services";
import { requestPretaxCardFormValidation } from "./meta";
import { toggleAppScreenLoader } from "../../../Actions";
import { isEmptyOrNil } from "../../../Utils";
import { APP_CONSTANTS } from "../../../Constants";
import { RequestPreTaxCardFormFieldsType, RequestPreTaxCardScreenType } from "./types";
import { RequestPretaxCardSubmitButtonContainer } from "./StyledComponents";
import { ScreenWrapper } from "../../../Components/Commons/ScreenWrapper";
import NewFormikPickerField from "Components/Commons/FormFields/FormikFields/NewFormikPickerField";

export const buttonWidth = Dimensions.get("screen").width - 32;

const USER_PROFILE = "userProfile";

const RequestPreTaxCardScreen = (props: RequestPreTaxCardScreenType) => {
  const { dependents, route, demographics } = props;
  const selectedDependent = React.useCallback(() => route.params?.selectedDependent, [route]);
  const updatedDependents = () => {
    const userDropdown = {
      // value is given string so that profile user by=pass the formik validation of empty string
      value: USER_PROFILE,
      label: `${demographics.firstName} ${demographics.lastName}`,
    };
    const formatedDependents = dependents.map((dependent: UserDependentBasicInfoType) => ({
      value: dependent.dependentId,
      label: `${dependent.firstName} ${dependent.lastName}`,
      key: dependent.dependentId,
    }));
    return [userDropdown, ...formatedDependents];
  };

  return (
    <ScreenWrapper newDesignSystem scrollView={false} screenContainerStyle={{ paddingTop: 0 }}>
      <AppScreenTitleContainer
        customStyle={{
          paddingHorizontal: 0,
        }}
      >
        <AppScreenTitle paddingBottom={Metrics.doubleBaseMargin}>Request a Card</AppScreenTitle>
      </AppScreenTitleContainer>
      <AppHeading fontSize={Fonts.size.h4} paddingBottom={Metrics.baseMargin + 5}>
        Do you want to request a card for an existing dependent or add a new dependent?
      </AppHeading>
      <Formik
        // Different initial values because this screen can be accessed through
        // updateDependent and pretaxcard details
        initialValues={{
          dependentId: !isEmptyOrNil(selectedDependent()) ? selectedDependent().dependentId : "",
        }}
        validationSchema={requestPretaxCardFormValidation}
        validateOnMount
        onSubmit={(values: RequestPreTaxCardFormFieldsType) => {
          const { dependentId } = values;
          const dependentInfo =
            dependentId === USER_PROFILE
              ? {
                  dependentId: "",
                  firstName: propOr("", "firstName", demographics),
                  lastName: propOr("", "lastName", demographics),
                }
              : dependents.find((dependent: UserDependentBasicInfoType) => dependent.dependentId === dependentId) || { dependentId: "", firstName: "", lastName: "" };
          NavigationService.navigate(APP_ROUTES.REQUEST_PRETAX_CARD_WITH_EXISTING_DEPENDENT, {
            dependentInfo,
            demographics,
          });
        }}
      >
        {({ values, setFieldTouched, setFieldValue, handleSubmit, isValid }: FormikProps<RequestPreTaxCardFormFieldsType>) => {
          const handleFieldChange = async (fieldName, value) => {
            setFieldTouched(fieldName, true);
            // Giving empty string because validations were not being evaluated on null
            setFieldValue(fieldName, value || "");
          };
          const { dependentId } = values;
          return (
            <>
              <NewFormikPickerField
                fieldName="dependent"
                fieldProps={{
                  label: "Select a Cardholder",
                  value: dependentId,
                  onValueChange: (value: string) => handleFieldChange("dependentId", value),
                  placeholderText: "Select a Cardholder",
                  items: updatedDependents(),
                  testId: "dependents-list",
                }}
              />
              <AppHeading color={Colors.charcoalLightGrey} paddingTop={Metrics.baseMargin + 5} paddingBottom={Metrics.baseMargin + 8} fontWeight="200">
                or
              </AppHeading>
              <IconWithText
                text="Add New Dependent"
                iconColor={Colors.newBlue}
                textStyle={{
                  fontFamily: "TTCommons-DemiBold",
                  width: "auto",
                  fontSize: Fonts.size.small,
                  fontWeight: APP_CONSTANTS.IS_ANDROID ? "400" : "bold",
                  color: Colors.newBlue,
                }}
                useSvgIcon={true}
                RenderSvgIcon={() => (
                  <View style={{ marginTop: 4 }}>
                    <PlusCircleSvgIcon fillColor={Colors.newBlue} />
                  </View>
                )}
                onLinkPress={() => NavigationService.navigate(APP_ROUTES.REQUEST_PRETAX_CARD_WITH_NEW_DEPENDENT)}
                iconStyle={{
                  marginHorizontal: 0,
                  marginRight: Metrics.baseMargin,
                }}
                testId="add-new-dependent-button"
              />
              <RequestPretaxCardSubmitButtonContainer>
                <PrimaryButton
                  testId="confirm-pretax-card-button"
                  width={buttonWidth}
                  shadowOptions={{
                    width: 0,
                  }}
                  disabledColor={Colors.newDisabledPrimary}
                  buttonColor={Colors.newPrimary}
                  disabled={Boolean(!isValid)}
                  onClickHandler={handleSubmit}
                  buttonLabel="Next"
                />
              </RequestPretaxCardSubmitButtonContainer>
            </>
          );
        }}
      </Formik>
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    dependents: state.userProfile.dependents,
    demographics: state.userProfile.cdhProfileDetail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLoader: (loaderVisibilty: boolean) => dispatch(toggleAppScreenLoader(loaderVisibilty)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestPreTaxCardScreen);
