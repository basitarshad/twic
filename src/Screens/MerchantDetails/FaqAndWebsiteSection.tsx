import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { If } from "react-if";

import { Metrics, Images } from "../../Themes";
import { AppHeading, IconWithBadge } from "../../Components";
import { APP_ROUTES } from "../../Navigation";
import { NavigationService } from "../../Services";
import { isEmptyOrNil } from "../../Utils";
import { FaqContentContainer } from "./StyledComponents";

const FaqAndWebsiteSection = (props) => {
  const { title, faqs, websiteUrl } = props;
  return (
    <View
      style={{
        paddingBottom: Metrics.doubleBaseMargin,
        paddingTop: Metrics.doubleBaseMargin + 5,
      }}
    >
      <If condition={!isEmptyOrNil(faqs)}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => NavigationService.navigate(APP_ROUTES.FAQS, { faqs, title })}>
          <FaqContentContainer>
            <IconWithBadge
              useCustomIcon
              iconStyle={{
                marginRight: Metrics.smallMargin,
              }}
              customIconSource={Images.faqIcon}
              iconSize="small"
            />
            <AppHeading paddingTop={1}>FAQ</AppHeading>
          </FaqContentContainer>
        </TouchableOpacity>
      </If>

      <TouchableOpacity activeOpacity={0.8} onPress={() => NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: websiteUrl })}>
        <FaqContentContainer>
          <IconWithBadge
            useCustomIcon
            iconStyle={{
              marginRight: Metrics.smallMargin,
            }}
            customIconSource={Images.globeIcon}
            iconSize="small"
          />
          <AppHeading paddingTop={1}>{title} Website</AppHeading>
        </FaqContentContainer>
      </TouchableOpacity>
    </View>
  );
};

export default FaqAndWebsiteSection;
