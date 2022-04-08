import * as React from "react";
import { Switch } from "react-native-switch";

import { Colors } from "../../Themes";
import { isEmptyOrNil } from "../../Utils";

export type AppSwitchProps = {
  onValueChange(): void;
  value: boolean;
  testId?: string;
  circleSize?: number;
  circleActiveColor?: string;
  circleInActiveColor?: string;
  barHeight?: number;
  backgroundActive?: string;
  backgroundInactive?: string;
  disabled?: boolean;
  renderInsideCircle?: () => React.ReactNode;
};
const AppSwitch = (props: AppSwitchProps) => {
  const {
    onValueChange,
    value,
    testId = "",
    disabled = false,

    circleSize = 20,
    circleActiveColor = Colors.newBlue,
    circleInActiveColor = Colors.newCharcoalDarkGrey,

    barHeight = 20,
    backgroundActive = Colors.lightBlue,
    backgroundInactive = Colors.grey,
    renderInsideCircle,
  } = props;

  return (
    <Switch
      onValueChange={onValueChange}
      disabled={disabled}
      value={value}
      changeValueImmediately
      circleSize={circleSize}
      circleActiveColor={circleActiveColor}
      circleInActiveColor={circleInActiveColor}
      circleBorderWidth={0}
      barHeight={barHeight}
      backgroundActive={backgroundActive}
      backgroundInactive={backgroundInactive}
      containerStyle={{
        testID: testId,
      }}
      {...(!isEmptyOrNil(renderInsideCircle) && { renderInsideCircle })}
      renderActiveText={false}
    />
  );
};

export default AppSwitch;
