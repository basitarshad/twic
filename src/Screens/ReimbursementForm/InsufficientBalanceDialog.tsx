import * as React from "react";
import { View } from "react-native";

import { RowContainer, IconWithBadge, AppText, IconWithText, AppHeading } from "../../Components/Commons";
import { Colors, Metrics, Images, Fonts } from "../../Themes";
import Collapsible from "react-native-collapsible";
import { CollapsedText, DialogBodyContainer } from "./StyledComponents";

const DialogHeader = () => {
  return (
    <View style={{ backgroundColor: Colors.charcoalGrey, paddingTop: Metrics.baseMargin, paddingHorizontal: Metrics.doubleBaseMargin, borderTopRightRadius: Metrics.baseMargin, borderTopLeftRadius: Metrics.baseMargin }}>
      <RowContainer>
        <IconWithBadge
          useCustomIcon
          iconStyle={{
            marginRight: Metrics.baseMargin,
          }}
          customIconSource={Images.exclamationMark}
          iconSize="small"
        />
        <AppText fontSize={Fonts.size.medium} fontWeight="bold">
          Recurring Claim
        </AppText>
      </RowContainer>
    </View>
  );
};

const DialogBody = (props) => {
  const { wallet = {}, countryCurrency = "$" } = props;
  const { label = "wallet", balance = `${countryCurrency}0`, displayName } = wallet;
  const [isCollapsed, setCollapsed] = React.useState(true);
  const icon = isCollapsed ? "chevron-down" : "chevron-up";

  return (
    <DialogBodyContainer>
      <AppText fontSize={Fonts.size.small} color={Colors.black}>
        You will be reimbursed periodically until the full amount is refunded.
      </AppText>

      <Collapsible duration={500} style={{ paddingBottom: Metrics.baseMargin }} collapsed={isCollapsed}>
        <RowContainer>
          <AppHeading fontSize={Fonts.size.small}>1. When your claim is approved</AppHeading>
        </RowContainer>

        <AppText fontSize={Fonts.size.small} color={Colors.black}>
          You will receive your remaining {displayName} balance (currently: {balance}).
        </AppText>

        <RowContainer>
          <AppHeading fontSize={Fonts.size.small}>2. Every time your {displayName} gets funds</AppHeading>
        </RowContainer>
        <AppText fontSize={Fonts.size.small} color={Colors.black}>
          We will reimburse you until you’ve received a full refund.
        </AppText>
      </Collapsible>

      <CollapsedText activeOpacity={0.8}>
        <IconWithText
          icon={icon}
          iconSize="extraSmall"
          iconColor={Colors.blue}
          text="Learn more"
          textStyle={{
            fontFamily: "TTCommons-DemiBold",
            bottom: 2,
            width: "auto",
            fontSize: Fonts.size.small,
            color: Colors.blue,
          }}
          suffix
          onLinkPress={() => setCollapsed(!isCollapsed)}
        />
      </CollapsedText>
    </DialogBodyContainer>
  );
};

export const InsufficientBalanceDialog = (props) => {
  return (
    <View
      style={{
        marginTop: Metrics.baseMargin + 5,
        marginBottom: Metrics.baseMargin + 5,
        borderColor: Colors.lightGrey,
        borderWidth: 1,
        borderRadius: Metrics.baseMargin,
      }}
    >
      <DialogHeader />
      <DialogBody {...props} />
    </View>
  );
};
