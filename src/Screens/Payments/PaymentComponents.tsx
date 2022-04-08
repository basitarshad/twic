import * as React from "react";
import { TouchableOpacity, View, ScrollView, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Collapsible from "react-native-collapsible";
import { If, Then } from "react-if";
import { PrimaryButton, SecondaryButton } from "twic_mobile_components";

import { AppHeading, AppScreenTitle, AppText } from "../../Components";
import { APP_CONSTANTS } from "../../Constants";
import { Metrics, Fonts, Colors } from "../../Themes";
import { isEmptyOrNil } from "../../Utils";
import { PaymentComponentActionButtonType } from "./types";
import {
  PaymentsComponentActionButtonsWithOpacityStyle,
  PaymentsComponentActionButtonsWithoutOpacityStyle,
  PaymentsComponentBulletPointContainerStyle,
  PaymentsComponentBulletPointsSectionContainerStyle,
  PaymentsComponentBulletPointStyle,
  PaymentsComponentConnectedAccountsContentButtonStyle,
  PaymentsComponentConnectedAccountsTextStyle,
  PaymentsComponentDrawerContainerStyle,
  PaymentsComponentSaveActionButtonsContainerStyle,
  PaymentsComponentSecondaryButtonConatinerStyle,
  PaymentsComponentSectionHeadingContainer,
  PaymentsComponentSectionHeadingContentContainer,
  PaymentsComponentSubSectionsTextStyle,
} from "./StyledComponents";
import DrawerDivider from "./DrawerDivider";

const appTextFontSize = APP_CONSTANTS.IS_ANDROID ? Fonts.size.medium : Fonts.size.regular;

export const iconStyle = {
  height: Metrics.icons.regular,
  width: Metrics.icons.regular,
};

export const PaymentsFeatureHeader = () => {
  return (
    <>
      <AppScreenTitle size={Fonts.size.h1 + Metrics.smallMargin} fontWeight="bold">
        Payments
      </AppScreenTitle>
      <AppText fontSize={appTextFontSize} paddingTop={Metrics.smallMargin} color={Colors.charcoalLightGrey}>
        Manage your claims reimbursement preference and backup payment methods.
      </AppText>
    </>
  );
};

export const SubSectionsText = (props: { title: string; description: string }) => {
  const { title, description } = props;
  return (
    <PaymentsComponentSubSectionsTextStyle>
      <AppScreenTitle size={Fonts.size.h2} marginTop={Metrics.doubleSection} testID="bank-account" accessibilityLabel="bank-account">
        {title}
      </AppScreenTitle>
      <AppText paddingTop={Metrics.smallMargin} color={Colors.charcoalLightGrey}>
        {description}
      </AppText>
    </PaymentsComponentSubSectionsTextStyle>
  );
};

export const OverAndUnderTextWithIcon = (props: { title: string; description: string; titleColor?: string; titleFontWeight?: number | string; titleFontSize?: number; icon: () => JSX.Element }) => {
  const { title, description, icon, titleColor = Colors.primaryText, titleFontWeight = 500, titleFontSize = APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium } = props;
  return (
    <PaymentsComponentConnectedAccountsContentButtonStyle>
      {icon()}
      <PaymentsComponentConnectedAccountsTextStyle>
        <If condition={!isEmptyOrNil(title)}>
          <Then>
            <AppText fontWeight={titleFontWeight} fontSize={titleFontSize} color={titleColor}>
              {title}
            </AppText>
          </Then>
        </If>
        <If condition={!isEmptyOrNil(description)}>
          <Then>
            <AppText color={Colors.charcoalLightGrey} fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small}>
              {description}
            </AppText>
          </Then>
        </If>
      </PaymentsComponentConnectedAccountsTextStyle>
    </PaymentsComponentConnectedAccountsContentButtonStyle>
  );
};

export const ActionButton = (props: PaymentComponentActionButtonType) => {
  const { needTouchableOpacity = true, containerStyle = {}, primaryComponent, secondaryComponent = () => <></>, onPress = () => {} } = props;

  if (needTouchableOpacity) {
    return (
      <PaymentsComponentActionButtonsWithOpacityStyle style={containerStyle} onPress={onPress}>
        {primaryComponent()}
        {secondaryComponent()}
      </PaymentsComponentActionButtonsWithOpacityStyle>
    );
  } else {
    return (
      <PaymentsComponentActionButtonsWithoutOpacityStyle style={containerStyle}>
        {primaryComponent()}
        {secondaryComponent()}
      </PaymentsComponentActionButtonsWithoutOpacityStyle>
    );
  }
};

const BulletPointsSection = (props: { bulletPoints: Array<any>; fieldName?: string }) => {
  const { bulletPoints, fieldName = "name" } = props;
  return (
    <PaymentsComponentBulletPointsSectionContainerStyle>
      {bulletPoints.map((bullet) => (
        <PaymentsComponentBulletPointContainerStyle>
          <PaymentsComponentBulletPointStyle backgroundColor={Colors.newBlue} />
          <AppText fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small}>&nbsp;&nbsp;{bullet[fieldName]}</AppText>
        </PaymentsComponentBulletPointContainerStyle>
      ))}
    </PaymentsComponentBulletPointsSectionContainerStyle>
  );
};

