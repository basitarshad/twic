import * as React from "react";
import NewFormikDatePickerField from "Components/Commons/FormFields/FormikFields/NewFormikDatePickerField";
import { View } from "react-native";
import { CalendarSvgIcon } from "Components/SvgIcons";
import { customStyles } from "Screens/Expense/NewExpenseForm";
import { Colors, Fonts, Images, Metrics } from "../../Themes";
import { isEmptyOrNil } from "../../Utils";
import { If, Then } from "react-if";

import { SectionContainer, RowContainer, SectionTitle } from "./StyledComponents";
import { AppText, FormikSwitchField, NewFormikInputField, DoubleInputsRow, DoubleInputsRowInnerLeftContainer, DoubleInputsRowInnerRightContainer, IconWithText, ErrorMessage, FormFieldContainer } from "../../Components/Commons";
import { AddressInformationSection } from "./AddressInformation";
import { FormSettings } from "./utils";

const { formFields: FORM_FIELDS } = FormSettings;

type DateOfBirthPickerProps = {
  onConfirmDate: (dob: any) => void;
  value: Date | string;
  errorMessage: string;
};

type genderSelectionType = "" | "male" | "female" | "Non-binary / Non-conforming";

type GenderSelectionFieldProps = {
  genderSelection: genderSelectionType;
  handleFieldChange: (fieldName: string, value: string) => void;
  errorMessage: string;
};

const DateOfBirthPickerField = ({ onConfirmDate, value, errorMessage }: DateOfBirthPickerProps) => (
  <NewFormikDatePickerField
    fieldName={FORM_FIELDS.dob.fieldName}
    fieldProps={{
      label: "Date of Birth",
      onConfirmDate: (dob) => onConfirmDate(dob),
      value,
      datePickerProps: {
        placeholder: "Date of Birth",
        customStyles: {
          ...customStyles,
          placeholderText: {
            ...customStyles.placeholderText,
            color: isEmptyOrNil(errorMessage) ? Colors.newDimGrey : Colors.error,
          },
        },
      },
      RenderCustomIcon: () => <CalendarSvgIcon width={17} height={17} color={isEmptyOrNil(errorMessage) ? Colors.charcoalLightGrey : Colors.error} />,
      errorMessage,
    }}
    // @ts-ignore
    labelPaddingTop={4}
    containerStyle={{ marginTop: 10, marginBottom: 25 }}
  />
);

const GenderSelectionField = ({ genderSelection, handleFieldChange, errorMessage }: GenderSelectionFieldProps) => (
  <View style={{ marginBottom: Metrics.doubleBaseMargin, marginTop: 15, marginRight: Metrics.newScreenHorizontalPadding }}>
    <SectionTitle style={{ fontSize: Fonts.size.normal }}>Gender</SectionTitle>
    <IconWithText
      iconStyle={{ height: Metrics.icons.extraSmall + 6, width: Metrics.icons.extraSmall + 6, marginHorizontal: 0, marginRight: Metrics.baseMargin, marginTop: 4 }}
      containerStyles={{ marginBottom: Metrics.baseMargin }}
      icon={genderSelection === "male" ? Images.activeRadio : Images.inactiveRadio}
      iconSize="tiny"
      useCustomIcon
      textStyle={{ marginBottom: 2 }}
      isDisabled={genderSelection === "male" ? true : false}
      text="Male"
      onLinkPress={() => handleFieldChange(FORM_FIELDS.userGender.fieldName, "male")}
      activeOpacity={1}
    />
    <IconWithText
      iconStyle={{ height: Metrics.icons.extraSmall + 6, width: Metrics.icons.extraSmall + 6, marginHorizontal: 0, marginRight: Metrics.baseMargin, marginTop: 4 }}
      containerStyles={{ marginBottom: Metrics.baseMargin }}
      icon={genderSelection === "female" ? Images.activeRadio : Images.inactiveRadio}
      iconSize="tiny"
      useCustomIcon
      textStyle={{ marginBottom: 2 }}
      isDisabled={genderSelection === "female" ? true : false}
      text="Female"
      onLinkPress={() => handleFieldChange(FORM_FIELDS.userGender.fieldName, "female")}
      activeOpacity={1}
    />
    <IconWithText
      iconStyle={{ height: Metrics.icons.extraSmall + 6, width: Metrics.icons.extraSmall + 6, marginHorizontal: 0, marginRight: Metrics.baseMargin, marginTop: 4 }}
      containerStyles={{ marginBottom: Metrics.baseMargin }}
      icon={genderSelection === "Non-binary / Non-conforming" ? Images.activeRadio : Images.inactiveRadio}
      iconSize="tiny"
      useCustomIcon
      textStyle={{ marginBottom: 2 }}
      isDisabled={genderSelection === "Non-binary / Non-conforming" ? true : false}
      text="Non-binary / Non-conforming"
      onLinkPress={() => handleFieldChange(FORM_FIELDS.userGender.fieldName, "Non-binary / Non-conforming")}
      activeOpacity={1}
    />
    <If condition={errorMessage}>
      <View style={{ marginLeft: Metrics.doubleBaseMargin }}>
        <AppText color={Colors.primary}>{errorMessage}</AppText>
      </View>
    </If>
  </View>
);

