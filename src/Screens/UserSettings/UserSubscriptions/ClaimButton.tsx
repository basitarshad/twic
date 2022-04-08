import * as React from "react";
import { View } from "react-native";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";

import { IconWithText } from "Components/Commons/index";
import { APP_ROUTES } from "../../../Navigation";
import { NavigationService } from "Services/index";
import { Colors, Fonts, Metrics } from "Themes/index";
import { PlusCircleSvgIcon } from "Components/SvgIcons/index";

const ClaimButtonContainer = styled(View)`
  justify-content: center;
  align-items: flex-end;
  padding-left: ${Metrics.baseMargin};
`;

export const ClaimButton = () => {
  const reimbursement = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "reimbursement"], state));
  if (!reimbursement) return null;
  return (
    <ClaimButtonContainer>
      <IconWithText
        textStyle={{
          fontFamily: "TTCommons-DemiBold",
          fontSize: Fonts.size.medium,
          color: Colors.blue,
          paddingTop: 0,
          fontWeight: "700",
        }}
        useSvgIcon={true}
        iconStyle={{ marginLeft: 0 }}
        onLinkPress={() => NavigationService.navigate(APP_ROUTES.NEW_REIMBURSEMENT)}
        RenderSvgIcon={() => <PlusCircleSvgIcon fillColor={Colors.blue} />}
        text={"New Claim"}
        testId="new-claim-button"
      />
    </ClaimButtonContainer>
  );
};
