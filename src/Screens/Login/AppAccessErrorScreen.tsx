import * as React from "react";
import { View, Image } from "react-native";

import { AppText, ScreenContainer } from "../../Components";
import { Fonts, Metrics, ApplicationStyles } from "../../Themes";
import { AppAccessErrorSvgIcon } from "Components/SvgIcons";
import styled from "styled-components/native";

const MsftMsgContainer = styled(View)`
  align-items: center;
  flex: 1;
  justify-content: center;
`;

export const AppAccessErrorScreen = () => {
  return (
    <ScreenContainer>
      <View style={ApplicationStyles.mainContainer}>
        <View style={{ flex: 1 }}>
          <MsftMsgContainer>
            <AppAccessErrorSvgIcon />
            <AppText fontSize={Fonts.size.medium} textAlign="center" paddingTop={Metrics.baseMargin}>
              Thanks for using Forma! Currently your employer does not allow mobile app access. When mobile app access is allowed in the future, we'll let you know. For now, please visit joinforma.com on a web browser.
            </AppText>
          </MsftMsgContainer>
        </View>
      </View>
    </ScreenContainer>
  );
};
