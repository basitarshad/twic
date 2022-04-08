import * as React from "react";
import styled from "styled-components/native";
import { propOr } from "ramda";
import { View, TouchableOpacity, Platform, StyleProp } from "react-native";
import { If, Then, Else } from "react-if";

import { Colors, Metrics, Fonts } from "../../../Themes";
import { AppText } from "../AppStyledComponents";
import IconWithText from "../IconWithText";
import { AddElementShadow } from "../ElementShadow";

type CardContainerProps = {
  backgroundColor?: string;
  addShadow?: boolean;
};
const CardContainer = styled(TouchableOpacity)<CardContainerProps>`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${Metrics.smallMargin};
  padding-vertical: ${Metrics.baseMargin};
  padding-horizontal: ${Metrics.doubleBaseMargin};
  margin-horizontal: ${Metrics.smallMargin};
  border-radius: 5;

  ${(props) => {
    return props.addShadow ? AddElementShadow({ backgroundColor: propOr(Colors.white, "backgroundColor", props) }) : `background-color: ${propOr(Colors.white, "backgroundColor", props)}`;
  }};
`;

type FilterButton = {
  selected: boolean;
  onPressHandler(): void;
  label: string;
  iconWithTextProps?: object;
  useIconWithText?: boolean;
  addShadow?: boolean;
  activeColor?: string;
  style?: object;
};

/* Radio Button Components */
const UnselectedRadioButtonContainer = styled(View)<any>`
  height: 18.5;
  width: 18.5;
  border-radius: 50;
  background-color: ${Colors.lightGrey};
  margin-left: ${Metrics.baseMargin};
  justify-content: center;
`;
const RadioButtonContainer = styled(UnselectedRadioButtonContainer)<any>`
  align-items: center;
  justify-content: center;
  border-width: 1.5;
  border-color: ${Colors.white};
  background-color: ${(props) => propOr(Colors.white, "backgroundColor", props)};

  margin-left: ${Metrics.baseMargin};
`;
const RadioButtonIndicator = styled(View)<any>`
  height: 7;
  width: 7;
  border-radius: 50;
  background-color: ${Colors.white};
`;

const FilterRadioButton = (props: FilterButton) => {
  const { activeColor = Colors.black, selected = false, useIconWithText = false, iconWithTextProps = {}, onPressHandler, label = "", addShadow = true, style = {} } = props;

  const textColor = selected ? Colors.white : Colors.black;
  const backgroundColor = selected ? activeColor : Colors.white;
  return (
    <CardContainer addShadow={addShadow} backgroundColor={backgroundColor} onPress={() => onPressHandler()} style={style}>
      <If condition={selected}>
        <Then>
          <RadioButtonContainer backgroundColor={backgroundColor}>
            <RadioButtonIndicator />
          </RadioButtonContainer>
        </Then>
        <Else>
          <UnselectedRadioButtonContainer />
        </Else>
      </If>

      <View style={{ paddingLeft: Metrics.smallMargin }}>
        <If condition={!useIconWithText}>
          <Then>
            <AppText style={{ marginLeft: Metrics.baseMargin }} color={textColor}>
              {label}
            </AppText>
          </Then>
          <Else>
            <IconWithText
              text={label}
              textStyle={{
                color: textColor,
                width: "auto",
                fontSize: Fonts.size.medium,
                fontWeight: "bold",
                bottom: Platform.OS === "android" ? 1 : 0,
              }}
              iconStyle={{
                top: 0,
                marginHorizontal: Metrics.baseMargin,
              }}
              isDisabled={true}
              {...iconWithTextProps}
            />
          </Else>
        </If>
      </View>
    </CardContainer>
  );
};

export default FilterRadioButton;
