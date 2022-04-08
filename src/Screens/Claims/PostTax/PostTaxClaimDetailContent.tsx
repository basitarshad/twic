import { AppHeading, AppScreenTitle, AppText, RowContainer } from "Components";
import { TimeLine } from "Components/Commons/TimeLine";
import { APP_CONSTANTS } from "Constants";
import { addDays, endOfDay, format, isBefore } from "date-fns";
import moment from "moment";
import { last, pathOr, split, toLower } from "ramda";
import * as React from "react";
import { Else, If, Then } from "react-if";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import Colors from "Themes/Colors";
import Fonts from "Themes/Fonts";
import Metrics from "Themes/Metrics";
import { PostTaxClaimsDetailsType, WalletType } from "types";
import { capitalizeFirstLetterOfEachWord, capitalizeWordAndRemoveUnderScore, getPriceString, isEmptyOrNil, openExternalLink } from "Utils";
import { AdditionalClaimSection } from "../Components/AdditionalClaimSection";
import { PolicyMarkup } from "../Components/PolicyMarkup";
import { RecurringClaimsSection } from "../Components/RecurringClaimsSection";
import { PostTaxClaimStatuses, timeLineConfig } from "../metaData";
import { DotContainerStyle, DotStyle } from "../StyledComponents";
import { ReceiptListData } from "../types";
import { PostTaxClaimProgressSection } from "./PostTaxClaimProgressSection";
import { ProgramPolicyWarning } from "./ProgramPolicyWarning";

export const getStatusText = (status: string, date: string) => {
  switch (toLower(status)) {
    case "in_progress":
      return "In Progress";
    case "approved":
    case "paid":
      return `Approved`;
    case "pending":
      return "Pending";
    case "completed":
      return `Completed`;
    case "rejected":
      return `Rejected`;
    case "needs receipt":
      return "Needs receipt";
    default:
      return "Pending";
  }
};

const addDaysToDate = (date, days) => {
  return addDays(new Date(date), days);
};

const getProcessedDate = (date) => {
  return date?.length ? format(new Date(addDaysToDate(new Date(date), 3)), "MM/dd/yyyy") : "Invalid Date";
};
export const getReimbursementEst_DirectDeposit = (processedDate) => {
  const DAYS_FOR_DIRECT_DEPOSIT = 5;
  return moment(processedDate).startOf("isoWeek").add(1, "week").add(DAYS_FOR_DIRECT_DEPOSIT, "days").format("MM/DD/YYYY");
};

export const GetStatusComment = (data: PostTaxClaimsDetailsType, walletName: string, reimbursementMethod: string, reimbursementPolicyLink: string) => {
  const { status, nextApprovalDate = "", processedDate } = data;

  const updatedStatus = reimbursementMethod === "payroll" && status === "approved" ? "approved - payroll" : status;
  switch (toLower(updatedStatus)) {
    case "approved":
      return `Reimbursement via direct deposit estimated on date ${getReimbursementEst_DirectDeposit(processedDate)}`;
    case "rejected":
      return "See comments from support team";
    case "pending":
      return "Your claim is being reviewed. You’ll usually hear back from us within 72 hours of your submission";
    case "in_progress":
      return `The next deduction from your ${walletName} account will be on ${nextApprovalDate}`;
    case "completed":
      return `You've been fully reimbursed`;
    case "approved - payroll":
      return (
        <AppText fontSize={Fonts.size.small} color={Colors.charcoalLightGrey}>
          Reimbursement via payroll.
          {reimbursementPolicyLink && (
            <>
              &nbsp;Learn more by viewing&nbsp;
              <PolicyMarkup
                onPress={() => {
                  openExternalLink(reimbursementPolicyLink);
                }}
              />
            </>
          )}
        </AppText>
      );
    default:
      return "-";
  }
};

const formatPostTaxTypeReceipts = (_receipt: string[]): ReceiptListData => {
  return _receipt.reduce(
    (acc: ReceiptListData, receipt: string) => {
      const receiptType = last(split(".", receipt));
      if (receiptType === "pdf") {
        return {
          ...acc,
          pdf: [...acc.pdf, { name: last(split("/", receipt)), uri: receipt }],
        };
      }

      return {
        ...acc,
        image: [...acc.image, { name: last(split("/", receipt)), uri: receipt }],
      };
    },
    {
      image: [],
      pdf: [],
    },
  );
};

const findReceipt = (_receipt): ReceiptListData => {
  if (!isEmptyOrNil(_receipt)) return formatPostTaxTypeReceipts(_receipt);

  return {
    image: [],
    pdf: [],
  };
};

