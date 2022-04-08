import * as React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { If, Then, Else } from "react-if";
import { pathOr } from "ramda";
import styled from "styled-components/native";

import { AppText } from "Components/Commons/AppStyledComponents";
import images from "Themes/Images";
import Metrics from "Themes/Metrics";
import Colors from "Themes/Colors";
import NavigationService from "Services/NavigationService";
import APP_CONSTANTS from "Constants/AppConstants";

import { APP_ROUTES } from "../../../Navigation";

export const NewClaimButtonContainer = styled(View)`
  justify-content: center;
  align-items: flex-end;
  padding-left: ${Metrics.baseMargin};
`;

export const EmptyDataBlankSlate = (props) => {
  const { title = "", description = "", showStore = false } = props;
  const showMarketplace = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "showMarketplace"], state));
  return (
    <View style={{ height: Metrics.screenHeight - 250, justifyContent: "center", alignItems: "center" }}>
      <Image resizeMode="contain" source={images.emptyDataIllustration} style={{ height: APP_CONSTANTS.IS_ANDROID ? Metrics.screenWidth / 3 : 150 }} />
      <AppText paddingTop={Metrics.doubleBaseMargin * 2} color={Colors.secondaryText}>
        No Active {title}
      </AppText>
      <If condition={showMarketplace}>
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
            <NewClaimButtonContainer />
          </Else>
        </If>
      </View>
    </View>
  );
};
