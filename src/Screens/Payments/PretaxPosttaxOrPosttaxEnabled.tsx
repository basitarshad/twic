import * as React from "react";
import { propOr } from "ramda";
import { View } from "react-native";

import { AppText, IconWithText } from "../../Components";
import { APP_CONSTANTS } from "../../Constants";
import { Fonts, Metrics, Images, Colors } from "../../Themes";
import { ActionButton } from "./PaymentComponents";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";
import { isEmptyOrNil } from "../../Utils";
import { PretaxPosttaxOrPosttaxEnabledType } from "./types";

const PretaxPosttaxOrPosttaxEnabled = (props: PretaxPosttaxOrPosttaxEnabledType) => {
  const { isAccountConnected, bankAccount } = props;
  const last4 = propOr("", "last4", bankAccount);
  return (
    <View testID="direct-deposit" accessibilityLabel="direct-deposit">
      <ActionButton
        secondaryComponent={() => {
          if (!isAccountConnected)
            return (
              <AppText width="50%" fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small} color={Colors.rose} textAlign="right">
                Add a bank account
              </AppText>
            );
          return (
            <AppText width="50%" numberOfLines={1} ellipsizeMode="tail" fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small} color={Colors.charcoalLightGrey} textAlign="right">
              {!isEmptyOrNil(last4) ? `Account ending in ${last4}` : "Bank account connected"}
            </AppText>
          );
        }}
        primaryComponent={() => (
          <IconWithText
            textStyle={{
              fontSize: APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small,
            }}
            iconStyle={{ height: Metrics.icons.extraSmall + 6, width: Metrics.icons.extraSmall + 6, marginTop: 4 }}
            icon={Images.activeRadio}
            iconSize="tiny"
            useCustomIcon
            isDisabled={true}
            text="Direct Deposit"
          />
        )}
        needTouchableOpacity={false}
        containerStyle={{ paddingHorizontal: 0, paddingVertical: Metrics.baseMargin, paddingRight: Metrics.baseMargin }}
        onPress={() => NavigationService.navigate(APP_ROUTES.USER_BANK_ACCOUNT)}
      />
    </View>
  );
};

export default PretaxPosttaxOrPosttaxEnabled;
