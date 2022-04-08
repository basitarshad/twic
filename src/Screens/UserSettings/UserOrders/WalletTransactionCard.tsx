import * as React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Divider } from "react-native-elements";
import { contains, pathOr } from "ramda";
import { If, Else, Then } from "react-if";
import { useSelector } from "react-redux";

import { AppText, AppHeading } from "../../../Components";
import { Metrics, Colors, Fonts, Images } from "../../../Themes";
import { getPriceString } from "../../../Utils";
import { NavigationService } from "../../../Services";
import { APP_ROUTES } from "../../../Navigation";
import { iconStyle } from "../../../Screens/UserSettings/SettingsList";
import { WalletTransactionRow, WalletTransactionTileContainer } from "./StyledComponents";

const hideTransactionDetails = (subtype) => {
  //const isClickable = contains(subtype, ['wallet_renew', 'adjustment', 'other_adjustment', 'reimbursement_approved'])
  const isClickable = contains(subtype, ["wallet_renew", "adjustment", "other_adjustment"]);
  return isClickable;
};

export const WalletTransactionCard = (props) => {
  const { transaction } = props;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const { amount = 0, transactionSubtype = "", transactionDate = "", name = "" } = transaction;
  const detailViewNotApplicable = hideTransactionDetails(transactionSubtype);
  const date = transactionDate === "-" ? transactionDate : transactionDate.split(",")[0];
  const params = transactionSubtype === "reimbursement_approved" ? { reimbursement: { ...transaction, id: transaction.referenceId || "" } } : { params: { type: "transaction", details: transaction } };
  const Route = transactionSubtype === "reimbursement_approved" ? APP_ROUTES.POSTTAX_CLAIMS_DETAILS : APP_ROUTES.USER_ORDER_DETAIL_SCREEN;
  return (
    <View>
      <TouchableOpacity disabled={detailViewNotApplicable} onPress={() => NavigationService.navigate(Route, params)}>
        <WalletTransactionTileContainer>
          <AppText textTransform="capitalize" fontSize={Fonts.size.small + 1} color={Colors.black}>
            {date}
          </AppText>
          <WalletTransactionRow justifyContent="space-between">
            <AppText textTransform="capitalize" fontSize={Fonts.size.small + 1} color={Colors.newBlue} ellipsizeMode="tail" width={175} numberOfLines={1}>
              {name}
            </AppText>
            <WalletTransactionRow>
              <AppHeading fontSize={Fonts.size.small + 1} paddingTop={0}>
                {getPriceString({ price: amount, country: userCountry, displayAsAmount: true })}
              </AppHeading>
              <If condition={!detailViewNotApplicable}>
                <Then>
                  <Image source={Images.arrowRight} style={iconStyle} />
                </Then>
                <Else>
                  <AppText paddingLeft={Metrics.baseMargin} />
                </Else>
              </If>
            </WalletTransactionRow>
          </WalletTransactionRow>
        </WalletTransactionTileContainer>
        <Divider style={{ backgroundColor: Colors.lightGrey, height: 0.7 }} />
      </TouchableOpacity>
    </View>
  );
};
