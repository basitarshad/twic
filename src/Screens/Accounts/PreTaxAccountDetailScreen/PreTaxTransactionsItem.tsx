import { AppText, RowContainer } from "Components";
import { format } from "date-fns";
import { pathOr } from "ramda";
import * as React from "react";
import { View } from "react-native";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import { Colors, Fonts } from "Themes";
import { getPriceString, isEmptyOrNil } from "Utils";
import { PreTaxTransactionTileContainer, PreTaxTransactionTileSection } from "../StyledComponents";
import { PreTaxTransactionsItemType } from "../types";

export const PreTaxTransactionsItem = (props: PreTaxTransactionsItemType) => {
  const { transaction } = props;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));

  const { amount = 0, desc = "", transactionDate } = transaction;
  const formatDesc = desc.replace(/<\/?[^>]+(>|$)/g, " ");

  const debitOrCreditSymbol = !isEmptyOrNil(amount) && amount > 0 ? "+" : "-";
  const isPositive = debitOrCreditSymbol === "+";
  const transactionAmountColor = isPositive ? Colors.green : Colors.primary;
  const creationDate = format(new Date(transactionDate), "MMMM dd, yyyy");

  return (
    <View>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}>
        <PreTaxTransactionTileContainer>
          <RowContainer style={{ marginBottom: 5 }}>
            <PreTaxTransactionTileSection flex={5}>
              <AppText fontWeight="400" textTransform="capitalize" fontSize={Fonts.size.small} ellipsizeMode="tail" numberOfLines={1}>
                {formatDesc}
              </AppText>
            </PreTaxTransactionTileSection>

            <PreTaxTransactionTileSection flex={4} alignItems="flex-end">
              <AppText fontSize={Fonts.size.small + 1} color={transactionAmountColor}>
                {debitOrCreditSymbol}
                {getPriceString({ price: Math.abs(amount), country: userCountry, displayAsAmount: true })}
              </AppText>
            </PreTaxTransactionTileSection>
          </RowContainer>
          <AppText color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
            {creationDate}
          </AppText>
        </PreTaxTransactionTileContainer>
      </View>
      <Divider style={{ backgroundColor: Colors.lightGrey, height: 0.7, marginTop: 10 }} />
    </View>
  );
};
