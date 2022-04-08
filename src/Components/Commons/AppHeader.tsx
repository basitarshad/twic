import * as React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { propOr } from "ramda";
import { Else, If, Then } from "react-if";

import Metrics from "Themes/Metrics";
import { AppScreenTitle, RowContainer, BackButton } from "Components/Commons";
import NavigationService from "Services/NavigationService";
import APP_CONSTANTS from "Constants/AppConstants";
import { SimpleHeaderBackHandler } from "./AppHeaderActions";

type HeaderContainerProps = {
  headerHeight?: number;
  paddingHorizontal?: number;
};
const HeaderContainer = styled(View)<HeaderContainerProps>`
  width: 100%;
  padding-horizontal: ${(props) => propOr(Metrics.screenHorizontalPadding, "paddingHorizontal")(props)};
  flex-direction: row;
  justify-content: center;
`;

const headerMaxHeight = APP_CONSTANTS.IS_ANDROID ? 55 : 60;
type AppHeaderProps = {
  title?: string;
  showSecondaryComponent?: boolean;
  paddingHorizontal?: number;
  SecondaryComponent?(): React.ReactNode;
  showTitleComponent?: boolean;
  TitleComponent?(): React.ReactNode;
  testId?: string;
  showBackButton?: boolean;
  containerStyle?: Object;
  titleStyle?: object;
  headerHeight?: number;
};

const AppHeader = (props: AppHeaderProps) => {
  const { title, testId, containerStyle, paddingHorizontal = Metrics.screenHorizontalPadding, SecondaryComponent, TitleComponent, showBackButton = false, titleStyle = {}, headerHeight = headerMaxHeight } = props;
  return (
    <HeaderContainer headerHeight={headerHeight} paddingHorizontal={paddingHorizontal} style={{ ...containerStyle }}>
      <RowContainer flex={1} alignItems="flex-start">
        <If condition={showBackButton}>
          <SimpleHeaderBackHandler containerProps={{ marginLeft: 0, marginRight: Metrics.baseMargin }} />
        </If>
        <If condition={Boolean(title)}>
          <Then>
            <AppScreenTitle paddingTop={3} ellipsizeMode="tail" numberOfLines={1} width={"auto"} testID={testId} accessibilityLabel={testId} style={{ ...titleStyle }}>
              {title}
            </AppScreenTitle>
          </Then>
          <Else>{TitleComponent && TitleComponent()}</Else>
        </If>
      </RowContainer>
      {SecondaryComponent && SecondaryComponent()}
    </HeaderContainer>
  );
};

export default AppHeader;
