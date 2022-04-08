import * as React from "react";
import { View, Image, Platform, TouchableOpacity } from "react-native";
import styled from "styled-components";

import { IllustrationSvg } from "Components/SvgIcons";
import { NavigationService } from "Services";
import { Images, Colors } from "Themes";
import { PrimaryButton, AppText, ScreenContainer } from "Components";
import AppConstants from "Constants/AppConstants";

import { APP_ROUTES } from "../../Navigation";
import { useStatusBarTheme } from "../../Hooks";
import { styles } from "./StyledComponents";

const ImageWrapper = styled(View)`
  flex: 1;
  justify-content: flex-end;
  align-self: center;
`;
const Container = styled(View)`
  flex: 1;
  background-color: ${Colors.warmWhite};
`;

const AuthSelectionScreen = () => {
  useStatusBarTheme();

  const onNavigationChangeHandler = (authType: string) => {
    NavigationService.navigate(APP_ROUTES.LOGIN_SCREEN, { authType });
  };

  return (
    <ScreenContainer>
      <Container>
        <View style={{ flex: 1 }}>
          <ImageWrapper>
            <Image
              source={Images.formaLogo}
              style={{
                resizeMode: "contain",
                height: 140,
              }}
            />
          </ImageWrapper>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <PrimaryButton
            buttonLabel="Get Magic Link"
            width={AppConstants.MUI_BTN_WIDTH}
            disabled={false}
            buttonColor={Colors.white}
            buttonShadowColor={Platform.OS === "android" ? Colors.primaryText : Colors.darkGrey}
            buttonStyle={{ borderWidth: 1, borderRadius: 7, borderColor: Colors.lightGrey }}
            labelStyle={{
              color: Colors.primaryText,
            }}
            onClickHandler={() => onNavigationChangeHandler("magicLink")}
            testId="email-magic-link"
            shadowOptions={{ width: 0, height: 10 }}
          />
          <TouchableOpacity style={{ paddingHorizontal: 30, marginTop: 30, marginBottom: 140 }} onPress={() => onNavigationChangeHandler("manually")}>
            <AppText style={{ fontFamily: "TTCommons-DemiBold" }} fontWeight={AppConstants.IS_ANDROID ? "400" : "bold"} fontSize={18} color={Colors.newDarkGrey}>
              Sign In
            </AppText>
          </TouchableOpacity>
        </View>
      </Container>
    </ScreenContainer>
  );
};

export default AuthSelectionScreen;
