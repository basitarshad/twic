import * as React from "react";
import { If, Then, Else } from "react-if";
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from "react-native-keyboard-aware-scroll-view";

import { Metrics } from "../../Themes";
import { ScreenContainer } from "./AppStyledComponents";

type ScreenWrapperProps = {
  children: React.ReactNode;
  scrollView?: boolean;
  screenContainerProps?: Object;
  screenContainerStyle?: Object;
  scrollViewProps?: KeyboardAwareScrollViewProps;
  // @TODO once all the designs are migrated remove this newDesignSystem prop
  newDesignSystem?: boolean;
};

export const ScreenWrapper = (props: ScreenWrapperProps) => {
  const {
    children,
    scrollView = true,
    newDesignSystem = false,
    screenContainerProps = {
      paddingLeft: newDesignSystem ? Metrics.newScreenHorizontalPadding : Metrics.screenHorizontalPadding,
      paddingRight: newDesignSystem ? Metrics.newScreenHorizontalPadding : Metrics.screenHorizontalPadding,
      paddingBottom: 0,
      paddingTop: 0,
    },
    scrollViewProps = {
      keyboardShouldPersistTaps: "always",
      showsVerticalScrollIndicator: false,
      enableOnAndroid: true,
      extraScrollHeight: 100,
    },
    screenContainerStyle = {},
  } = props;
  return (
    <ScreenContainer {...screenContainerProps} style={{ ...screenContainerStyle }}>
      <If condition={scrollView}>
        <Then>
          <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 10 }} {...scrollViewProps}>
            {children}
          </KeyboardAwareScrollView>
        </Then>
        <Else>{children}</Else>
      </If>
    </ScreenContainer>
  );
};
