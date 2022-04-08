import * as React from "react";
import { Avatar } from "react-native-elements";
import { If } from "react-if";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native";

import { AppHeader, RowContainer } from "Components/Commons";
import { Fonts, Metrics } from "Themes";
import NavigationService from "Services/NavigationService";

import { APP_ROUTES } from "../../../Navigation";
import { MarketplaceHeaderSection } from "./types";

const RenderHeaderActions = (props: MarketplaceHeaderSection) => {
  const { userProfile, showAvatar = false, RenderCustomComponent = () => <></> } = props;
  const { userInfo } = userProfile;
  const { avatarUrl = null, initials } = userInfo;

  return (
    <RowContainer flex={1} justifyContent="flex-end">
      <If condition={Boolean(RenderCustomComponent)}>{RenderCustomComponent()}</If>
      <If condition={showAvatar}>
        <TouchableOpacity onPress={() => NavigationService.navigate(APP_ROUTES.USER_PROFILE)} style={{ padding: Metrics.baseMargin }}>
          <Avatar size="small" rounded title={initials} source={{ uri: avatarUrl }} />
        </TouchableOpacity>
      </If>
    </RowContainer>
  );
};

const MarketplaceHeaderSectionComp = (props: MarketplaceHeaderSection) => {
  const { title } = props;
  return <AppHeader headerHeight={50} paddingHorizontal={0} titleStyle={{ fontSize: Fonts.size.h1 + 6 }} title={title} testId="merchant-screen-header" SecondaryComponent={() => RenderHeaderActions(props)} showSecondaryComponent />;
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};

export const MarketplaceHeader = connect(mapStateToProps)(MarketplaceHeaderSectionComp);
