import * as React from "react";
import { equals, pathOr } from "ramda";
import { If } from "react-if";
import { useSelector } from "react-redux";

import { Metrics, Colors, Fonts, Images } from "../../../Themes";
import { AppHeading, IconWithText } from "../../../Components";
import { NavigationService } from "../../../Services";
import { APP_ROUTES } from "../../../Navigation";
import { getPriceString, getTransactionAndSubscriptionStatus } from "../../../Utils";
import { APP_CONSTANTS } from "../../../Constants";
import { SubscriptionCardContainer, SubscriptionCardSection, SubscriptionTileRow } from "./StyledComponents";
import { CancelSvgIcon } from "Components/SvgIcons";

const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium;

export const SubscriptionCard = (props) => {
  const { subscription } = props;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const { title = "", nextBillDate = "", amount = "", status = "" } = subscription;
  const statusEquals = equals(status);
  const isCancelled = statusEquals("cancelled");
  const isActive = statusEquals("active");
  const isPendingCancel = statusEquals("pending_cancel");
  const showIfActiveORCancelled = isActive || isCancelled;

  const subscriptionStatus = getTransactionAndSubscriptionStatus(false, status);
  const topMargin = isActive ? -3 : 0;

  const getSubscriptionDate = () => {
    if (showIfActiveORCancelled) {
      if (isCancelled) return `Cancelled ${nextBillDate}`;
      return nextBillDate;
    } else return `-`;
  };

  const cardTitleWidthDivider = isPendingCancel ? 3 : 2.3;
  return (
    <SubscriptionCardContainer onPress={() => NavigationService.navigate(APP_ROUTES.USER_SUBSCRIPTION_DETAIL_SCREEN, { params: { details: subscription } })}>
      <SubscriptionCardSection flex={1}>
        <SubscriptionTileRow>
          <SubscriptionCardSection flex={4}>
            <AppHeading paddingTop={0} width={Metrics.screenWidth / cardTitleWidthDivider} ellipsizeMode="tail" numberOfLines={1} fontSize={Fonts.size.regular}>
              {title}
            </AppHeading>
          </SubscriptionCardSection>
          <If condition={!isCancelled}>
            <SubscriptionCardSection flex={5} alignItems="flex-end">
              <IconWithText
                textStyle={{
                  fontFamily: "TTCommons-Regular",
                  bottom: 1,
                  fontSize: FONT_SIZE,
                  color: subscriptionStatus.color,
                }}
                icon={subscriptionStatus.icon}
                useCustomIcon
                isDisabled={true}
                iconSize="small"
                iconStyle={{ marginLeft: 0, marginTop: topMargin }}
                text={subscriptionStatus.name}
              />
            </SubscriptionCardSection>
          </If>
        </SubscriptionTileRow>

        <SubscriptionTileRow paddingTop={Metrics.baseMargin}>
          <SubscriptionCardSection flex={2.5}>
            <AppHeading textDecorationLine={isCancelled ? "line-through" : "none"} fontSize={Fonts.size.small} color={Colors.black}>
              {getPriceString({ price: amount, country: userCountry, displayAsAmount: true })}
            </AppHeading>
          </SubscriptionCardSection>
          <If condition={showIfActiveORCancelled}>
            <SubscriptionCardSection paddingTop={2} alignItems="flex-end" flex={5.5}>
              <IconWithText
                textStyle={{
                  fontFamily: "TTCommons-Regular",
                  bottom: 1,
                  fontSize: FONT_SIZE,
                  color: Colors.black,
                }}
                icon={isCancelled ? Images.cancel : Images.recurring}
                isDisabled={true}
                useCustomIcon
                useSvgIcon={isCancelled}
                RenderSvgIcon={() => <CancelSvgIcon strokeWidth={2} fillColor={Colors.primary} />}
                iconStyle={{ marginLeft: 0, marginTop: 1 }}
                iconSize={isCancelled ? "extraTiny" : "small"}
                text={getSubscriptionDate()}
              />
            </SubscriptionCardSection>
          </If>
        </SubscriptionTileRow>
      </SubscriptionCardSection>
    </SubscriptionCardContainer>
  );
};
