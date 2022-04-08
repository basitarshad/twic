import * as React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { If, Then, Else } from "react-if";
import { pathOr } from "ramda";

import { APP_ROUTES } from "../../../Navigation";
import { AppText } from "Components/Commons/index";
import { Images, Metrics, Colors } from "Themes/index";
import { NavigationService } from "Services/index";
import { APP_CONSTANTS } from "Constants/index";

import { ClaimButton } from "./ClaimButton";

export const EmptyDataBlankSlate = (props) => {
  const { title = "", description = "", showStore = false } = props;
  const showMarketplace = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "showMarketplace"], state));
  const reimbursement = useSelector((state) => pathOr("", ["userProfile", "companyInfo", "reimbursement"], state));
  return (
    <View style={{ height: Metrics.screenHeight - 250, justifyContent: "center", alignItems: "center" }}>
      <Image resizeMode="contain" source={Images.emptyDataIllustration} style={{ height: APP_CONSTANTS.IS_ANDROID ? Metrics.screenWidth / 3 : 150 }} />
      <AppText paddingTop={Metrics.doubleBaseMargin * 2} color={Colors.secondaryText}>
        No Active {title}
      </AppText>
      <If condition={showMarketplace || reimbursement}>
        <AppText paddingTop={Metrics.doubleBaseMargin} textAlign="center" width={250}>
          {description}
        </AppText>
      </If>
      <View style={{ paddingTop: Metrics.doubleBaseMargin }}>
        <If condition={showStore}>
          <Then>
            <If condition={showMarketplace}>
              <TouchableOpacity onPress={() => NavigationService.navigate(APP_ROUTES.HOME_SCREEN)}>
                <AppText color={Colors.blue} fontWeight="700">
                  Go to Store
                </AppText>
              </TouchableOpacity>
            </If>
          </Then>
          <Else>
            <If condition={reimbursement}>
              <ClaimButton />
            </If>
          </Else>
        </If>
      </View>
    </View>
  );
};
