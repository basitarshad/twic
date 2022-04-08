import * as React from "react";
import styled from "styled-components/native";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { propOr } from "ramda";

import APP_CONSTANTS from "Constants/AppConstants";
import NavigationService from "Services/NavigationService";
import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import Fonts from "Themes/Fonts";
import { AppText } from "Components/Commons";
import { NoDataPlaceHolder } from "Components/SvgIcons";

import { APP_ROUTES } from "../../../Navigation";
import { NoVendorsPlaceHolderSectionContainerType } from "./types";

const NoVendorsPlaceHolderSectionContainer = styled(View)<NoVendorsPlaceHolderSectionContainerType>`
  border-color: ${Colors.dimGrey};
  border-width: 2;
  border-radius: 8;
  padding-horizontal: ${Metrics.doubleBaseMargin};
  padding-vertical: ${Metrics.section};
  margin-bottom: ${(props) => propOr(20, "marginBottom", props)};
`;

const SectionFooter = styled.View`
  align-items: center;
  justify-content: center;
`;

export const NoVendorsPlaceHolderSection = (props: { flex?: number }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <NoVendorsPlaceHolderSectionContainer>
        <AppText fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.h4 : Fonts.size.small + 1} color={Colors.charcoalDarkGrey} paddingBottom={Metrics.screenHorizontalPadding}>
          There are currently no vendors available. You can request a brand or product that you’d like to see in our store.
        </AppText>
        <SectionFooter>
          <NoDataPlaceHolder />
        </SectionFooter>
      </NoVendorsPlaceHolderSectionContainer>
      <NoVendorsPlaceHolderSectionContainer>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <AppText textAlign="center" fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.h4 : Fonts.size.small + 1} color={Colors.charcoalDarkGrey} paddingBottom={Metrics.doubleBaseMargin}>
            Looking for something else?
          </AppText>
          <TouchableOpacity onPress={() => NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: "https://twic.typeform.com/to/QjUpdaVG", backNavigation: true })}>
            <AppText textAlign="center" fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.h4 : Fonts.size.small + 1} color={Colors.blue}>
              Request Brand or Product
            </AppText>
          </TouchableOpacity>
        </View>
      </NoVendorsPlaceHolderSectionContainer>
    </ScrollView>
  );
};
