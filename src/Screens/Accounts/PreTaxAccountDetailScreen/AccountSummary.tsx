import * as React from "react";
import { If, Then } from "react-if";
import { toLower, pathOr } from "ramda";
import { Colors, Fonts, Metrics } from "Themes";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { SecondaryButton } from "twic_mobile_components";

import { AppDrawer, AppHeading, AppScreenTitle, AppText, RowContainer, TooltipView } from "Components";
import { PretaxAccountPlan, PretaxAccountsType } from "types";
import { isEmptyOrNil } from "Utils";
import { FAQSvgIcon } from "Components/SvgIcons";
import EyeSvgIcon from "Components/SvgIcons/EyeSvgIcon";

import { CardContainer, CardContentRow, CardRow, ContentLeftSection, ContentSectionContainer } from "../StyledComponents";
import { APP_CONSTANTS } from "Constants";
import { formatPretaxAccountActivityName } from "./pretax.helpers";

export type AccountSummaryType = {
  account: PretaxAccountsType;
  pretaxPlan?: PretaxAccountPlan;
};

const DrawerSection = (props: { title: string; date: string; description: string; borderWidth?: number }) => {
  const { title, date, description, borderWidth = 1 } = props;
  return (
    <View style={{ paddingVertical: Metrics.doubleBaseMargin, borderBottomWidth: borderWidth, borderColor: Colors.dimGrey }}>
      <ContentSectionContainer>
        <ContentLeftSection>
          <AppText>{title}</AppText>
        </ContentLeftSection>
        <View style={{ width: "50%" }}>
          <AppText style={{ alignSelf: "flex-end" }}>{date}</AppText>
        </View>
      </ContentSectionContainer>
      <If condition={!isEmptyOrNil(description)}>
        <AppText paddingTop={Metrics.baseMargin} color={Colors.charcoalLightGrey}>
          {description}
        </AppText>
      </If>
    </View>
  );
};

type PretaxAccountDetailsDrawerType = {
  companyName: string;
  account: PretaxAccountsType;
  pretaxPlan: PretaxAccountPlan;
};
const PretaxAccountDetailsDrawer = (props: PretaxAccountDetailsDrawerType) => {
  const { companyName, account } = props;
  const { accountType, accountDisplayHeader, submitClaimsLastDate, accountStartDate, accountEndDate, accountStatusCode, gracePeriodEndDate } = account;
  const formatedSubmitClaimsLastDate = !isEmptyOrNil(submitClaimsLastDate) ? submitClaimsLastDate : "Not Available";

  const gracePeriodText = gracePeriodEndDate;
  const isCompanyUnity = toLower(companyName) === "unity";
  return (
    <View
      style={{
        marginHorizontal: Metrics.newScreenHorizontalPadding,
        marginBottom: Metrics.baseMargin,
        maxHeight: Metrics.screenHeight - 160,
        height: "auto",
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={1}>
          <>
            <AppScreenTitle size={Fonts.size.h1} textAlign="left" paddingBottom={Metrics.doubleBaseMargin}>
              Account Details
            </AppScreenTitle>
            <AppText paddingTop={Metrics.smallMargin} paddingBottom={Metrics.screenHorizontalPadding} color={Colors.newDarkGrey}>
              {`The following information is about your ${formatPretaxAccountActivityName(accountType, accountDisplayHeader)} provided to you by Forma.`}
            </AppText>
            <DrawerSection title="Account Status" date={`${accountStatusCode}`} description="" />
            <DrawerSection title="Coverage Duration" date={`${accountStartDate} to ${accountEndDate}`} description="Eligible duration for the expenses to incur." />
            <If condition={!isCompanyUnity}>
              <Then>
                <DrawerSection title="Final Date to Submit Expenses" date={formatedSubmitClaimsLastDate} description="Last day you can submit eligible expenses from the plan year." />
                <DrawerSection
                  borderWidth={0}
                  title="Grace Period"
                  date={gracePeriodText}
                  description={`This is an extended period of coverage at the end of your plan year allowing you extra time to incur expenses to use your remaining ${accountType} balance after the close of the plan year.`}
                />
              </Then>
            </If>
          </>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const RowWithToolTip = (props: AccountSummaryType) => {
  const { pretaxPlan, account } = props;

  const { submitClaimsLastDate, accountStartDate, accountEndDate } = account;
  const formatedSubmitClaimsLastDate = !isEmptyOrNil(submitClaimsLastDate) ? submitClaimsLastDate : "Not Available";
  const items = [
    { leftText: "Coverage Duration", rightText: `${accountStartDate} to ${accountEndDate}`, description: "Eligible duration for the expenses to incur." },
    { leftText: "Run-Out Period", rightText: `${formatedSubmitClaimsLastDate}`, description: "Last day you can submit eligible expenses from the plan year." },
  ];

  return (
    <>
      {items.map(({ leftText, description, rightText }, key) => (
        <CardContentRow borderBottomWidth={items.length - 1 === key ? 0 : 1} key={key}>
          <TooltipView value={description} height={100} pointerColor={Colors.newCharcoalDarkGrey} containerStyle={{ backgroundColor: Colors.newCharcoalDarkGrey, height: 100 }} popOverTextColor="white">
            <RowContainer marginVertical={0}>
              <AppText paddingRight={2}>{leftText}</AppText>
              <FAQSvgIcon fillColor={Colors.newBlue} />
            </RowContainer>
          </TooltipView>
          <AppText>{rightText}</AppText>
        </CardContentRow>
      ))}
    </>
  );
};

const buttonLabelStyle = { color: Colors.newBlue, paddingLeft: 10, marginTop: APP_CONSTANTS.IS_ANDROID ? -2 : 0 };

export const AccountSummary = (props: AccountSummaryType) => {
  const [showDrawer, setShowDrawer] = React.useState(false);
  const companyName = useSelector((state) => pathOr("", ["companyInfo", "name"], state));
  const { pretaxPlan } = props;

  if (isEmptyOrNil(pretaxPlan)) return null;

  return (
    <CardContainer>
      <CardRow style={{ marginBottom: 10 }}>
        <AppHeading fontSize={Fonts.size.h3}>Account</AppHeading>
      </CardRow>
      <RowWithToolTip {...props} />
      <View style={{ marginBottom: 10, marginTop: 15 }}>
        <SecondaryButton customIcon={() => <EyeSvgIcon fillColor={Colors.newBlue} />} labelStyle={buttonLabelStyle} width={Metrics.screenWidth / 2.25} onClickHandler={() => setShowDrawer(true)} buttonLabel="Plan Summary" />
      </View>
      <AppDrawer
        showCloseIcon
        isDrawerOpen={showDrawer}
        onCloseHandler={() => setShowDrawer(false)}
        DrawerContent={() => <PretaxAccountDetailsDrawer companyName={companyName} {...(props as any)} />}
        drawerContainerStyle={{ paddingBottom: Metrics.baseMargin, paddingHorizontal: 0 }}
      />
    </CardContainer>
  );
};
