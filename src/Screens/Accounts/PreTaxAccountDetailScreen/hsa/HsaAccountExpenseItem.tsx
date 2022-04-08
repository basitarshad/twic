import { AppText, IconWithText, RowContainer } from "Components";
import { TransactionFilledSvgIcon } from "Components/SvgIcons";
import { format } from "date-fns";
import { pathOr } from "ramda";
import * as React from "react";
import { View } from "react-native";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import { NavigationService } from "Services";
import { Colors, Fonts, Metrics } from "Themes";
import { getPriceString } from "Utils";
import { APP_ROUTES } from "../../../../Navigation";
import { HsaAccountTransactionTileContainer, HsaAccountTransactionTileSection } from "../../StyledComponents";

export const HsaAccountExpenseItem = (props) => {
  const { expense } = props;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const { amount = 0, description = "", created } = expense;
  const formatDesc = description.replace(/<\/?[^>]+(>|$)/g, " ");
  const creationDate = format(new Date(created), "MMMM dd, yyyy");

  return (
    <View style={{ width: "100%" }}>
      <HsaAccountTransactionTileContainer>
        <AppText color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall} testID={creationDate} accessibilityLabel={creationDate}>
          {creationDate}
        </AppText>
        <RowContainer>
          <HsaAccountTransactionTileSection flex={5}>
            <AppText fontSize={Fonts.size.small} ellipsizeMode="tail" numberOfLines={1}>
              {formatDesc}
            </AppText>
          </HsaAccountTransactionTileSection>

          <HsaAccountTransactionTileSection flex={4} alignItems="flex-end">
            <AppText fontSize={Fonts.size.small + 1} testID={amount.toString()} accessibilityLabel={amount.toString()}>
              {getPriceString({ price: Math.abs(amount), country: userCountry, displayAsAmount: true })}
            </AppText>
          </HsaAccountTransactionTileSection>
        </RowContainer>
        <View style={{ marginTop: Metrics.smallMargin }}>
          <IconWithText
            onLinkPress={() => NavigationService.navigate(APP_ROUTES.EXPENSE_DETAILS, { expense })}
            text="Show Expense"
            textStyle={{
              color: Colors.newBlue,
              fontSize: Fonts.size.small + 1,
              fontWeight: "500",
            }}
            iconStyle={{
              marginHorizontal: -5,
              marginRight: Metrics.baseMargin,
            }}
            containerStyles={{
              justifyContent: "flex-start",
            }}
            useSvgIcon
            RenderSvgIcon={() => <TransactionFilledSvgIcon fillColor={Colors.newBlue} height={24} width={24} />}
            testId="show-expense-button"
          />
        </View>
      </HsaAccountTransactionTileContainer>

      <Divider style={{ backgroundColor: Colors.lightGrey, height: 0.7 }} />
    </View>
  );
};
