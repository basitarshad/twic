import { propOr } from "ramda";
import * as React from "react";
import { Platform, StyleProp, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { CheckBoxButton } from "twic_mobile_components";
import { Colors, Metrics } from "../../../Themes";
import { AddElementShadow } from "../ElementShadow";

type CardContainerProps = {
  backgroundColor?: string;
  addShadow?: boolean;
};
const CardContainer = styled(TouchableOpacity)<CardContainerProps>`
  flex-direction: row;
  align-items: center;
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

/* Checbox components */
const UnselectedCheckboxContainer = styled(View)<any>`
  height: 20;
  width: 20;
  border-radius: 4;
  ${Platform.OS === "android" && `border-width:1; border-color: ${Colors.lightGrey};`}

  ${AddElementShadow()};
  elevation: 0;
`;

const CheckboxContainer = styled(UnselectedCheckboxContainer)<any>`
  align-items: center;
  justify-content: center;

  ${(props) => {
    return AddElementShadow({
      backgroundColor: propOr(Colors.white, "backgroundColor", props) as string,
    });
  }};
  elevation: 0;
`;

const FilterCheckbox = (props: FilterButton) => {
  const { activeColor = Colors.black, selected = false, useIconWithText = false, iconWithTextProps = {}, onPressHandler, label = "", addShadow = true, style = {} } = props;

  return (
    <CardContainer addShadow={addShadow} backgroundColor={Colors.white} onPress={() => {}} style={style}>
      <CheckBoxButton
        fieldName="checkboxfilter"
        fieldProps={{
          title: label,
          checked: selected,
          onPress: () => {
            onPressHandler();
          },
          textStyle: { width: "auto", fontSize: 17, fontFamily: "TTCommons-Regular", marginBottom: 3 },
        }}
        containerStyle={{
          paddingVertical: 0,
        }}
      />
    </CardContainer>
  );
};

export default FilterCheckbox;