export const generateTimeLineData = (claim: PostTaxClaimsDetailsType, reimbursementMethod: string, reimbursementPolicyLink: string, userCountry: string, calculatedApprovedAmount: number) => {
  const { claimStatusUpdationDate, isMultiMonth } = claim;
  const formattedUpdationDate = format(new Date(claimStatusUpdationDate), "MM/dd/yyyy");
  const updationDate = formattedUpdationDate === "Invalid date" ? "" : formattedUpdationDate;
  const processedDate = getProcessedDate(claim.processedDate);
  const currentDate = endOfDay(new Date());
  const before = isBefore(new Date(processedDate), currentDate);
  const createUpdatedStatus = () => {
    if (reimbursementMethod === "payroll" && claim.status === "approved") return "approved - payroll";
    if (!isMultiMonth && claim.amount !== calculatedApprovedAmount && claim.status === "approved") return "partially approved";
    return claim.status;
  };
  const updatedStatus = createUpdatedStatus();
  switch (updatedStatus) {
    case "approved - payroll":
      return timeLineConfig(
        before ? 2 : 1.5,
        Colors.green,
        `Submitted on ${format(new Date(claim.createdAt), "MM/dd/yyyy")}`,
        `Approved on ${claim.processedDate}`,
        reimbursementPolicyLink ? (
          <>
            See&nbsp;
            <TouchableWithoutFeedback
              onPress={() => {
                openExternalLink(reimbursementPolicyLink);
              }}
            >
              <AppText color={Colors.newBlue} fontSize={17}>
                program policy
              </AppText>
            </TouchableWithoutFeedback>
            &nbsp;for reimbursement date
          </>
        ) : (
          "Contact support team"
        ),
      );
    case "approved":
      return timeLineConfig(before ? 2 : 1.5, Colors.green, `Submitted on ${format(new Date(claim.createdAt), "MM/dd/yyyy")}`, `Approved on ${claim.processedDate}`, `Reimbursed est. ${getReimbursementEst_DirectDeposit(claim.processedDate)}`);
    case "partially approved":
      return timeLineConfig(
        before ? 2 : 1.5,
        Colors.green,
        `Submitted on ${format(new Date(claim.createdAt), "MM/dd/yyyy")}`,
        `Partially paid ${getPriceString({ price: calculatedApprovedAmount, displayAsAmount: true, country: userCountry })} / ${getPriceString({ price: claim.amount, displayAsAmount: true, country: userCountry })}`,
        `Reimbursed est. ${getReimbursementEst_DirectDeposit(claim.processedDate)}`,
      );
    case "rejected":
      return timeLineConfig(1, Colors.rose, `Submitted on ${format(new Date(claim.createdAt), "MM/dd/yyyy")}`, `Rejected on ${updationDate}`, `Reimbursed`);
    case "pending":
      return timeLineConfig(0.5, Colors.orange, `Submitted on ${format(new Date(claim.createdAt), "MM/dd/yyyy")}`, `Approved`, `Reimbursed`);

    default:
      return timeLineConfig(0, Colors.green, "", "", "");
  }
};

