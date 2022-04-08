import * as React from "react";
import { View } from "react-native";
import styled from "styled-components";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { TouchableOpacity } from "react-native-gesture-handler";

import { AppScreenTitle, AppText } from "Components";
import { Metrics, Colors } from "Themes";
import { NavigationService } from "Services";
import { ArrowLeftSvgIcon } from "Components/SvgIcons";
import { useAccountsHook } from "Screens/Marketplace/useAccountsHook";

import { APP_ROUTES } from "../../Navigation";
import { useTwicCards } from "./useTwicCards";
import { ButtonLabel } from "./Styles";
import { APP_CONSTANTS } from "Constants";

export const CarouselContainer = styled(View)`
  margin-bottom: ${Metrics.doubleBaseMargin};
  margin-top: ${Metrics.doubleBaseMargin};
`;

export const ProgressBar = ({ width = "0%" }) => {
  return (
    <View style={{ backgroundColor: Colors.newLightGrey, width: "100%", height: 3, position: "relative", marginBottom: 20 }}>
      <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width, backgroundColor: Colors.newBlue }} />
    </View>
  );
};

export const MainLayout = (props) => {
  const { title = "", description = "", children, nextBtnHandler = () => {}, bottomButton, disabledNextButton = false, buttonStyle = {}, progressPercentage = "0%" } = props;

  return (
    <>
      <ProgressBar width={progressPercentage} />
      <View style={{ flex: 1 }}>
        <AppScreenTitle>{title}</AppScreenTitle>
        {description ? (
          <AppText color={Colors.charcoalLightGrey} marginTop={15}>
            {description}
          </AppText>
        ) : null}
        {children}
        <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 30 }}>
          {bottomButton ? (
            bottomButton()
          ) : (
            <TouchableOpacity disabled={disabledNextButton} onPress={nextBtnHandler}>
              <ButtonLabel buttonLabelColor={disabledNextButton ? Colors.infoColor : Colors.newBlue}>Next</ButtonLabel>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};
const getDotWidth = (itemsLength) => {
  switch (true) {
    case itemsLength >= 12:
      return 8;
    case itemsLength >= 8:
      return 12;
    case itemsLength >= 5:
      return 20;
    case itemsLength < 5:
    default:
      return 40;
  }
};

export const BaseCarousel = ({ setRef = () => {}, carouselProps = {}, data = [], renderItem, onItemChange = (key) => {}, paginationProps = {} }: any) => {
  const [index, setIndex] = React.useState(0);

  return (
    <CarouselContainer>
      <Carousel
        removeClippedSubviews={false}
        firstItem={0}
        initialScrollIndex={0}
        data={data}
        onSnapToItem={(key) => {
          setIndex(key);
          onItemChange(key);
        }}
        renderItem={renderItem}
        sliderWidth={Metrics.screenWidth - 60}
        itemWidth={Metrics.screenWidth - 60}
        layout="default"
        inactiveSlideScale={0.5}
        inactiveSlideOpacity={0.1}
        ref={setRef}
        pagingEnabled
        {...carouselProps}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={index}
        containerStyle={{ backgroundColor: "transparent", marginTop: 40, alignItems: "center", alignSelf: "center" }}
        dotStyle={{
          width: getDotWidth(data.length),
          height: 3,
          borderRadius: 5,
          backgroundColor: Colors.black,
        }}
        inactiveDotStyle={{
          backgroundColor: Colors.lightGrey,
          width: getDotWidth(data.length),
          height: 3,
          borderRadius: 5,
        }}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
        {...paginationProps}
      />
      {data.length === 1 ? <View style={{ marginTop: 40 }} /> : null}
    </CarouselContainer>
  );
};

const navigateToOnboardingScreen = (isPostTaxAccount, isPreTaxAccount, showBenefitsScreen) => {
  if (isPostTaxAccount) NavigationService.navigate(APP_ROUTES.POSTTAX_LISTING_SCREEN);
  else if (isPreTaxAccount) NavigationService.navigate(APP_ROUTES.PRETAX_LISTING_SCREEN);
  else if (showBenefitsScreen) NavigationService.navigate(APP_ROUTES.BENEFITS_SCREEN);
  else NavigationService.navigate(APP_ROUTES.COMPLETE_PROFILE_SCREEN);
};

export const useNextScreen = ({ activeScreen }) => {
  const { isPostTaxAccount, isPreTaxAccount, showMarketplace, isReimbursementEnabled } = useAccountsHook();
  const { hasAllowedPaymentWallets } = useTwicCards();
  const showBenefitsScreen = showMarketplace || hasAllowedPaymentWallets || isReimbursementEnabled;

  const openNextScreen = () => {
    switch (activeScreen) {
      case "OnboardingScreen":
        return navigateToOnboardingScreen(isPostTaxAccount, isPreTaxAccount, showBenefitsScreen);

      case "PosttaxListingScreen":
        return navigateToOnboardingScreen(false, isPreTaxAccount, showBenefitsScreen);

      case "PretaxListingScreen":
        return navigateToOnboardingScreen(false, false, showBenefitsScreen);

      default:
        return navigateToOnboardingScreen(false, false, false);
    }
  };
  return { openNextScreen };
};

export const Header = ({ activeScreen, hideSkipButton = false }) => {
  const { openNextScreen } = useNextScreen({ activeScreen });

  return (
    <View style={{ height: 44, width: "100%", paddingTop: APP_CONSTANTS.IS_ANDROID ? 5 : 0, backgroundColor: "white", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: Metrics.newScreenHorizontalPadding }}>
      <TouchableOpacity onPress={() => NavigationService.goBackToPreviousScreen()} style={{ height: 44, justifyContent: "center" }}>
        <ArrowLeftSvgIcon />
      </TouchableOpacity>
      {hideSkipButton ? null : (
        <TouchableOpacity onPress={openNextScreen} style={{ height: 44, paddingTop: 4, justifyContent: "center", marginLeft: 30 }}>
          <AppText color={Colors.newBlue} fontWeight="bold">
            Skip
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};
