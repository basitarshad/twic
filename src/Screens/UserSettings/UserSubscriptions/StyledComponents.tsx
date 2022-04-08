import { has, propOr } from "ramda";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import { Colors, Metrics } from "../../../Themes";
import { SubscriptionCardSectionProps, SubscriptionTileRowProps } from "./types";

export const SubscriptionCardContainer = styled(TouchableOpacity)`
  border-radius: 5px;
  background-color: ${Colors.white};
  flex-direction: row;
  margin-vertical: ${Metrics.baseMargin};
  padding-vertical: ${Metrics.baseMargin + 5};
  padding-horizontal: ${Metrics.baseMargin + 5};
  border-width: 0.3;
  border-color: ${Colors.darkGrey};
`;

export const SubscriptionCardSection = styled(View)<SubscriptionCardSectionProps>`
  ${(props) => (has("flex", props) ? `flex: ${props.flex}` : "")};
  align-items: ${(props) => propOr("flex-start", "alignItems", props)};
  justify-content: ${(props) => propOr("flex-start", "justifyContent", props)};
  padding-top: ${(props) => propOr(0, "paddingTop", props)};
`;

export const SubscriptionTileRow = styled(View)<SubscriptionTileRowProps>`
  flex-direction: row;
  align-items: center;
  padding-top: ${(props) => propOr(0, "paddingTop", props)};
`;

export const SectionListHeaderContainer = styled(View)`
  background-color: ${Colors.grey};
  padding-horizontal: ${Metrics.screenHorizontalPadding};
  padding-vertical: ${Metrics.baseMargin - 2};
`;
