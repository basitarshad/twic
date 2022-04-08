import * as React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { pathOr } from "ramda";

import { Colors, Fonts, Images } from "Themes";
import { AppHeading, AppText, IconWithText } from "Components";
import { connectPreTaxAlegeusAccounts } from "Actions";
import { PretaxAccountsType } from "types";

import { HsaAccountCardContainer } from "./StyledComponents";

const REDIRECT_LINK = "InvestmentsForAccount";

type Props = {
  accountDetails: PretaxAccountsType;
};

const cutomRelayValue = "RPID=https://twic.wealthcareportal.com&wctx=%2FPage%2FDashboard";

export const HsaTransferCard: React.FC<Props> = (props) => {
  const [show, setShow] = React.useState(true);
  const dispatch = useDispatch();
  const hsaTransferEnabled = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "hsaTransferEnabled"], state));

  const { accountDetails } = props;
  const { defaultOptions, flexAccountKey } = accountDetails;

  if (!hsaTransferEnabled || (hsaTransferEnabled && !show)) return null;

  return (
    <HsaAccountCardContainer style={{ backgroundColor: "#F2F8FF", borderColor: "#B0D2FF", borderWidth: 1, paddingBottom: 20 }}>
      <TouchableOpacity onPress={() => setShow(false)} style={{ alignSelf: "flex-end" }}>
        <Icon name="close" size={15} color={Colors.charcoalLightGrey} />
      </TouchableOpacity>
      <AppHeading fontSize={Fonts.size.h2}>Transfer Your HSA Funds</AppHeading>
      <AppText paddingTop={5}>Save money by combining all your HSA funds.</AppText>
      <IconWithText
        icon={Images.arrowBlueRight}
        useCustomIcon
        iconSize="regular"
        iconColor={Colors.newBlue}
        text="Get Started"
        textStyle={{
          fontFamily: "TTCommons-DemiBold",
          bottom: 0,
          left: -5,
          width: "auto",
          fontWeight: "bold",
          fontSize: Fonts.size.h4,
          color: Colors.newBlue,
        }}
        iconStyle={{ marginLeft: -3 }}
        containerStyles={{ marginTop: 10 }}
        onLinkPress={() => dispatch(connectPreTaxAlegeusAccounts(REDIRECT_LINK, flexAccountKey, defaultOptions, cutomRelayValue))}
      />
    </HsaAccountCardContainer>
  );
};
