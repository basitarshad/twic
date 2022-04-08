import * as React from "react";
import { TouchableOpacity, View, Platform, ScrollView, RefreshControl } from "react-native";
import { pathOr } from "ramda";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components/native";
import { ListItem, Divider } from "react-native-elements";
import { If } from "react-if";

import { updateAppCurrentStack, toggleAppScreenLoader, fetchUserDependents } from "Actions";
import { AppSectionTitle, ScreenContainer } from "Components";
import { Metrics, Fonts, Colors } from "Themes";
import { isEmptyOrNil } from "Utils";

import generateSettingsList from "./SettingsList";
import { UserAvatar } from "./UserAvatar";

const UserProfileHeader = styled.View`
  align-items: flex-start;
  padding-vertical: ${Metrics.baseMargin};
`;

const RenderSettingOption = (props) => {
  const { item, userProfile = {} } = props;
  const { titleStyle = {}, onPress } = item;

  return (
    <ListItem
      Component={TouchableOpacity}
      containerStyle={{
        paddingHorizontal: Metrics.newScreenHorizontalPadding,
        borderColor: "transparent",
      }}
      {...item}
      titleStyle={{
        fontWeight: Platform.OS === "android" ? "600" : "bold",
        fontFamily: "TTCommons-DemiBold",
        fontSize: Fonts.size.medium,
        color: Colors.black,
        ...titleStyle,
      }}
      onPress={() => onPress({ ...userProfile })}
      testID={item.testId}
      accessibilityLabel={item.testId}
    />
  );
};

const RenderSectionTitle = (props) => {
  const { section } = props;

  return (
    <If condition={section.showHeader}>
      <>
        <View
          style={{
            paddingBottom: Metrics.baseMargin,
            paddingHorizontal: Metrics.newScreenHorizontalPadding,
            ...(!isEmptyOrNil(section.title) && {
              paddingTop: Metrics.doubleBaseMargin * 2,
              paddingBottom: Metrics.doubleBaseMargin,
            }),
          }}
        >
          <AppSectionTitle
            style={{
              color: Colors.secondaryText,
              fontSize: Fonts.size.small,
              textTransform: "uppercase",
              fontFamily: "TTCommons-DemiBold",
              letterSpacing: 1.5,
            }}
          >
            {section.title}
          </AppSectionTitle>
        </View>
        <If condition={!isEmptyOrNil(section.title)}>
          <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />
        </If>
      </>
    </If>
  );
};

const getAvailableSettingsOptions = (userProfile, updateAppCurrentStack) => {
  const { dependents, isCdhEnabled, isTwicCardAllowed } = userProfile;
  const userCountry = pathOr("us", ["userInfo", "country"], userProfile);
  const marketplaceEnabled: boolean = pathOr(false, ["companyInfo", "showMarketplace"], userProfile);
  const sso = pathOr({}, ["companyInfo", "sso"], userProfile);

  return generateSettingsList(dependents, isCdhEnabled, userCountry, isTwicCardAllowed, updateAppCurrentStack, marketplaceEnabled, sso);
};

const SettingsScreen = (props) => {
  const { userProfile, updateAppCurrentStack } = props;

  const settingsList = getAvailableSettingsOptions(userProfile, updateAppCurrentStack);
  const dispatch = useDispatch();

  const onRefresh = async () => {
    dispatch(toggleAppScreenLoader(true));
    await dispatch(fetchUserDependents());
    dispatch(toggleAppScreenLoader(false));
  };

  return (
    <ScreenContainer>
      <ScrollView style={{ backgroundColor: Colors.white }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
        {/* avatar container  */}
        <UserProfileHeader
          style={{
            paddingHorizontal: Metrics.newScreenHorizontalPadding,
            paddingBottom: Metrics.baseMargin,
          }}
        >
          <UserAvatar />
        </UserProfileHeader>

        {/* Sections for user Settings */}
        <Divider
          style={{
            backgroundColor: Colors.lightGrey,
            height: 1,
            marginTop: Metrics.doubleBaseMargin * 2,
          }}
        />
        <View style={{ marginBottom: 50 }}>
          {settingsList.map((section) => (
            <>
              <RenderSectionTitle section={section} />
              {section.data.map((item) => (
                <>
                  <RenderSettingOption item={item} userProfile={userProfile} />
                  <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />
                </>
              ))}
            </>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAppCurrentStack: (RouteName) => dispatch(updateAppCurrentStack(RouteName)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
