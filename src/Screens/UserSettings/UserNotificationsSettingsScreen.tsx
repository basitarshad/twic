import * as React from "react";
import { FlatList } from "react-native";
import { reject } from "ramda";
import { connect } from "react-redux";
import styled from "styled-components/native";
import { Divider } from "react-native-elements";

import { AppText, AppScreenTitle, AppHeading, AppSwitchWithIcon, AppScreenTitleContainer } from "../../Components";
import { Metrics, Colors, Fonts } from "../../Themes";
import { RowContainer } from "../Checkout/StyledComponents";
import { updateUserNotificationSettings } from "../../Actions";
import { ScreenWrapper } from "../../Components/Commons/ScreenWrapper";

const NotificationsSettingsCardContainer = styled.View`
  padding-vertical: ${Metrics.doubleBaseMargin};
`;

const NotificationsSettingsCard = (props) => {
  const { setting, updateUserNotificationSettings } = props;
  const { type, description, channel, title } = setting;

  return (
    <NotificationsSettingsCardContainer>
      <AppHeading fontSize={Fonts.size.normal}>{title}</AppHeading>
      <AppText paddingBottom={Metrics.baseMargin} paddingTop={Metrics.baseMargin} fontSize={Fonts.size.regular - 1}>
        {description}
      </AppText>
      <FlatList
        data={channel}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <NotificationsSettingsChannelOptions updateUserNotificationSettings={updateUserNotificationSettings} key={index} item={item} type={type} />}
        keyExtractor={(item: any) => `${item.channel}`}
      />
    </NotificationsSettingsCardContainer>
  );
};

const getChannelTitle = new Map([
  ["push", "Push Notifications"],
  ["email", "E-mail"],
]);

const updateNotificationSettingsForSpecificChannel = ({ value, type, channel, updateUserNotificationSettings }) => {
  const payload = [
    {
      type: type,
      channels: [
        {
          channel: channel,
          value: value,
        },
      ],
    },
  ];
  updateUserNotificationSettings(payload);
};

const NotificationsSettingsChannelOptions = (props) => {
  const { item, type, updateUserNotificationSettings } = props;
  const { channel, value } = item;
  return (
    <RowContainer style={{ justifyContent: "space-between" }}>
      <AppText fontSize={Fonts.size.normal} style={{ marginBottom: Metrics.smallMargin }}>
        {getChannelTitle.get(channel)}
      </AppText>
      <AppSwitchWithIcon value={value} onValueChange={() => updateNotificationSettingsForSpecificChannel({ value: !value, type, channel, updateUserNotificationSettings })} />
    </RowContainer>
  );
};

const UserNotificationsSettingsScreen = (props) => {
  const { userProfile, updateUserNotificationSettings } = props;
  const { userNotificationSettings, companyInfo, userInfo } = userProfile;
  const isTwicCardEnabled = userInfo.country === "us" && (userInfo.stripeVirtualCardEnabled || companyInfo.stripeVirtualCardEnabled || companyInfo.stripePhysicalCardEnabled);
  const notificationSettingsList = reject((setting: any) => setting.type === "card" && !isTwicCardEnabled, userNotificationSettings);
  return (
    <ScreenWrapper newDesignSystem scrollView={false}>
      <FlatList
        ListHeaderComponent={() => (
          <AppScreenTitleContainer customStyle={{ paddingHorizontal: 0 }}>
            <AppScreenTitle>Notifications</AppScreenTitle>
          </AppScreenTitleContainer>
        )}
        data={notificationSettingsList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <>
              {index === 0 && <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />}
              <NotificationsSettingsCard updateUserNotificationSettings={updateUserNotificationSettings} key={index} setting={item} />
            </>
          );
        }}
        ItemSeparatorComponent={() => <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />}
        keyExtractor={(item: any) => `${item.type}`}
      />
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserNotificationSettings: (params) => dispatch(updateUserNotificationSettings(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserNotificationsSettingsScreen);
