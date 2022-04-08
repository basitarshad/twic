import { AppHeading, AppText, RenderHtml } from "Components";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { APP_CONSTANTS } from "Constants";
import { pathOr } from "ramda";
import * as React from "react";
import { Image, Platform, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { useSelector } from "react-redux";
import { getAccountColor, getAccountImage } from "Screens/Accounts/metadata";
import { Colors, Fonts, Images, Metrics } from "Themes";
import { PrimaryButton } from "twic_mobile_components";
import { getPriceString, ignoreCaseSensitivityAndReplaceWord, isEmptyOrNil } from "Utils";
import { APP_ROUTES } from "../../Navigation";
import { NavigationService } from "../../Services";
import { BaseCarousel, Header, MainLayout, useNextScreen } from "./Common";

const PosttaxListingScreen = () => {
  const carouselRef = React.useRef<typeof Carousel>(null);
  const wallets = useSelector((state) => pathOr([], ["userProfile", "userInfo", "wallets"], state));
  const companyName = useSelector((state) => pathOr("", ["userProfile", "companyInfo", "name"], state));
  const userCountry = useSelector((state) => pathOr([], ["userProfile", "userInfo", "country"], state));
  const [carouselLastItemVisible, setCarouselLastItemVisible] = React.useState(wallets.length === 1);
  const { openNextScreen } = useNextScreen({ activeScreen: "PosttaxListingScreen" });

  const renderItem = ({ item, index }) => {
    const { name, description, renewedAmount, walletTypeId, renewFrequency, nextCreditDate, stipendConfigMaxAmount } = item;
    const formatTitle = ignoreCaseSensitivityAndReplaceWord(name, " wallet", "");

    const accountIcon = getAccountImage.get(walletTypeId) || Images.commuter;
    const borderColor = getAccountColor.get(walletTypeId) || Images.commuter;

    const onLinkPress = (evt, href, htmlAttribs) => {
      NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: href });
    };

    const HtmlStyles = {
      b: {
        marginVertical: 7,
        fontFamily: "TTCommons-DemiBold",
        fontWeight: Platform.OS === "android" ? "900" : "bold",
        color: Colors.black,
        fontSize: Fonts.size.small,
      },
      a: {
        marginVertical: 5,
        padding: 0,
        fontFamily: "TTCommons-Regular",
        textAlign: "justify",
        color: Colors.linkColor,
        textDecorationLine: "none",
        fontSize: Fonts.size.medium,
      },
    };

    return (
      <View key={index} style={{ width: "95%", height: "auto", borderLeftColor: borderColor, borderLeftWidth: 4, paddingVertical: 15, paddingHorizontal: 20 }}>
        <Image source={accountIcon} style={{ height: 72, resizeMode: "contain", width: 72 }} />
        <AppHeading marginTop={30} fontSize={19}>
          {formatTitle}
        </AppHeading>
        {description ? (
          <View style={{ flexDirection: "row", flex: 1 }}>
            <RenderHtml
              containerStyle={{
                paddingTop: Metrics.baseMargin,
              }}
              onLinkPress={onLinkPress}
              html={description}
              tagsStyles={HtmlStyles}
            />
          </View>
        ) : null}
        <AppHeading fontSize={15} paddingTop={20} paddingBottom={15}>
          What You Get
        </AppHeading>
        <View style={{ height: 90, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <AppText marginTop={10}>{getPriceString({ price: renewedAmount, country: userCountry })}</AppText>
            <AppText marginTop={10} color={Colors.charcoalLightGrey}>
              {renewFrequency === "never" ? "one time" : renewFrequency}
            </AppText>
          </View>
          {!isEmptyOrNil(stipendConfigMaxAmount) ? (
            <View style={{ flex: 1 }}>
              <AppText marginTop={10}>{getPriceString({ price: stipendConfigMaxAmount, country: userCountry })}</AppText>
              <AppText marginTop={10} color={Colors.charcoalLightGrey}>
                max balance
              </AppText>
            </View>
          ) : null}
        </View>
        {!isEmptyOrNil(nextCreditDate) ? (
          <View style={{ height: 90, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <AppText marginTop={10}>{nextCreditDate}</AppText>
              <AppText marginTop={10} color={Colors.charcoalLightGrey}>
                start date
              </AppText>
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  const ContinueButton = React.useMemo(() => {
    return (
      <PrimaryButton
        width={APP_CONSTANTS.MUI_BTN_WIDTH}
        buttonColor={Colors.newBlue}
        onClickHandler={openNextScreen}
        buttonLabel="Continue"
        shadowOptions={{
          height: 0,
        }}
      />
    );
  }, []);

  return (
    <>
      <Header activeScreen="PosttaxListingScreen" hideSkipButton={carouselLastItemVisible} />
      <ScreenWrapper newDesignSystem scrollViewProps={{ contentContainerStyle: { flexGrow: 1 }, showsVerticalScrollIndicator: false }}>
        <View style={{ marginTop: 10, display: "flex", height: "100%" }}>
          <MainLayout
            title={`${companyName} is offering you great benefits on Forma.`}
            description="Here’s a quick summary of your benefits."
            progressPercentage={"25%"}
            buttonStyle={{ marginTop: 20 }}
            nextBtnHandler={() => {
              carouselRef.current?.snapToNext();
            }}
            bottomButton={carouselLastItemVisible ? () => ContinueButton : undefined}
          >
            <BaseCarousel
              data={wallets}
              renderItem={renderItem}
              onItemChange={(key) => {
                if (carouselRef.current?.currentIndex === wallets.length - 1) setCarouselLastItemVisible(true);
                else setCarouselLastItemVisible(false);
              }}
              setRef={(ref) => (carouselRef.current = ref)}
            />
          </MainLayout>
        </View>
      </ScreenWrapper>
    </>
  );
};

export default PosttaxListingScreen;
