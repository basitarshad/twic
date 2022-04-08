import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { pathOr, propOr, toUpper } from "ramda";
import { If } from "react-if";
import { Divider } from "react-native-elements";
import { View } from "react-native";

import { AppSwitchWithIcon, AppText } from "../../Components";
import { Colors, Fonts, Metrics } from "../../Themes";
import { APP_CONSTANTS } from "../../Constants";
import { updateUserSettings } from "../../Actions";
import { SectionHeader } from "./StyledComponents";
import { AddressSection } from "./Components/AddressSection";

const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium;

const CardsSettingsScreen = () => {
  const userProfile: any = useSelector((state) => propOr({}, "userProfile", state));
  const { cardHolderInfo = {}, userInfo = {}, companyInfo = {} } = userProfile;
  const dispatch = useDispatch();
  const userCountry: string = propOr("us", "country", userInfo);
  // FIELD TO SHOW SECTION
  const walletOverdraft: boolean = propOr(false, "walletOverdraft", companyInfo);
  // ACTUAL VALUE OF THE FIELD
  const walletOverdraftEnabled: boolean = propOr(false, "walletOverdraftEnabled", userInfo);
  const flexModeEnabled: boolean = propOr(false, "flexModeEnabled", userInfo);
  const travelModeEnabled: boolean = pathOr(false, ["twicCardSecurity", "travel_mode_enabled"], userInfo);
  const { billingAddress = {} } = cardHolderInfo;
  const updatedBillingAddress = {
    ...billingAddress,
    zip: billingAddress.postalCode || "",
  };
  const mailingAddress = {
    line1: pathOr("", ["address", "street"], userInfo),
    line2: pathOr("", ["address", "street_ext"], userInfo),
    city: pathOr("", ["address", "locality"], userInfo),
    state: pathOr("", ["address", "state"], userInfo),
    country: toUpper(userCountry),
    zip: pathOr("", ["address", "zip"], userInfo),
  };

  const setSettingValue = async (fieldName: string, value: boolean) => {
    await dispatch(updateUserSettings({ [fieldName]: value }));
  };

  type SettingSectionType = {
    heading: string;
    fieldValue: boolean;
    onSwitchClick: () => void;
    description: string;
  };

  const SettingSection = (props: SettingSectionType) => {
    const { heading, fieldValue, onSwitchClick, description } = props;
    return (
      <>
        <SectionHeader testID="cards-settings-tab" accessibilityLabel="cards-settings-tab">
          <AppText fontWeight={"bold"} fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.medium : Fonts.size.regular}>
            {heading}
          </AppText>
          <AppSwitchWithIcon value={fieldValue} onValueChange={onSwitchClick} />
        </SectionHeader>
        <AppText fontSize={FONT_SIZE} paddingTop={Metrics.smallMargin} color={Colors.placeholderColor}>
          {description}
        </AppText>
      </>
    );
  };

  return (
    <View>
      <AddressSection heading="Billing Address" address={updatedBillingAddress} addressType="billing" testId="billing-address-edit-button" />
      <AddressSection heading="Mailing Address" address={mailingAddress} addressType="mailing" testId="mailing-address-edit-button" />
      <Divider
        style={{
          backgroundColor: Colors.darkGrey,
          marginTop: Metrics.screenHorizontalPadding,
        }}
      />
      <If condition={walletOverdraft}>
        <SettingSection
          heading="Overdraft"
          fieldValue={walletOverdraftEnabled}
          description="Enable to charge the remaining balance of any transactions that cost more than your account balance onto your credit card. Forma places a $500 overdraft limit by default."
          onSwitchClick={() => setSettingValue("wallet_overdraft_enabled", !walletOverdraftEnabled)}
        />
      </If>

      <SettingSection
        heading="Flex Mode"
        fieldValue={flexModeEnabled}
        description="Enable to allow for a broader range of eligible transactions to be approved immediately. If certain transactions require additional verification, Forma will send you an SMS text asking for you to provide a receipt to verify the purchase."
        onSwitchClick={() => setSettingValue("flex_mode_enabled", !flexModeEnabled)}
      />
      <SettingSection
        heading="Travel Mode"
        fieldValue={travelModeEnabled}
        description="When Travel Mode is enabled, transactions made in foreign currencies different from your card's currency (USD) will be approved."
        onSwitchClick={() => setSettingValue("travel_mode_enabled", !travelModeEnabled)}
      />
    </View>
  );
};
export default CardsSettingsScreen;