export const PostTaxClaimDetailContent = (props: { data: PostTaxClaimsDetailsType }) => {
  const { data } = props;
  const { category = "", reimbursementVendor = "", amount, status, receipts, createdAt, isMultiMonth, employeeNote, reimbursementHistory, note, completeTransactionDate, employeeWalletId, payoutStatus, approvedAmount } = data;
  const wallets: WalletType[] = useSelector((state) => pathOr([], ["userProfile", "userInfo", "wallets"], state));
  const reimbursementPolicyLink: string = useSelector((state) => pathOr("", ["userProfile", "companyInfo", "reimbursementPolicyLink"], state));
  const allowYearEndRollover: boolean = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "allowYearEndRollover"], state));
  const userCountry: string = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const reimbursementStatus = PostTaxClaimStatuses[toLower(status)] || "";
  const reimbursementStatusText = getStatusText(toLower(status), createdAt);
  const progressBarStatusCheck = status === "completed" || status === "in_progress";
  const defaultWallet = wallets.find((wallets) => wallets.walletTypeId === "wellness") || wallets[0];
  const wallet = wallets.find((wallet: WalletType) => wallet.walletId === employeeWalletId) || defaultWallet;
  const reimbursementMethod = !isEmptyOrNil(payoutStatus) ? "Direct Deposit" : "payroll";
  const statusComment = GetStatusComment(data, wallet.name, reimbursementMethod, reimbursementPolicyLink);
  const receiptsByTypeList = findReceipt(receipts);
  const categoryName = (category && capitalizeWordAndRemoveUnderScore(category)) || "";
  const categoryText = categoryName.length > 0 && categoryName !== "N/A" ? ` / ${categoryName}` : "";
  const calculatedApprovedAmount =
    isMultiMonth && reimbursementHistory.length > 0
      ? Number(
          reimbursementHistory
            .reduce((acc, value) => {
              const approvedAmount = value.reimbursement.amount || 0;
              return acc + approvedAmount;
            }, 0)
            .toFixed(2),
        )
      : approvedAmount;
  const timeLineData = generateTimeLineData(data, reimbursementMethod, reimbursementPolicyLink, userCountry, calculatedApprovedAmount);
  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <ScrollView>
        <View style={{ marginHorizontal: Metrics.newScreenHorizontalPadding }}>
          <RowContainer marginVertical={0}>
            <AppHeading style={{ fontWeight: "bold" }} textTransform="capitalize" color={Colors.charcoalLightGrey} fontSize={Fonts.size.regular} testID={"account"} accessibilityLabel={"account"}>
              {wallet.name}
            </AppHeading>
            <AppHeading
              style={{ fontWeight: "bold", width: APP_CONSTANTS.IS_ANDROID ? "60%" : "75%" }}
              color={Colors.charcoalLightGrey}
              fontSize={Fonts.size.regular}
              ellipsizeMode="tail"
              numberOfLines={1}
              testID={"category"}
              accessibilityLabel={"category"}
            >
              {categoryText}
            </AppHeading>
          </RowContainer>
          <If condition={amount > 0}>
            <AppScreenTitle size={30} marginTop={Metrics.baseMargin} style={{ paddingBottom: Metrics.baseMargin }} testID="amount" accessibilityLabel="amount">
              {getPriceString({ price: amount, displayAsAmount: true, country: userCountry })} {!isEmptyOrNil(reimbursementVendor) ? `at ${capitalizeFirstLetterOfEachWord(reimbursementVendor)}` : ""}
            </AppScreenTitle>
          </If>
          <AppText>
            <AppText color={reimbursementStatus.color} fontWeight={"bold"}>
              {reimbursementStatusText}
            </AppText>
            <AppText color={Colors.charcoalLightGrey}>
              <DotContainerStyle>
                <DotStyle />
              </DotContainerStyle>
              {statusComment}
            </AppText>
          </AppText>
        </View>
        <View style={{ backgroundColor: Colors.white, flex: 1, marginHorizontal: Metrics.newScreenHorizontalPadding }}>
          <If condition={progressBarStatusCheck}>
            <Then>
              <PostTaxClaimProgressSection data={data} />
            </Then>
            <Else>
              <View style={{ marginTop: Metrics.doubleBaseMargin }}>
                <TimeLine fillPoint={timeLineData.fillPoint} data={timeLineData.data} colors={{ active: timeLineData.color }} />
              </View>
            </Else>
          </If>
          <If condition={calculatedApprovedAmount > 0 && amount <= calculatedApprovedAmount && !isMultiMonth}>
            <Then>
              <View style={{ marginTop: Metrics.doubleBaseMargin }}>
                <AppText style={{ fontWeight: "bold" }} color={Colors.charcoalLightGrey}>
                  Amount Approved
                </AppText>
                <AppText color={Colors.orange}>{getPriceString({ price: calculatedApprovedAmount, displayAsAmount: true, country: userCountry })}</AppText>
              </View>
            </Then>
          </If>
        </View>
        <If condition={!allowYearEndRollover}>
          <ProgramPolicyWarning reimbursementPolicyLink={reimbursementPolicyLink} />
        </If>
        <If condition={progressBarStatusCheck}>
          <Divider style={{ marginVertical: Metrics.doubleBaseMargin }} />
        </If>
        <If condition={reimbursementHistory.length > 0 && progressBarStatusCheck}>
          <View style={{ backgroundColor: Colors.white, flex: 1, marginHorizontal: Metrics.newScreenHorizontalPadding }}>
            <RecurringClaimsSection data={data} />
          </View>
        </If>
        <Divider style={{ marginVertical: Metrics.screenHorizontalPadding }} />
        <AdditionalClaimSection
          claimDate={{ title: "Date Claim Submitted", description: format(new Date(createdAt), "MM/dd/yyyy") }}
          ClaimPurchaseDate={{ title: "Date of Purchase", description: format(new Date(completeTransactionDate), "MM/dd/yyyy") }}
          claimDescription={{ title: "Description", description: employeeNote }}
          twicTeamComment={!isEmptyOrNil(note) ? { title: "Comments from Forma Support Team", description: note } : {}}
          receiptsByTypeList={receiptsByTypeList}
          isPretax={false}
        />
      </ScrollView>
    </View>
  );
};
