// import { NavigationActions, StackActions } from 'react-navigation';
import { createNavigationContainerRef, CommonActions, StackActions } from "@react-navigation/native";
import { defaultTo } from "ramda";

import { generateUUID, isEmptyOrNil } from "../Utils";

export const navigationRef: any = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    try {
      navigationRef.dispatch(
        CommonActions.navigate({
          name: name,
          params: defaultTo({}, params),
          // key: generateUUID(),
        }),
      );
    } catch (error) {
      console.log("error in navigation", error);
    }
  }
}

function replaceScreen(routeName: string, params?: object) {
  try {
    navigationRef.dispatch(StackActions.replace(routeName, params));
  } catch (error) {
    console.log("error in replaceScreen navigation", error);
  }
}

function resetStack(routeName: string, params?: object) {
  try {
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName, params })],
    //   key: null,
    // });
    // navigationRef.dispatch(resetAction);
  } catch (error) {
    // console.log('error in resetStack navigation', error)
  }
}

function goBackToPreviousScreen() {
  try {
    navigationRef.dispatch(CommonActions.goBack());
  } catch (error) {
    console.log("error in goBackToPreviousScreen navigation", error);
  }
}

function goBackToFirstScreenOfStack(n?) {
  try {
    navigationRef.dispatch(!isEmptyOrNil(n) ? StackActions.pop(n) : StackActions.popToTop());
  } catch (error) {
    console.log("error in goBackToFirstScreenOfStack navigation", error);
  }
}

// add other navigation functions that you need and export them
export default {
  navigate,
  goBackToPreviousScreen,
  replaceScreen,
  goBackToFirstScreenOfStack,
  resetStack,
};
