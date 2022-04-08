import * as React from "react";
import { FlatList, View } from "react-native";
import { openExternalLink } from "Utils";
import { AppHeading, AppScreenTitle, IconWithText, RenderHtml, ScreenContainer } from "../../Components";
import { APP_CONSTANTS } from "../../Constants";
import { APP_ROUTES } from "../../Navigation";
import { NavigationService } from "../../Services";
import { Fonts, Images, Metrics } from "../../Themes";
import { isEmptyOrNil } from "../../Utils";
import { FaqScreenContainer } from "./StyledComponents";

const onLinkPress = (evt, href, htmlAttribs) => {
  NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: href });
};

const Faqs = (props) => {
  const { faq } = props;
  return (
    <FaqScreenContainer>
      <AppHeading fontSize={Fonts.size.regular}>{faq.q}</AppHeading>
      <RenderHtml
        containerStyle={{
          paddingTop: Metrics.baseMargin,
        }}
        onLinkPress={onLinkPress}
        html={faq.a}
        tagsStyles={{
          p: {
            marginVertical: 5,
            padding: 0,
            fontSize: Fonts.size.medium,
            lineHeight: 20,
          },
          rawtext: {
            fontSize: Fonts.size.medium,
            lineHeight: 20,
          },
        }}
      />
    </FaqScreenContainer>
  );
};

const FaqsScreen = (props) => {
  const { route } = props;

  const faqs = route.params.faqs || [];
  const title = route.params.title || "";
  const formatTitle = !isEmptyOrNil(title) ? ` - ${title}` : "";

  return (
    <ScreenContainer paddingLeft={Metrics.newScreenHorizontalPadding} paddingRight={Metrics.newScreenHorizontalPadding}>
      <View style={{ paddingVertical: Metrics.baseMargin }}>
        <AppScreenTitle>FAQ{formatTitle}</AppScreenTitle>
      </View>

      <FlatList
        data={faqs}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <Faqs faq={item} key={index} />}
        ListFooterComponent={() => (
          <IconWithText
            containerStyles={{ paddingBottom: Metrics.doubleBaseMargin }}
            textStyle={{
              fontFamily: "TTCommons-DemiBold",
              bottom: 2,
              fontSize: Fonts.size.regular,
              fontWeight: APP_CONSTANTS.IS_ANDROID ? "400" : "bold",
              paddingTop: Metrics.smallMargin,
            }}
            iconStyle={{
              marginHorizontal: 0,
              marginRight: Metrics.baseMargin,
            }}
            iconSize={"small"}
            icon={Images.formaIcon}
            useCustomIcon
            onLinkPress={() => openExternalLink(`mailto:${APP_CONSTANTS.APP_SUPPORT_EMAIL}`)}
            text="Contact Forma Support"
          />
        )}
      />
    </ScreenContainer>
  );
};

export default FaqsScreen;
