import AppConstants from "Constants/AppConstants";
import { StyleSheet, Dimensions, View, Image } from "react-native";
import styled from "styled-components/native";
import { ApplicationStyles, Fonts, Metrics, Colors } from "../../Themes";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create<any>({
  container: ApplicationStyles.container,
  mainContainer: ApplicationStyles.mainContainer,
  logoContainer: {
    paddingTop: Metrics.doubleBaseMargin * 3,
    alignItems: "center",
  },
  logo: {
    resizeMode: "contain",
    height: 30,
  },
  magicLinkContainer: {
    marginTop: Metrics.doubleBaseMargin * 2,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  magicLink: {
    resizeMode: "contain",
    height: 170,
    marginBottom: Metrics.doubleBaseMargin,
  },
  loginHeaderContainer: {
    flex: 1,
  },
  loginContentContainer: {
    flex: 1.5,
    alignItems: "center",
  },
  footerText: {
    fontSize: Fonts.size.small,
    textAlign: "center",
    color: Colors.primaryText,
  },
});

export const ResetPasswordScreenContainer = styled(View)`
  flex: 1;
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
`;

export const ResetPasswordScreenHeaderContainer = styled(View)`
  padding-top: ${Metrics.baseMargin};
`;

export const ResetPasswordScreenLogoContainer = styled(View)`
  padding-top: ${Metrics.screenHorizontalPadding};
  align-items: center;
`;

export const ResetPasswordScreenBodyContainer = styled(View)`
  padding-top: ${Metrics.screenHorizontalPadding};
  flex: 1;
`;

export const ResetFormButtonContainer = styled(View)`
  align-items: center;
`;

export const PasswordUIWrapper = styled(View)`
  flex: 1;
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
  padding-top: 50;
`;

export const MagicLinkContainer = styled(View)`
  margin-top: ${Metrics.doubleBaseMargin * 2};
  align-items: center;
  padding-horizontal: 10;
  flex: 2;
`;

export const MagicLinkImage = styled(Image)`
  resize-mode: contain;
  height: 170;
  margin-bottom: ${Metrics.doubleBaseMargin};
`;

export const ResetPasswordBtnWrapper = styled(View)`
  flex: 1;
  justify-content: flex-end;
  padding-bottom: ${AppConstants.IS_ANDROID ? 40 : 30};
`;
