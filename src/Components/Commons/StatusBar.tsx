import * as React from "react";
import { View, StatusBar as RNStatusBar, StatusBarProps as RNStatusBarProps } from "react-native";
import { Colors } from "Themes";

interface StatusBarProps extends RNStatusBarProps {
  containerProps?: object;
}

export const StatusBar = (props: StatusBarProps) => {
  const [height, setHeight] = React.useState(0);
  const { containerProps = {}, translucent = true, barStyle = "dark-content", backgroundColor = Colors.white } = props;

  // below code commented for now, may be it can be in use in future

  // React.useEffect(() => {
  //   if (!APP_CONSTANTS.IS_ANDROID) {
  //     StatusBarManager.getHeight((statusBarHeight) => {
  //       setHeight(parseInt(statusBarHeight.height || 0));
  //     });
  //   }
  // }, []);

  return (
    <View style={{ height, backgroundColor, ...containerProps }}>
      <RNStatusBar barStyle={barStyle} translucent={translucent} backgroundColor={backgroundColor} />
    </View>
  );
};
