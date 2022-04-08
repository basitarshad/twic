import * as React from "react";
import { WebView } from "react-native-webview";
import { View, ActivityIndicator } from "react-native";
import { If } from "react-if";
import { pathOr, propOr } from "ramda";
import styled from "styled-components/native";

import { APP_CONSTANTS } from "Constants";
import { ApplicationStyles, Colors } from "../Themes";
import { isEmptyOrNil } from "../Utils";
import { AppNotification, AppText, ScreenContainer } from "../Components";

const WebViewLoader = styled.View`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.transparent};
`;

const WebViewScreen = (props) => {
  const [loader, setLoader] = React.useState(false);
  const { navigation, source } = props;

  const requestForm = pathOr({}, ["route", "params", "requestForm"], props);
  const backNavigation = pathOr(false, ["route", "params", "backNavigation"], props);
  const uriFromParam = pathOr("", ["route", "params", "url"], props);
  const uri = propOr(uriFromParam, "uri", source);
  const webviewSource = !isEmptyOrNil(requestForm) ? requestForm : { uri };

  const requestingVendorMatchingString = (string) => {
    const matchingString = "Twic | Wellness Intelligence";
    if (string === matchingString && backNavigation) {
      navigation.goBack();
      AppNotification.toggleSuccessNotification({ message: "Success", description: "Vendor successfully requested!" });
    }
  };

  return (
    <ScreenContainer>
      <View style={ApplicationStyles.container}>
        <If condition={loader}>
          <WebViewLoader>
            <ActivityIndicator animating={loader} color={Colors.primary} />
          </WebViewLoader>
        </If>
        <If condition={isEmptyOrNil(uri) && isEmptyOrNil(requestForm)}>
          <WebViewLoader>
            <AppText>404: URL Not Found</AppText>
          </WebViewLoader>
        </If>
        <View style={{ overflow: "hidden", flex: 1 }}>
          <WebView
            style={{ opacity: 0.99, marginTop: APP_CONSTANTS.IS_ANDROID ? 0 : 2 }}
            onNavigationStateChange={({ title }) => requestingVendorMatchingString(title)}
            onLoadStart={() => setLoader(true)}
            onLoadEnd={() => setLoader(false)}
            {...props}
            source={webviewSource}
            scalesPageToFit={true}
            androidHardwareAccelerationDisabled={true}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
export default WebViewScreen;
