import * as React from "react";
import { StyleSheet, Platform, Dimensions, View, Text } from "react-native";
import styled from "styled-components";
import { propOr } from "ramda";

import { ApplicationStyles, Metrics, Colors, Fonts } from "Themes";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create<any>({
  container: ApplicationStyles.container,
  mainContainer: ApplicationStyles.mainContainer,
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    resizeMode: "contain",
    height: 30,
  },
  notificationIllustrationContainer: {
    marginTop: Metrics.doubleBaseMargin,
    alignItems: "center",
  },
  notificationIllustration: {
    resizeMode: "contain",
    height: Platform.OS === "android" ? width / 3 : 100,
    marginBottom: Metrics.doubleBaseMargin,
  },
  headerContainer: {
    paddingTop: Metrics.doubleBaseMargin * 2.5,
  },
  contentContainer: {
    paddingTop: Metrics.doubleBaseMargin * 2.5,
  },
  footerContainer: {
    width: Dimensions.get("screen").width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const CarouselContainer = styled(View)`
  margin-bottom: ${Metrics.doubleBaseMargin};
  margin-top: ${Metrics.doubleBaseMargin};
`;

type ButtonLabelProps = {
  buttonLabelColor?: string;
};

export const ButtonLabel = styled(Text)<ButtonLabelProps>`
  font-size: ${Fonts.size.medium};
  color: ${(props) => propOr(Colors.newBlue, "buttonLabelColor", props)};
  font-family: TTCommons-DemiBold;
  font-weight: ${Platform.OS === "android" ? "400" : "bold"};
  text-align: center;
`;

export const PretaxRenderItem = styled(View)`
  width: 95%;
  height: auto;
  border-left-width: 4;
  padding-left: 20;
  padding-right: 20;
`;
