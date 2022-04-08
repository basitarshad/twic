import { AppHeading, AppScreenTitle, AppText, RowContainer } from "Components";
import { TimeLine } from "Components/Commons/TimeLine";
import { format, parse, isMatch } from "date-fns";
import { last, pathOr, split, toLower } from "ramda";
import * as React from "react";
import { If, Then } from "react-if";
import { ScrollView, View } from "react-native";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import Colors from "Themes/Colors";
import Fonts from "Themes/Fonts";
import Metrics from "Themes/Metrics";
import { PretaxClaimsDetailType } from "types";
import { capitalizeFirstLetterOfEachWord, getPriceString, isEmptyOrNil } from "Utils";
import { AdditionalClaimSection } from "../Components/AdditionalClaimSection";
import { alegeusStatusToTwicStatus, EMPLOYER_SPONSORED_CLAIM_STATUSES, timeLineConfig } from "../metaData";
import { DotContainerStyle, DotStyle } from "../StyledComponents";
import { ReceiptListData } from "../types";

const checkIfDateEmpty = (val) => {
  const hasDateValue = val?.length;
  const isDateMatches = hasDateValue ? isMatch(val, "yyyyMMdd") : false; // 20220217 if date like this

  return isDateMatches ? format(parse(val, "yyyyMMdd", new Date()), "MM/dd/yyyy") : hasDateValue ? format(new Date(val), "MM/dd/yyyy") : "Invalid Date";
};

export const getStatusComment = (status: string, preTaxReimbursementMethod: string) => {
  switch (toLower(status)) {
    case EMPLOYER_SPONSORED_CLAIM_STATUSES.APPROVED.name:
      return isEmptyOrNil(preTaxReimbursementMethod) ? "Reimbursement" : preTaxReimbursementMethod === "None" ? "" : `Reimbursement via ${preTaxReimbursementMethod}`;
    case EMPLOYER_SPONSORED_CLAIM_STATUSES.REJECTED.name:
      return "See comments from support team";
    case EMPLOYER_SPONSORED_CLAIM_STATUSES.PENDING.name:
      return "Your claim is being reviewed. You’ll usually hear back from us within 72 hours of your submission";
    case EMPLOYER_SPONSORED_CLAIM_STATUSES.NEEDS_RECEIPT.name:
      return "Please contact support for help with your receipt";
    default:
      return "-";
  }
};

export const generateTimeLineData = (claim: PretaxClaimsDetailType, userCountry: string, status: string, reimbursementMethod: string) => {
  const createdAt = checkIfDateEmpty(claim.transactionDate);
  const settlementDate = checkIfDateEmpty(claim.settlementDate);
  const { amount, approvedClaimAmount } = claim;
  const STATUS_REIMBURSED = reimbursementMethod === "None" ? `Refunded` : `Reimbursed`;
  const partiallyApprovedPaidCheck = () => {
    if (amount === -1 || approvedClaimAmount === -1) return `Partially paid`;
    else return `Partially paid ${getPriceString({ price: approvedClaimAmount, country: userCountry })} / ${getPriceString({ price: amount, country: userCountry })}`;
  };

  const getApprovedTimeLine = () => {
    if (amount > approvedClaimAmount) {
      return timeLineConfig(1, Colors.green, `Submitted on ${createdAt}`, partiallyApprovedPaidCheck(), STATUS_REIMBURSED);
    } else {
      const timeLinePoints = reimbursementMethod === "None" ? 2 : 1;
      return timeLineConfig(timeLinePoints, Colors.green, `Submitted on ${createdAt}`, `Approved on ${settlementDate}`, STATUS_REIMBURSED);
    }
  };

  switch (status) {
    case "approved":
      return getApprovedTimeLine();
    case "paid":
      return timeLineConfig(2, Colors.green, `Submitted on ${createdAt}`, `Approved on ${settlementDate}`, STATUS_REIMBURSED);
    case "partially approved":
      return timeLineConfig(1, Colors.green, `Submitted on ${createdAt}`, partiallyApprovedPaidCheck(), STATUS_REIMBURSED);
    case "rejected":
      return timeLineConfig(1, Colors.primary, `Submitted on ${createdAt}`, `Rejected ${settlementDate === "Invalid Date" ? "" : `on ${settlementDate}`}`, STATUS_REIMBURSED);
    case "pending":
    case "needs receipt":
      return timeLineConfig(0.5, Colors.orange, `Submitted on ${createdAt}`, `Approved`, STATUS_REIMBURSED);

    default:
      return timeLineConfig(0, Colors.green, "", "", "");
  }
};

const formatPreTaxTypeReceipts = (receipt: string, receipts: string[]): ReceiptListData => {
  const receiptType = last(split(".", receipt));
  if (receiptType === "pdf") {
    return {
      image: [],
      pdf: [
        {
          name: receipt,
          uri: receipts[0],
        },
      ],
    };
  }

  return {
    image: [
      {
        name: receipt,
        uri: `data:image/gif;base64,${receipts[0]}`,
      },
    ],
    pdf: [],
  };
};

type PreTaxClaimDetailContentType = {
  listingApiStatus: string;
  formattedStatus: string;
  reimbursementMethod: string;
} & PretaxClaimsDetailType;

