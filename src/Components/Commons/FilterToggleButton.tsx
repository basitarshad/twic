import * as React from "react";
import { If } from "react-if";
import styled from "styled-components/native";
import FontAwseomeIcon from "react-native-vector-icons/FontAwesome";

import { Colors, Fonts, Metrics } from "Themes/index";
import { isEmptyOrNil } from "Utils/index";
import { AppText, RoundedBadgeContainer } from "Components/Commons/index";

const FilterIcon = styled(FontAwseomeIcon)`
  font-size: ${Fonts.size.small};
  font-family: TTCommons-DemiBold;
  font-weight: bold;
  color: ${Colors.primaryText};
  margin-left: 5;
  margin-right: 5;
`;

type FilterToggleProps = {
  label: string;
  isActive: boolean;
  iconPlacement?: "left" | "right";
  iconName?: string;
  onPressHandler(): void;
  marginLeft?: number;
};
const FilterToggleButton = (props: FilterToggleProps) => {
  const { label, isActive = false, iconPlacement = "right", iconName = "caret-down", onPressHandler = () => {}, marginLeft = 0 } = props;

  const activeStyle = {
    color: isActive ? Colors.white : Colors.primaryText,
    fontFamily: "TTCommons-Regular",
  };

  return (
    <RoundedBadgeContainer
      marginLeft={marginLeft}
      onPress={onPressHandler}
      style={{
        backgroundColor: isActive ? Colors.black : Colors.white,
      }}
    >
      <If condition={!isEmptyOrNil(iconName) && iconPlacement == "left"}>
        <FilterIcon name={iconName} style={activeStyle} />
      </If>
      <AppText width="auto" style={{ ...activeStyle, marginRight: Metrics.smallMargin }} textTransform="capitalize">
        {label}
      </AppText>
      <If condition={!isEmptyOrNil(iconName) && iconPlacement == "right"}>
        <FilterIcon name={iconName} style={activeStyle} />
      </If>
    </RoundedBadgeContainer>
  );
};

export default FilterToggleButton;
