import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import { contains, pathOr } from "ramda";
import { useSelector } from "react-redux";
import { Else, If, Then } from "react-if";

import { AppText, RowContainer, IconWithBadge } from "Components";
import { Metrics, Colors, Fonts } from "Themes";
import { isEmptyOrNil, getPriceString } from "Utils";
import { NavigationService } from "Services";
import { ChevronRightSvgIcon } from "Components/SvgIcons";

import { PostTaxTransactionsItemType } from "../types";
import { APP_ROUTES } from "../../../Navigation";
import { PostTaxTransactionTileContainer, PostTaxTransactionTileSection } from "../StyledComponents";

const hideTransactionDetails = (subtype) => {
  const isDisabled = contains(subtype, ["wallet_renew", "adjustment", "other_adjustment", "recognition_credit", "wallet_reset"]);
  return isDisabled;
};

export const PostTaxTransactionsItem = (props: PostTaxTransactionsItemType) => {
  const { transaction } = props;
  const { amount = 0, transactionDate, transactionType = "", referenceId = "", referenceTransactionType = "", transactionSubtype = "", name = "" } = transaction;
  const detailViewNotApplicable = hideTransactionDetails(transactionSubtype);
  const isTransactionCredit = transactionType === "credit";
  const debitOrCreditSymbol = !isEmptyOrNil(amount) && isTransactionCredit ? "+" : "-";
  const transactionAmountColor = isTransactionCredit ? Colors.green : Colors.primary;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));

  const renewOrExpireLabel = transactionType === "credit" ? "Renew" : "Expire";
  const params =
    transactionSubtype === "reimbursement_approved"
      ? { reimbursement: { ...transaction, id: transaction.referenceId || "" } }
      : { params: { type: "walletTransaction", subType: referenceTransactionType, transactionId: referenceId, details: transaction } };
  const Route = transactionSubtype === "reimbursement_approved" ? APP_ROUTES.POSTTAX_CLAIMS_DETAILS : APP_ROUTES.WALLET_TRANSACTION_DETAIL_SCREEN;

  return (
    <View>
      <TouchableOpacity disabled={detailViewNotApplicable} onPress={() => NavigationService.navigate(Route, params)}>
        <PostTaxTransactionTileContainer>
          <RowContainer alignItems="flex-start">
            <PostTaxTransactionTileSection flex={5} paddingLeft={10}>
              <AppText color={Colors.newCharcoalDarkGrey} textTransform="capitalize" fontSize={Fonts.size.small + 1} ellipsizeMode="tail" numberOfLines={1}>
                {name.substr(name.indexOf(": ") + 1).trim()}
              </AppText>
              <AppText color={Colors.charcoalLightGrey} style={{ marginTop: 3 }}>
                {transactionDate}
              </AppText>
              <If condition={detailViewNotApplicable}>
                <Then>
                  <AppText paddingTop={Metrics.smallMargin - 2} fontWeight="700" fontSize={Fonts.size.small + 1} color={Colors.purple}>
                    Auto {renewOrExpireLabel}
                  </AppText>
                </Then>
                <Else>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingTop: Metrics.smallMargin,
                      alignItems: "center",
                    }}
                  >
                    <AppText fontSize={Fonts.size.small + 1} color={Colors.newBlue}>
                      Details
                    </AppText>
                    <IconWithBadge
                      useSvgIcon
                      iconStyle={{
                        paddingBottom: 2,
                        marginLeft: 2,
                      }}
                      RenderSvgIcon={() => <ChevronRightSvgIcon height={12} width={12} fillColor={Colors.newBlue} />}
                    />
                  </View>
                </Else>
              </If>
            </PostTaxTransactionTileSection>

            <PostTaxTransactionTileSection flex={2} alignItems="flex-end">
              <AppText fontSize={Fonts.size.small + 1} color={transactionAmountColor}>
                {debitOrCreditSymbol}
                {getPriceString({ price: Math.abs(amount), country: userCountry, displayAsAmount: true })}
              </AppText>
            </PostTaxTransactionTileSection>
          </RowContainer>
        </PostTaxTransactionTileContainer>
      </TouchableOpacity>

      <Divider style={{ backgroundColor: Colors.lightGrey, height: 0.7 }} />
    </View>
  );
};
