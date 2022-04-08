import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { Else, If, Then } from "react-if";
import { AppState, Text, View } from "react-native";
import codePush from "react-native-code-push";
import { Provider } from "react-redux";
import { navigationRef } from "Services/NavigationService";
import { BugsnagAnalytics } from "./AppAnalytics";
import { AppAlert, AppErrorBoundary, AppErrorDialog, AppNotification, AppScreenLoader, StatusBar } from "./Components";
import { clearImagesCache } from "./Components/Commons/CachedImageBackground";
import { APP_CONSTANTS } from "./Constants";
import { AppNavigator } from "./Navigation/AppNavigator";
import store from "./Redux/store";
import CodePushScreen from "./Screens/CodePushScreen";
import { AsyncStorageService, FetchVersionService, PushNotificationService } from "./Services";

const { AppFlashMessage } = AppNotification;

//@ts-ignore
Text.defaultProps = {
  //@ts-ignore
  ...Text.defaultProps,
  maxFontSizeMultiplier: 1.1,
};

const AppContainer = (props) => {
  const [isCodePushUpdating, setIsCodePushUpdating] = React.useState(false);

  const onSyncUpdate = (SyncStatus) => {
    switch (SyncStatus) {
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
      case codePush.SyncStatus.INSTALLING_UPDATE:
        setIsCodePushUpdating(true);
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
      case codePush.SyncStatus.UP_TO_DATE:
      case codePush.SyncStatus.UPDATE_INSTALLED:
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        setTimeout(() => {
          setIsCodePushUpdating(false);
        }, 1500);
        break;

      default:
        setTimeout(() => {
          setIsCodePushUpdating(false);
        }, 1500);
        break;
    }
  };

  React.useEffect(() => {
    PushNotificationService.registerDeviceForRemoteMessages();
    PushNotificationService.initializePushNotifications({ store });

    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        // minimumBackgroundDuration: 60 * 10,
        updateDialog: {
          title: "An update is available!",
          mandatoryContinueButtonLabel: "Install",
        },
      },
      onSyncUpdate,
    );
    AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.APP_LOADED, "true");
  }, []);

  return (
    <Provider store={store}>
      <AppScreenLoader />
      {isCodePushUpdating ? <CodePushScreen /> : <AppNavigator />}
    </Provider>
  );
};

const handleAppStateChange = async (nextAppState) => {
  switch (nextAppState) {
    case "active":
      FetchVersionService.shouldAppUpdate();
      break;
    default:
      return;
  }
};

const App = () => {
  const { isConnected } = useNetInfo();

  React.useEffect(() => {
    clearImagesCache();
  }, [isConnected]);

  React.useEffect(() => {
    BugsnagAnalytics.initBugSnag();
    FetchVersionService.shouldAppUpdate();
    AppState.addEventListener("change", handleAppStateChange);
  }, []);

  return (
    <>
      <StatusBar />
      <If condition={!!isConnected}>
        <Then>
          <AppErrorBoundary>
            <NavigationContainer ref={navigationRef}>
              <AppContainer />
            </NavigationContainer>
          </AppErrorBoundary>
        </Then>
        <Else>
          <View style={{ flex: 1 }}>
            <AppErrorDialog isModalVisible errorMessage={APP_CONSTANTS.NO_INTERNET_CONNECTION} title="No Internet Connection." showButton={false} />
          </View>
        </Else>
      </If>
      <AppFlashMessage />
    </>
  );
};

export default App;
