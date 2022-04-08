import * as React from "react";
import { If } from "react-if";
import { View } from "react-native";
import styled from "styled-components";

import { AppHeading, AppText } from "Components";
import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import Fonts from "Themes/Fonts";

export const NewSectionListHeaderContainer = styled(View)`
  background-color: ${Colors.dimGrey};
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
  padding-vertical: ${Metrics.baseMargin};
`;

export const SectionListHeader = (props) => {
  const { title, showHeader } = props;
  return (
    <If condition={showHeader}>
      <NewSectionListHeaderContainer>
        <AppHeading paddingTop={0} fontSize={Fonts.size.small}>
          {title}
        </AppHeading>
      </NewSectionListHeaderContainer>
    </If>
  );
};
export const NewSectionListHeader = (props) => {
  const { title, showHeader } = props;
  return (
    <If condition={showHeader}>
      <NewSectionListHeaderContainer>
        <AppText paddingTop={0} fontSize={Fonts.size.small} color={Colors.newCharcoalDarkGrey}>
          {title}
        </AppText>
      </NewSectionListHeaderContainer>
    </If>
  );
};
