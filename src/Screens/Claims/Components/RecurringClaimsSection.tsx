import { AppDrawer, AppHeading, AppScreenTitle, AppText } from "Components";
import { ArrowDownSvg } from "Components/SvgIcons/ArrowDownSvg";
import { ArrowUpSvg } from "Components/SvgIcons/ArrowUpSvg";
import { DocumentSvg } from "Components/SvgIcons/DocumentSvg";
import { QuestionMarkSvg } from "Components/SvgIcons/QuestionMarkSvg";
import { format } from "date-fns";
import { pathOr, reverse, splitAt } from "ramda";
import * as React from "react";
import { Else, If, Then } from "react-if";
import { TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import { PostTaxClaimsDetailsType } from "types";
import { getPointsToAmount, getPriceString, isEmptyOrNil, openExternalLink } from "Utils";
import { QuestionsDrawerContent } from "./QuestionsDrawerContent";

const Claim = ({ claim, claimsLength, index, onPressQuestionMark, reimbursementMethod }) => {
  const claimAmount = claim.reimbursement.amount_approved || 0;
  const processedDate = pathOr("", ["reimbursement", "date_processed"], claim);
  const formattedProcessedDate = format(new Date(processedDate), "MM/dd/yyyy");
  const subText = claimAmount === 0 ? `Insufficient funds from account on ${formattedProcessedDate}` : `Approved on ${formattedProcessedDate} via ${reimbursementMethod}`;
  const userCountry: string = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const stipendConfig = useSelector((state) => pathOr({}, ["userProfile", "stipendConfig"], state));

  return (
    <>
      <AppHeading color={Colors.blue} style={{ marginBottom: Metrics.smallMargin }} paddingTop={0}>
        {getPriceString({ price: getPointsToAmount({ points: claimAmount, stipendConfig }), country: userCountry, displayAsAmount: true })}
      </AppHeading>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <AppText color={Colors.charcoalLightGrey}>{subText}</AppText>
        <If condition={claimAmount === 0}>
          <TouchableOpacity onPress={onPressQuestionMark}>
            <QuestionMarkSvg />
          </TouchableOpacity>
        </If>
      </View>
      {index === claimsLength - 1 ? <></> : <Divider style={{ marginVertical: Metrics.doubleBaseMargin - 5 }} />}
    </>
  );
};

export const RecurringClaimsSection = (props: { data: PostTaxClaimsDetailsType }) => {
  const { data } = props;
  const { reimbursementHistory, payoutStatus, status } = data;
  const reversedClaims = reverse(reimbursementHistory);
  const reimbursementMethod = !isEmptyOrNil(payoutStatus) ? "Direct Deposit" : "Payroll";
  const [state, setState] = React.useState<{ claimsCollapsed: boolean; insufficientFundDrawer: boolean }>({ claimsCollapsed: false, insufficientFundDrawer: false });
  const { claimsCollapsed, insufficientFundDrawer } = state;
  const reimbursementPolicyLink: string = useSelector((state) => pathOr("", ["userProfile", "companyInfo", "reimbursementPolicyLink"], state));
  const progressBarStatusCheck = status === "completed" || status === "in_progress";

  const findClaimsToDisplay = () => {
    if (reversedClaims.length > 3) {
      if (claimsCollapsed) return reversedClaims;
      return splitAt(3, reversedClaims)[0];
    }
    return reversedClaims;
  };

  const closeDrawer = () => setState({ ...state, insufficientFundDrawer: !insufficientFundDrawer });

  const toBeDisplayedClaims = findClaimsToDisplay();
  return (
    <>
      <AppScreenTitle size={27} marginTop={Metrics.baseMargin} style={{ paddingBottom: Metrics.doubleBaseMargin - 10 }}>
        Reimbursement Plan (Monthly)
      </AppScreenTitle>
      <If condition={progressBarStatusCheck && !isEmptyOrNil(reimbursementPolicyLink)}>
        <View style={{ marginBottom: Metrics.doubleBaseMargin, flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              openExternalLink(reimbursementPolicyLink);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <DocumentSvg fillColor={Colors.newBlue} />
              <AppText color={Colors.newBlue} style={{ marginLeft: Metrics.smallMargin }}>
                See program policy for reimbursement info
              </AppText>
            </View>
          </TouchableOpacity>
        </View>
      </If>
      {toBeDisplayedClaims.map((claim, index) => {
        return <Claim reimbursementMethod={reimbursementMethod} claim={claim} claimsLength={toBeDisplayedClaims.length} index={index} onPressQuestionMark={() => setState({ ...state, insufficientFundDrawer: true })} />;
      })}
      <If condition={reversedClaims.length > 3}>
        <TouchableOpacity onPress={() => setState({ ...state, claimsCollapsed: !claimsCollapsed })} style={{ flexDirection: "row", alignItems: "center", marginTop: Metrics.doubleSection - Metrics.baseMargin, marginBottom: Metrics.baseMargin }}>
          <If condition={claimsCollapsed}>
            <Then>
              <ArrowUpSvg />
            </Then>
            <Else>
              <ArrowDownSvg />
            </Else>
          </If>
          <AppHeading color={Colors.blue} style={{ marginLeft: Metrics.smallMargin }} paddingTop={0}>
            {claimsCollapsed ? "See fewer reimbursements" : "See all reimbursements"}
          </AppHeading>
        </TouchableOpacity>
      </If>
      <AppDrawer
        isDrawerOpen={insufficientFundDrawer}
        onCloseHandler={closeDrawer}
        DrawerContent={() => (
          <QuestionsDrawerContent
            title="Reimbursement Plans"
            primaryString="Why is this period's reimbursement amount less than my maximum account balance?"
            secondaryString="You either made a purchase or filed a claim from this account prior to the reimbursement date of your reimbursement plan, or you have multiple Reimbursement plans, and we will pay back older claims before newer ones."
          />
        )}
        drawerContainerStyle={{ paddingHorizontal: 0 }}
      />
    </>
  );
};
