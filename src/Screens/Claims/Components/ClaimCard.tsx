import { AppText } from "Components/Commons/AppStyledComponents";
import { ArrowRightSvgIcon } from "Components/SvgIcons";
import { format } from "date-fns";
import { pathOr } from "ramda";
import * as React from "react";
import { If } from "react-if";
import { View } from "react-native";
import { useSelector } from "react-redux";
import NavigationService from "Services/NavigationService";
import Colors from "Themes/Colors";
import Fonts from "Themes/Fonts";
import Metrics from "Themes/Metrics";
import { WalletType } from "types";
import { capitalizeFirstLetterOfEachWord, getPriceString, ignoreCaseSensitivityAndReplaceWord, isEmptyOrNil } from "Utils/index";
import { APP_ROUTES } from "../../../Navigation";
import { alegeusStatusToTwicStatus, PostTaxClaimStatuses, PRETAX_CLAIM_STATUSES } from "../metaData";
import { ClaimCardContainer, DotContainerStyle, DotStyle } from "../StyledComponents";

const APPROVED = "approved";
const REFUNDED = "refunded";
const PARTIALLY_APPROVED = "partially approved";
const PENDING = "pending";
const REJECTED = "rejected";
const NEEDS_RECEIPT = "needs receipt";
const IN_PROGRESS = "in_progress";
const COMPLETED = "completed";
const PAID = "paid";

const getStatusNotes = ({ status, amount, isMultiMonth }: { status: string; amount?: string; isMultiMonth: boolean }) => {
  switch (status) {
    case APPROVED:
    case REFUNDED:
    case PARTIALLY_APPROVED:
      return isMultiMonth ? (
        <AppText fontSize={Fonts.size.small} color={Colors.charcoalLightGrey}>
          {`${amount} approved`}
          {"\n"}
          (Reimbursement Plan)
        </AppText>
      ) : (
        `${amount} approved`
      );
    case PENDING:
      return "Forma is reviewing your claim";
    case REJECTED:
    case NEEDS_RECEIPT:
      return "See comments from support team";
    case IN_PROGRESS:
    case PAID:
      return isMultiMonth ? (
        <AppText fontSize={Fonts.size.small} color={Colors.charcoalLightGrey}>
          {`${amount} approved`}
          {"\n"}
          (Reimbursement Plan)
        </AppText>
      ) : (
        `${amount} approved`
      );
    case COMPLETED:
      return "You've been fully reimbursed";

    default:
      return "Contact support team";
  }
};

export const ClaimCard = (props) => {
  const { reimbursement, index } = props;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const wallets: WalletType[] = useSelector((state) => pathOr([], ["userProfile", "userInfo", "wallets"], state));
  const { amount = -1, status = "", createdAt = "", employeeWalletId = "", isPretax, approvedAmount, isMultiMonth = false, reimbursementMethod } = reimbursement;
  const defaultWallet = wallets.find((wallet: WalletType) => wallet.walletTypeId === "wellness") || wallets[0];
  const wallet = wallets.find((wallet: any) => wallet.walletId === employeeWalletId) || defaultWallet;

  const alegeusStatus = isPretax ? alegeusStatusToTwicStatus(typeof status === "string" ? status : PRETAX_CLAIM_STATUSES.REJECTED) : "";

  const mappedStatus = !isPretax ? PostTaxClaimStatuses[status] : reimbursementMethod === "None" && typeof alegeusStatus === "object" && alegeusStatus.name === "approved" ? { ...alegeusStatus, name: "refunded" } : alegeusStatus;
  const formattedWalletName = isPretax ? "Pretax" : ignoreCaseSensitivityAndReplaceWord(wallet.name, "", "");
  const reimbursementVendor = isPretax ? "" : !isEmptyOrNil(reimbursement.reimbursementVendor) ? ` at ${capitalizeFirstLetterOfEachWord(reimbursement.reimbursementVendor)}` : "";
  const formattedAmount = getPriceString({ price: amount, country: userCountry, displayAsAmount: true });
  const formattedApprovedAmount = approvedAmount !== -1 ? getPriceString({ price: approvedAmount, country: userCountry, displayAsAmount: true }) : "";
  const isStatusPartiallyApproved = status === "partially approved" || formattedApprovedAmount.length > 0;
  const statusComments = getStatusNotes({
    status: isPretax ? mappedStatus.name : mappedStatus.key,
    amount: isStatusPartiallyApproved ? formattedApprovedAmount : formattedAmount,
    isMultiMonth,
  });
  const conditionalRoute = isPretax ? APP_ROUTES.PRETAX_CLAIMS_DETAILS : APP_ROUTES.POSTTAX_CLAIMS_DETAILS;
  return (
    <ClaimCardContainer
      onPress={() =>
        NavigationService.navigate(conditionalRoute, {
          reimbursement,
        })
      }
      testID={`claims-${index}`}
      accessibilityLabel={`claims-${index}`}
    >
      <AppText fontSize={15} style={{ fontWeight: "bold" }} color={Colors.charcoalLightGrey}>
        {formattedWalletName}
      </AppText>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: Metrics.smallMargin - 2 }}>
        <AppText fontSize={20} style={{ fontWeight: "bold" }} testID={amount.toString()} accessibilityLabel={amount.toString()}>
          {getPriceString({ price: amount, country: userCountry, displayAsAmount: true })}
          {reimbursementVendor}
        </AppText>
        <ArrowRightSvgIcon fillColor={Colors.newBlue} />
      </View>
      <AppText fontSize={Fonts.size.small} color={Colors.charcoalLightGrey} testID={"submit-date"} accessibilityLabel={"submit-date"} style={{ marginBottom: Metrics.baseMargin }}>
        Submitted on {format(new Date(createdAt), "MM/dd/yyyy")}
      </AppText>
      <AppText>
        <AppText color={mappedStatus.color} fontWeight={"bold"} textTransform="capitalize" fontSize={Fonts.size.small} testId={mappedStatus.name} accessibilityLabel={mappedStatus.name}>
          {mappedStatus.name}
        </AppText>
        <If condition={amount !== -1}>
          <AppText fontSize={Fonts.size.small} color={Colors.charcoalLightGrey}>
            <DotContainerStyle>
              <DotStyle />
            </DotContainerStyle>
            {statusComments}
          </AppText>
        </If>
      </AppText>
    </ClaimCardContainer>
  );
};
