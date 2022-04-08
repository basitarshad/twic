import * as React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import AppSwitch, { AppSwitchProps } from "./AppSwitch";
import { isEmptyOrNil } from "../../Utils";
import { View } from "react-native-animatable";
import { Colors, Fonts } from "../../Themes";

type AppSwitchWithIcon = AppSwitchProps & {
  renderInsideCircle?(): React.ReactNode;
};

const RenderCircleIcon = (props) => {
  const { value } = props;
  const iconName = value ? "check" : `times`;
  const iconSize = value ? 12 : 13;

  return (
    <View>
      <FontAwesome5 name={iconName} color={Colors.white} size={iconSize} />
    </View>
  );
};

const AppSwitchWithIcon = (props) => {
  const { renderInsideCircle, value } = props;

  const _renderInsideCircle = !isEmptyOrNil(renderInsideCircle) ? renderInsideCircle : () => <RenderCircleIcon value={value} />;

  return <AppSwitch {...props} renderInsideCircle={_renderInsideCircle} />;
};

export default AppSwitchWithIcon;
