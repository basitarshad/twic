import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import { pathOr } from "ramda";
import { useSelector } from "react-redux";

import { AppText, RowContainer } from "Components";
import { Colors, Fonts } from "Themes";
import { NavigationService } from "Services";
import { APP_ROUTES } from "../../../Navigation";
import { getPriceString } from "Utils";
import { TransactionCardTileContainer, TransactionCardTileSection } from "./StyledComponents";

export const TransactionCard = (props) => {
  const { transaction } = props;
  const { payment, createdAt } = transaction;
  const { totalPayment } = payment;
  const detailParams = { details: transaction };
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  return (
    <View>
      <TouchableOpacity onPress={() => NavigationService.navigate(APP_ROUTES.USER_ORDER_DETAIL_SCREEN, { params: detailParams })}>
        <TransactionCardTileContainer>
          <RowContainer>
            <TransactionCardTileSection flex={2}>
              <AppText color={Colors.newBlue}>{createdAt}</AppText>
            </TransactionCardTileSection>

            <TransactionCardTileSection flex={1} alignItems="flex-end">
              <AppText fontSize={Fonts.size.small + 1} fontWeight={"700"}>
                {getPriceString({ price: totalPayment, country: userCountry, displayAsAmount: true })}
              </AppText>
            </TransactionCardTileSection>
          </RowContainer>
        </TransactionCardTileContainer>
        <Divider style={{ backgroundColor: Colors.lightGrey, height: 0.7 }} />
      </TouchableOpacity>
    </View>
  );
};
