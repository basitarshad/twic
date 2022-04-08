import * as React from "react";
import { Image } from "react-native";

import { AppHeading, BoxShadow, AppText } from "Components/Commons";
import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import Images from "Themes/Images";
import { isEmptyOrNil, ignoreCaseSensitivityAndReplaceWord } from "Utils/helpers";
import { getPriceString } from "Utils/amountCalculation.helpers";
import NavigationService from "Services/NavigationService";
import APP_ROUTES from "../../Navigation/AppRoutes";
import APP_CONSTANTS from "Constants/AppConstants";
import { PretaxAccountsType, WalletCardProps } from "../../types";
import { AccountCardType } from "./types";
import { getAccountImage } from "./metadata";
import { AccountCardSection, AccountCardBorderContainer, AccountCardContentContainer } from "./StyledComponents";
import { Fonts } from "Themes";

export const AccountCard = (props: AccountCardType) => {
  const { account, userCountry } = props;
  // THESE VARIABLES ARE DESTRCUTURED SEPERATELY BECAUSE TWO OF THE BELONGS TO BOTH TYPES AND OTHER BELONGS TO SEPARATE TYPES
  // walletTypeId BELONGS TO WalletCardProps
  // accountTypeClassCode BELONGS TO PretaxAccountsType
  const { name, amount } = account as PretaxAccountsType | WalletCardProps;
  const { walletTypeId } = account as WalletCardProps;
  const { accountTypeClassCode } = account as PretaxAccountsType;
  const formatName = ignoreCaseSensitivityAndReplaceWord(name, " wallet", "");

  const isPretaxAccount = isEmptyOrNil(walletTypeId);
  const selectedAccountProperty = isPretaxAccount ? accountTypeClassCode : walletTypeId;
  const accountIcon = getAccountImage.get(selectedAccountProperty) || Images.commuter;
  return (
    <BoxShadow
      shadowOptions={{
        ...APP_CONSTANTS.SECONDARY_BUTTONS_AND_FIELDS_SHADOW,
        shadowColor: Colors.black,
        shadowRadius: 4,
        bottom: 8,
        height: 4,
      }}
      otherOptions={{
        alignSelf: "center",
      }}
      shadowContainerStyle={{
        alignItems: "stretch",
        marginVertical: Metrics.baseMargin - 5,
        backgroundColor: "white",
      }}
      onPress={() =>
        isPretaxAccount
          ? NavigationService.navigate(APP_ROUTES.PRETAX_ACCOUNT_DETAIL_SCREEN, {
              accountDetails: account,
            })
          : NavigationService.navigate(APP_ROUTES.POSTTAX_ACCOUNT_DETAIL_SCREEN, {
              accountDetails: account,
            })
      }
      contentWrapperStyle={{
        borderRadius: Metrics.smallMargin,
        marginHorizontal: 2,
      }}
    >
      <AccountCardBorderContainer>
        <AccountCardContentContainer testID={formatName} accessibilityLabel={formatName}>
          <AccountCardSection style={{ marginHorizontal: 15 }} alignItems="center">
            <Image
              source={accountIcon}
              style={{
                height: Metrics.images.extraMedium,
                width: Metrics.images.extraMedium,
              }}
            />
          </AccountCardSection>
          <AccountCardSection flex={1}>
            <AppText fontSize={Fonts.size.normal} fontWeight="400" ellipsizeMode="tail" numberOfLines={2} paddingTop={0} testID={formatName} accessibilityLabel={formatName}>
              {formatName}
            </AppText>
            <AppHeading fontSize={Fonts.size.normal} fontWeight="bold" paddingTop={2}>
              {getPriceString({ price: amount, country: userCountry })}
            </AppHeading>
          </AccountCardSection>
        </AccountCardContentContainer>
      </AccountCardBorderContainer>
    </BoxShadow>
  );
};