export const NoteSection = (props: { title: string; description: string; bulletPoints: Array<any> }) => {
  const { title, description, bulletPoints } = props;
  return (
    <PaymentsComponentActionButtonsWithoutOpacityStyle style={{ flexDirection: "column", alignItems: "flex-start" }}>
      <AppText fontSize={appTextFontSize} paddingBottom={Metrics.baseMargin} testID={title} accessibilityLabel={title}>
        {title}
      </AppText>
      <AppText color={Colors.charcoalLightGrey}>{description}</AppText>
      <BulletPointsSection bulletPoints={bulletPoints} />
    </PaymentsComponentActionButtonsWithoutOpacityStyle>
  );
};

export const DrawerContent = (props: {
  reimbursementMethod: string;
  reimbursementMethodDescription: string;
  aboutCheckReimbursementSection?: () => JSX.Element;
  accountsSection?: () => JSX.Element;
  secondaryButtonOnPress: () => void;
  primaryButtonOnPress: () => void;
  middleSection?: () => JSX.Element;
}) => {
  const { reimbursementMethod, reimbursementMethodDescription, aboutCheckReimbursementSection, accountsSection = () => <></>, middleSection = () => <></>, primaryButtonOnPress, secondaryButtonOnPress } = props;
  const isAboutCheckReimbursementSectionProvided = Boolean(aboutCheckReimbursementSection);
  const actionButtonsWidth = (Metrics.screenWidth - 32) / 2 - 5;
  return (
    <PaymentsComponentDrawerContainerStyle style={{ height: APP_CONSTANTS.IS_ANDROID ? Metrics.screenHeight / 1.95 : Metrics.screenHeight / 1.75 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback>
          <View style={{ height: "100%", marginTop: Metrics.baseMargin }}>
            <AppScreenTitle size={Fonts.size.h1}>Reimbursement Method</AppScreenTitle>
            <DrawerDivider />
            <AppScreenTitle size={Fonts.size.medium} marginTop={Metrics.doubleBaseMargin}>
              {reimbursementMethod}
            </AppScreenTitle>
            <AppText fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small} paddingTop={Metrics.smallMargin} color={Colors.charcoalDarkGrey}>
              {reimbursementMethodDescription}
            </AppText>
            <View style={{ marginTop: Metrics.doubleBaseMargin }}>{middleSection()}</View>
            <DrawerDivider marginTop={Metrics.doubleBaseMargin} />
            <CollapsibleSection title="Accounts" content={accountsSection} />
            {isAboutCheckReimbursementSectionProvided && <DrawerDivider marginTop={Metrics.doubleBaseMargin} />}
            {isAboutCheckReimbursementSectionProvided && <CollapsibleSection title="About Check Reimbursement" content={aboutCheckReimbursementSection} />}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <PaymentsComponentSaveActionButtonsContainerStyle>
        <SecondaryButton buttonLabel="Cancel" onClickHandler={secondaryButtonOnPress} width={actionButtonsWidth} labelStyle={{ textAlign: "center", color: Colors.newBlue }} />
        <PrimaryButton buttonColor={Colors.newPrimary} shadowOptions={{ width: "0%" }} width={actionButtonsWidth} buttonLabel="Save" onClickHandler={primaryButtonOnPress} />
      </PaymentsComponentSaveActionButtonsContainerStyle>
    </PaymentsComponentDrawerContainerStyle>
  );
};

export const CollapsibleSection = (props: { title: string; content?: () => JSX.Element }) => {
  const { title, content } = props;
  const [isCollapsed, setCollapsed] = React.useState(true);
  return (
    <>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setCollapsed(!isCollapsed)}>
        <PaymentsComponentSectionHeadingContainer>
          <PaymentsComponentSectionHeadingContentContainer width="80%" alignItems="flex-start">
            <AppHeading paddingTop={Metrics.doubleBaseMargin}>{title}</AppHeading>
          </PaymentsComponentSectionHeadingContentContainer>

          <PaymentsComponentSectionHeadingContentContainer width="20%" alignItems="flex-end" justifyContent="center">
            <Icon color={Colors.black} name={isCollapsed ? "caretdown" : "caretup"} size={12} style={{ marginTop: Metrics.baseMargin + Metrics.smallMargin }} />
          </PaymentsComponentSectionHeadingContentContainer>
        </PaymentsComponentSectionHeadingContainer>
      </TouchableOpacity>

      {content && (
        <Collapsible duration={500} align="center" style={{ marginBottom: Metrics.baseMargin }} collapsed={isCollapsed}>
          {content()}
        </Collapsible>
      )}
    </>
  );
};

export const CollapsibleContent = (props: { description: string; fieldName?: string; bulletPoints: Array<any> }) => {
  const { description, bulletPoints, fieldName = "name" } = props;
  return (
    <>
      <AppText style={{ flex: 1 }} fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small} paddingTop={Metrics.smallMargin} color={Colors.charcoalDarkGrey}>
        {description}
      </AppText>
      <BulletPointsSection bulletPoints={bulletPoints} fieldName={fieldName} />
    </>
  );
};
