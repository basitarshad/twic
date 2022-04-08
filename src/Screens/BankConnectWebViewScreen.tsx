import * as React from "react";
import { WebView, WebViewNavigation } from "react-native-webview";
import { ActivityIndicator } from "react-native";
import { If } from "react-if";
import styled from "styled-components/native";
import { useDispatch } from "react-redux";

import { Colors } from "../Themes";
import { getQueryParams, isEmptyOrNil } from "../Utils";
import { AppNotification, AppText, ScreenContainer } from "../Components";
import { NavigationService } from "../Services";
import { onBankAccountConnect } from "../Actions";
import { APP_ROUTES } from "../Navigation";

const WebViewLoader = styled.View`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.transparent};
`;

const WebViewScreen = (props: { route: any }) => {
  const [loader, setLoader] = React.useState(false);
  const { route } = props;

  const uri = route.params.url || "";
  const isManual = route.params.url || "isManual";
  const dispatch = useDispatch();

  const goBack = React.useCallback(() => {
    if (isManual) {
      NavigationService.goBackToFirstScreenOfStack(1);
      NavigationService.navigate(APP_ROUTES.PAYMENTS_SCREEN);
    } else {
      NavigationService.goBackToFirstScreenOfStack(1);
    }
  }, [isManual]);

  return (
    <ScreenContainer>
      <If condition={loader}>
        <WebViewLoader>
          <ActivityIndicator animating={loader} color={Colors.primary} />
        </WebViewLoader>
      </If>
      <If condition={isEmptyOrNil(uri)}>
        <WebViewLoader>
          <AppText>404: URL Not Found</AppText>
        </WebViewLoader>
      </If>
      <WebView
        onNavigationStateChange={(navState: WebViewNavigation) => {
          const match = getQueryParams(navState.url, "connected_status");

          if (match && match === "success") {
            dispatch(onBankAccountConnect(goBack));
          } else if (match && match === "failure") {
            AppNotification.toggleErrorNotification({
              message: "Error",
              description: "Direct deposit failed!",
            });
          }
        }}
        onLoadStart={() => setLoader(true)}
        onLoadEnd={() => setLoader(false)}
        {...props}
        source={{ uri }}
        scalesPageToFit={true}
      />
    </ScreenContainer>
  );
};
export default WebViewScreen;
