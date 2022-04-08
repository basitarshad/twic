import * as React from "react";
import { View, ScrollView, Image } from "react-native";
import useAxios from "axios-hooks";
import { pathOr } from "ramda";
import { If } from "react-if";
import { SecondaryButton } from "twic_mobile_components";

import { AppHeading, AppText, RenderHtml, AppNotification, AppAlert, ScreenContainer } from "Components";
import { Metrics, Fonts, Images, Colors } from "Themes";
import { NavigationService, APP_ENDPOINTS } from "Services";
import { APP_ROUTES } from "../../../Navigation";
import { isEmptyOrNil } from "Utils";
import { APP_CONSTANTS } from "Constants";
import { CancelSvgIcon, CloseSvgIcon } from "Components/SvgIcons";

const onLinkPress = (href) => {
  NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: href });
};

const CancelSubscriptionAlertOptions = ({ successHandler }) => ({
  title: `Confirm Cancellation`,
  message: `Do you want to cancel your subscription?`,
  alertActions: [
    {
      text: "Cancel",
      style: "cancel",
      onPress: () => console.log("cancelled"),
    },
    {
      text: "Yes",
      onPress: () => successHandler(),
    },
  ],
});

const SubscriptionCancellationScreen = (props) => {
  const { route } = props;
  const data = route.params?.details || {};
  const cancellationRefund = route.params?.cancellationRefund || "";
  const isCheckout = route.params?.checkout || false;
  const { title = "", id } = data;
  const [cancelSubscriptionResponse, executeCancelSubscription] = useAxios({ url: APP_ENDPOINTS.CANCEL_SUBSCRIPTION(id), method: "PUT" }, { manual: true });
  const callBackToUpdatePreviousScreen = () => {
    const newData = { ...data, status: "pending_cancel" };
    NavigationService.goBackToFirstScreenOfStack(1);
    NavigationService.replaceScreen(APP_ROUTES.USER_SUBSCRIPTION_DETAIL_SCREEN, { params: { details: newData } });
  };

  // handler for the cancel subscription request
  const callCancelSubscriptionApi = React.useCallback(() => {
    executeCancelSubscription();
  }, []);

  // effect to handle the request to cancel subscription
  React.useEffect(() => {
    const { data, error, loading } = cancelSubscriptionResponse;
    if (!loading) {
      if (error) return;

      if (!isEmptyOrNil(data)) {
        const { data: resp } = data;
        const id = pathOr("", ["subscription", "id"], resp);
        if (!isEmptyOrNil(id)) {
          AppNotification.toggleSuccessNotification({
            message: "Success",
            description: "Cancellation request successful!",
          });
          if (!isCheckout) {
            NavigationService.goBackToFirstScreenOfStack(2);
            NavigationService.replaceScreen(APP_ROUTES.USER_SUBSCRIPTIONS);
          } else {
            callBackToUpdatePreviousScreen();
          }
        } else {
          AppNotification.toggleErrorNotification({
            message: "Error",
            description: "Something went wrong. Please try again.",
          });
        }
      }
    }
  }, [cancelSubscriptionResponse]);

  return (
    <ScreenContainer paddingBottom={Metrics.doubleBaseMargin} paddingLeft={Metrics.newScreenHorizontalPadding} paddingRight={Metrics.newScreenHorizontalPadding}>
      <View style={{ paddingVertical: Metrics.baseMargin }}>
        <AppHeading fontSize={Fonts.size.h1} textTransform="capitalize">
          Cancellation Policy
        </AppHeading>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Metrics.doubleBaseMargin }}>
        <AppText paddingTop={Metrics.baseMargin}>for {title}</AppText>
        <If condition={!isEmptyOrNil(cancellationRefund)}>
          <View style={{ paddingTop: Metrics.doubleBaseMargin }}>
            <RenderHtml onLinkPress={(e, href, htmlAttribs) => onLinkPress(href)} html={cancellationRefund} />
          </View>
        </If>
        <View
          style={{
            marginTop: Metrics.doubleBaseMargin * 2,
            padding: APP_CONSTANTS.IS_ANDROID ? 1.5 : 0,
          }}
        >
          <SecondaryButton
            onClickHandler={() =>
              AppAlert(
                CancelSubscriptionAlertOptions({
                  successHandler: callCancelSubscriptionApi,
                }),
              )
            }
            buttonLabel="Cancel Membership"
            width={APP_CONSTANTS.MUI_BTN_WIDTH}
            customIcon={() => <CancelSvgIcon fillColor={Colors.newBlue} />}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default SubscriptionCancellationScreen;