// user shipping address form
export const MembershipSection = (props) => {
  const { formValues, formErrors, handleFieldChange, isGymProduct, showEmergencyContactFields, showDesiredGymLocationField, isShippingRequired, formFieldsTopMargin } = props;
  const isMember = formValues[FORM_FIELDS.isMember.fieldName] === "yes";
  const genderField: string = formValues[FORM_FIELDS.userGender.fieldName];
  const genderSelection: genderSelectionType = genderField === "male" ? "male" : genderField === "female" ? "female" : genderField === "Non-binary / Non-conforming" ? "Non-binary / Non-conforming" : "";

  const onValueChange = (isMember) => {
    handleFieldChange(FORM_FIELDS.isMember.fieldName, isMember ? "yes" : "no");
  };

  const onConfirmDate = (dob) => {
    const formattedDate = !isEmptyOrNil(dob) ? dob : "";
    handleFieldChange(FORM_FIELDS.dob.fieldName, formattedDate);
  };

  return (
    <SectionContainer>
      <If condition={showDesiredGymLocationField}>
        <Then>
          <View>
            <SectionTitle style={{ paddingVertical: Metrics.baseMargin, fontSize: Fonts.size.normal }}>Desired Gym Location?</SectionTitle>
          </View>

          <FormFieldContainer name="home_gym" formFieldsTopMargin={formFieldsTopMargin}>
            <NewFormikInputField
              fieldName={FORM_FIELDS.homeGym.fieldName}
              fieldProps={{
                label: "Gym Location",
                value: formValues[FORM_FIELDS.homeGym.fieldName],
                onChangeHandler: (home_gym) => handleFieldChange(FORM_FIELDS.homeGym.fieldName, home_gym),
                keyboardType: "default",
                errorMessage: formErrors[FORM_FIELDS.homeGym.fieldName],
                testId: "home-gym",
              }}
              containerStyle={{
                marginBottom: 35,
              }}
            />
          </FormFieldContainer>
        </Then>
      </If>

      <RowContainer style={{ paddingVertical: 0 }}>
        <SectionTitle style={{ fontSize: Fonts.size.normal }}>Membership Information</SectionTitle>
      </RowContainer>

      <View>
        <RowContainer style={{ paddingBottom: Metrics.doubleBaseMargin }}>
          <RowContainer style={{ paddingVertical: 0 }}>
            <AppText testID="membership-status-text" accessibilityLabel="membership-status-text" numberOfLines={2} ellipsizeMode="tail" width={Metrics.screenWidth / 1.5}>
              {/* I’m currently a member of {propOr('this product', 'vendorTitle', product)}. */}
              Transfer my existing membership to Forma.
            </AppText>
          </RowContainer>
          <FormikSwitchField
            fieldName={FORM_FIELDS.isMember.fieldName}
            fieldProps={{
              value: isMember,
              onValueChange: () => onValueChange(!isMember),
              testId: "membership-status-toggle",
            }}
          />
        </RowContainer>

        <If condition={isMember}>
          <FormFieldContainer name="membership_number" formFieldsTopMargin={formFieldsTopMargin}>
            <NewFormikInputField
              fieldName={FORM_FIELDS.membershipNumber.fieldName}
              fieldProps={{
                label: "Membership Email",
                value: formValues[FORM_FIELDS.membershipNumber.fieldName],
                onChangeHandler: (membership_number) => handleFieldChange(FORM_FIELDS.membershipNumber.fieldName, membership_number),
                keyboardType: "email-address",
                errorMessage: formErrors[FORM_FIELDS.membershipNumber.fieldName],
                testId: "membership-number",
              }}
              containerStyle={{ marginBottom: 35 }}
            />
          </FormFieldContainer>
        </If>
      </View>

      <FormFieldContainer name="dob" formFieldsTopMargin={formFieldsTopMargin}>
        <DoubleInputsRow>
          <DoubleInputsRowInnerLeftContainer width={"42%"}>
            <DateOfBirthPickerField onConfirmDate={(dob) => onConfirmDate(dob)} errorMessage={formErrors[FORM_FIELDS.dob.fieldName]} value={formValues[FORM_FIELDS.dob.fieldName]} />
          </DoubleInputsRowInnerLeftContainer>
          <DoubleInputsRowInnerRightContainer width={"53%"}>
            <GenderSelectionField errorMessage={formErrors[FORM_FIELDS.userGender.fieldName]} genderSelection={genderSelection} handleFieldChange={handleFieldChange} />
          </DoubleInputsRowInnerRightContainer>
        </DoubleInputsRow>
      </FormFieldContainer>

      <If condition={showEmergencyContactFields}>
        <Then>
          <>
            <FormFieldContainer name="emergency_name" formFieldsTopMargin={formFieldsTopMargin}>
              <NewFormikInputField
                fieldName={FORM_FIELDS.emergencyName.fieldName}
                fieldProps={{
                  label: "Emergency Contact Name",
                  value: formValues[FORM_FIELDS.emergencyName.fieldName],
                  onChangeHandler: (emergency_name) => handleFieldChange(FORM_FIELDS.emergencyName.fieldName, emergency_name),
                  keyboardType: "default",
                  errorMessage: formErrors[FORM_FIELDS.emergencyName.fieldName],
                  testId: "emergency-contact-number",
                }}
                containerStyle={{ marginTop: 25 }}
              />
            </FormFieldContainer>
            <FormFieldContainer name="emergency_phone" formFieldsTopMargin={formFieldsTopMargin}>
              <NewFormikInputField
                fieldName={FORM_FIELDS.emergencyPhone.fieldName}
                fieldProps={{
                  label: "Emergency Phone Number",
                  value: formValues[FORM_FIELDS.emergencyPhone.fieldName],
                  onChangeHandler: (emergency_phone) => handleFieldChange(FORM_FIELDS.emergencyPhone.fieldName, emergency_phone),
                  keyboardType: "phone-pad",
                  errorMessage: formErrors[FORM_FIELDS.emergencyPhone.fieldName],
                  testId: "emergency-phone-number",
                }}
                containerStyle={{ marginTop: 25, marginBottom: 35 }}
              />
            </FormFieldContainer>
          </>
        </Then>
      </If>

      <If condition={isShippingRequired || isGymProduct}>
        <Then>
          <>
            <SectionTitle style={{ paddingVertical: Metrics.baseMargin, fontSize: Fonts.size.normal }}>Confirm your Address</SectionTitle>
            <AddressInformationSection formFieldsTopMargin={formFieldsTopMargin} {...props} />
          </>
        </Then>
      </If>
    </SectionContainer>
  );
};
