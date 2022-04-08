import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { If, Then, Else } from "react-if";
import styled from "styled-components/native";
import { propOr } from "ramda";

import { Metrics, Fonts, Colors } from "../../../Themes";
import { AppHeading, TransparentButtonsBorder } from "../AppStyledComponents";
import BoxShadow from "../BoxShadow";
import { APP_CONSTANTS } from "../../../Constants";

type CardContainerProps = {
  backgroundColor?: string;
  isSelected: boolean;
};

export const CardContainer = styled(View)<CardContainerProps>`
  flex-direction: row;
  height: 45;
  padding-horizontal: ${Metrics.doubleBaseMargin};
  background-color: ${(props) => propOr(Colors.white, "backgroundColor", props)};
  border-radius: 5;
  align-items: center;

  ${(props) => !APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder({ borderColor: props.isSelected ? Colors.black : Colors.lightBoxShadowGrey })}
`;

export const UnselectedRadioButtonContainer = styled(View)<any>`
  /* top: 3.5; */
  height: 20;
  width: 20;
  border-radius: 50;
  background-color: ${Colors.lightGrey};
`;

export const RadioButtonContainer = styled(View)<any>`
  /* top: 3.5; */
  height: 20;
  width: 20;
  border-radius: 50;
  align-items: center;
  justify-content: center;
  border-width: 1.5;
  border-color: ${Colors.white};
`;

export const RadioButtonIndicator = styled(View)<any>`
  height: 7;
  width: 7;
  border-radius: 50;
  background-color: ${Colors.white};
`;

export type RadioButtonProps = {
  isSelected: boolean;
  label: string;
  onCheckboxChange(value): void;
  shadowOptions?: object;
  testId?: string;
};
const RadioButton = (props: RadioButtonProps) => {
  const { isSelected = false, label = "", onCheckboxChange, shadowOptions = {}, testId = "" } = props;

  const backgroundColor = isSelected ? Colors.black : Colors.white;
  const textColor = isSelected ? Colors.white : Colors.black;
  return (
    <BoxShadow
      shadowOptions={{
        ...APP_CONSTANTS.SECONDARY_BUTTONS_AND_FIELDS_SHADOW,
        width: "92%",
        height: isSelected ? 5 : 3.5,
        bottom: 6.5,
        backgroundColor: backgroundColor,
        borderBottomColor: backgroundColor,
        ...shadowOptions,
      }}
      shadowContainerStyle={{
        alignItems: "stretch",
      }}
      otherOptions={{
        alignSelf: "center",
      }}
      onPress={() => onCheckboxChange(!isSelected)}
      contentWrapperStyle={{
        borderRadius: Metrics.smallMargin,
      }}
      testId={testId}
    >
      <CardContainer backgroundColor={backgroundColor} isSelected={isSelected}>
        <If condition={isSelected}>
          <Then>
            <RadioButtonContainer>
              <RadioButtonIndicator />
            </RadioButtonContainer>
          </Then>
          <Else>
            <UnselectedRadioButtonContainer />
          </Else>
        </If>
        <View style={{ paddingLeft: Metrics.doubleBaseMargin, justifyContent: "center" }}>
          <AppHeading color={textColor} fontSize={Fonts.size.medium} paddingTop={0}>
            {label}
          </AppHeading>
        </View>
      </CardContainer>
    </BoxShadow>
  );
};

export default RadioButton;
