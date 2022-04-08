import * as React from "react";
import { Keyboard, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { InputField } from "twic_mobile_components";
import Icon from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";

import { APP_CONSTANTS } from "Constants";
import { AppText, FormFieldContainer, IconWithText } from "Components";
import { NavigationService } from "Services";
import { Colors, Fonts, Metrics } from "Themes";
import { PlusCircleSvgIcon } from "Components/SvgIcons";

import { APP_ROUTES } from "../../Navigation";
import { DependentContainer, DependentsPickerWrapper, PickerIconContainer } from "./StyledComponents";
import { ClaimantType } from "./types";

export const DependentsPicker = ({ values, setValues, errors, formFieldsTopMargin }) => {
  const { claimant } = values;
  const pretaxClaimRef = React.useRef<any>(null);
  const [listCollapsed, setListCollapsed] = React.useState(true);

  const userProfile = useSelector((state) => pathOr([], ["userProfile"], state));

  const updatedDependents = React.useMemo(() => {
    const { dependents, userInfo, cdhProfileDetail } = userProfile;
    const { firstName, lastName, middleInitial } = cdhProfileDetail;
    // Adding current user to dropdown list
    const profileUser = {
      dependentId: userInfo.id,
      employeeFullName: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      middleInitial,
      relationship: "Self",
      dependentStatus: "",
    };

    return [profileUser, ...dependents];
  }, [userProfile]);

  const onClaimantSelection = (claimant: ClaimantType) => {
    setValues({ ...values, claimant });
  };

  const hideDependentsList = () => {
    setListCollapsed(true);
    pretaxClaimRef.current.handleBlur();
  };

  return (
    <>
      <FormFieldContainer style={{ zIndex: 12 }} name={"claimant"} formFieldsTopMargin={formFieldsTopMargin}>
        {/* WE NEED DIFFERENT BOX SHADOWS FOR DIFFERENT IOS'S BECAUSE THEIR BEHAVIOURS ARE DIFFERENT */}
        <InputField
          label="Claimant"
          value={`${claimant.firstName} ${claimant.lastName}`.trim()}
          multiLine={true}
          setRef={(ref) => (pretaxClaimRef.current = ref)}
          onChangeHandler={() => {}}
          textProps={{
            render: () => (
              <TouchableOpacity
                onPress={() => {
                  !listCollapsed ? pretaxClaimRef.current.handleBlur() : pretaxClaimRef.current.handleFocus();
                  setListCollapsed(!listCollapsed);
                  Keyboard.dismiss();
                }}
              >
                <DependentsPickerWrapper>
                  <AppText fontSize={Fonts.size.regular}>{`${claimant.firstName} ${claimant.lastName}`}</AppText>
                  <PickerIconContainer>
                    <Icon name="caretdown" size={APP_CONSTANTS.IS_ANDROID ? Fonts.size.tiny : Fonts.size.extraSmall} color={errors.claimant ? Colors.error : Colors.charcoalLightGrey} />
                  </PickerIconContainer>
                </DependentsPickerWrapper>
              </TouchableOpacity>
            ),
          }}
          placeholder="Claimant"
          errorMessage={errors.claimant ? "Claimant is required" : ""}
          testId="who-is-making-claim"
          inputFieldStyle={{ marginTop: 25, marginBottom: 10 }}
        />
        {!listCollapsed && (
          <DependentContainer
            marginBottom={20}
            style={{
              flex: 1,
            }}
          >
            <ScrollView style={{ flex: 1, maxHeight: 180 }} nestedScrollEnabled={true}>
              {updatedDependents.map((claimant: ClaimantType, key) => (
                <TouchableOpacity
                  key={key}
                  style={{ paddingVertical: Metrics.baseMargin - 2 }}
                  onPress={() => {
                    hideDependentsList();
                    onClaimantSelection(claimant);
                  }}
                >
                  <AppText color={Colors.charcoalDarkGrey}>{`${claimant.firstName} ${claimant.lastName}`}</AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <IconWithText
              text="Add New Dependent"
              onLinkPress={() => {
                hideDependentsList();
                NavigationService.navigate(APP_ROUTES.ADD_NEW_DEPENDENT);
              }}
              useSvgIcon={true}
              RenderSvgIcon={() => <PlusCircleSvgIcon fillColor={Colors.newBlue} />}
              iconColor={Colors.newBlue}
              textStyle={{
                fontFamily: "TTCommons-DemiBold",
                width: "auto",
                fontWeight: APP_CONSTANTS.IS_ANDROID ? "400" : "bold",
                color: Colors.blue,
                fontSize: APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium,
                textTransform: "none",
              }}
              iconStyle={{
                marginHorizontal: 0,
                marginRight: Metrics.smallMargin,
              }}
              containerStyles={{
                paddingTop: APP_CONSTANTS.IS_ANDROID ? Metrics.baseMargin - 1 : Metrics.baseMargin + 2,
              }}
              testId="add-new-dependent"
            />
          </DependentContainer>
        )}
      </FormFieldContainer>
      {!listCollapsed && (
        <TouchableWithoutFeedback onPressIn={hideDependentsList}>
          <View style={{ position: "absolute", width: Metrics.screenWidth, top: 0, left: 0, right: 0, bottom: 10, zIndex: 10 }} />
        </TouchableWithoutFeedback>
      )}
    </>
  );
};