const specialCases = (status, listingApiStatus) => {
  if (status === "Approved" && listingApiStatus === "rejected") return "rejected";
  if (status === "approved" && listingApiStatus === "rejected") return "rejected";
  return status;
};

export const PreTaxClaimDetailContent = (props: { data: PreTaxClaimDetailContentType }) => {
  const { data } = props;
  const { title, amount, listingApiStatus, formattedStatus, createdAt, note, receipts, merchant, receiptTitle, approvedClaimAmount, offsetAmount, reimbursementMethod, purchaseDate } = data;

  // this is a special case where listing returns REJECTED & details returns APPROVED. alegeusStatusToTwicStatus is not handling this case
  const formattedDetailClaimStatus = alegeusStatusToTwicStatus(specialCases(formattedStatus, listingApiStatus));

  const statusComment = getStatusComment(formattedStatus, reimbursementMethod);
  const userCountry: string = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const timeLineData = generateTimeLineData(data, userCountry, listingApiStatus === "partially approved" || listingApiStatus === "paid" ? listingApiStatus : formattedStatus, reimbursementMethod);
  const findReceiptWithType = (_receipt): ReceiptListData => {
    if (!isEmptyOrNil(_receipt)) {
      return formatPreTaxTypeReceipts(receiptTitle, _receipt);
    }

    return {
      image: [],
      pdf: [],
    };
  };
  const receiptsByTypeList = findReceiptWithType(receipts);
  const claimTitle = title.length > 0 ? ` / ${title}` : "";
  const upperCaseCategories = ["otc"];
  const showApprovedAmount = listingApiStatus === "partially approved" || listingApiStatus === "paid" || listingApiStatus === "approved" || listingApiStatus === "partially paid";
  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <ScrollView>
        <View style={{ marginHorizontal: Metrics.newScreenHorizontalPadding }}>
          <RowContainer marginVertical={0}>
            <AppHeading style={{ fontWeight: "bold" }} textTransform="capitalize" color={Colors.charcoalLightGrey} fontSize={Fonts.size.regular} testID="account" accessibilityLabel="account">
              Pretax
            </AppHeading>
            <AppHeading
              style={{ fontWeight: "bold" }}
              color={Colors.charcoalLightGrey}
              textTransform={upperCaseCategories.includes(toLower(title)) ? "uppercase" : "none"}
              fontSize={Fonts.size.regular}
              testID={"category"}
              accessibilityLabel={"category"}
            >
              {claimTitle}
            </AppHeading>
          </RowContainer>
          <If condition={amount > 0}>
            <AppScreenTitle size={30} marginTop={Metrics.baseMargin} style={{ paddingBottom: Metrics.baseMargin }} testID="amount" accessibilityLabel="amount">
              {getPriceString({ price: amount, country: userCountry })} {!isEmptyOrNil(merchant) ? `at ${capitalizeFirstLetterOfEachWord(merchant)}` : ""}
            </AppScreenTitle>
          </If>
          <AppText>
            <AppText color={formattedDetailClaimStatus.color} textTransform="capitalize" fontWeight={"bold"}>
              {formattedDetailClaimStatus.name}
            </AppText>
            <AppText color={Colors.charcoalLightGrey}>
              <DotContainerStyle>
                <DotStyle />
              </DotContainerStyle>
              {statusComment}
            </AppText>
          </AppText>
          <View style={{ marginTop: Metrics.doubleBaseMargin }}>
            <TimeLine fillPoint={timeLineData.fillPoint} data={timeLineData.data} colors={{ active: timeLineData.color }} />
          </View>
          <If condition={typeof offsetAmount === "number" && offsetAmount > 0}>
            <Then>
              <View style={{ marginTop: Metrics.doubleBaseMargin }}>
                <AppText style={{ fontWeight: "bold" }} color={Colors.charcoalLightGrey}>
                  Offset Amount
                </AppText>
                <AppText color={Colors.orange}>{getPriceString({ price: offsetAmount, country: userCountry })}</AppText>
              </View>
            </Then>
          </If>
          <If condition={showApprovedAmount}>
            <Then>
              <View style={{ marginTop: Metrics.doubleBaseMargin }}>
                <AppText style={{ fontWeight: "bold" }} color={Colors.charcoalLightGrey}>
                  Amount Approved
                </AppText>
                <If condition={approvedClaimAmount !== -1}>
                  <AppText color={Colors.orange}>{getPriceString({ price: approvedClaimAmount, displayAsAmount: true, country: userCountry })}</AppText>
                </If>
              </View>
            </Then>
          </If>
        </View>

        <Divider style={{ marginVertical: Metrics.screenHorizontalPadding }} />
        <AdditionalClaimSection
          claimDate={{ title: "Date Claim Submitted", description: checkIfDateEmpty(createdAt) }}
          ClaimPurchaseDate={{ title: "Date of Purchase", description: checkIfDateEmpty(purchaseDate) }}
          claimDescription={{ title: "Description", description: note }}
          receiptsByTypeList={receiptsByTypeList}
          isPretax={true}
        />
      </ScrollView>
    </View>
  );
};
