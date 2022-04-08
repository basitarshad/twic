import * as React from "react";
import { Image, View } from "react-native";
import { PrimaryButton } from "twic_mobile_components";
import Carousel from "react-native-snap-carousel";
import { AppText, AppHeading } from "Components";
import { NavigationService } from "Services";
import { Colors, Images } from "Themes";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { ThinStoreIconSvg } from "Components/SvgIcons";

import { APP_ROUTES } from "../../Navigation";
import { Header, MainLayout } from "./Common";
import { BaseCarousel } from "./Common";
import { useAccountsHook } from "Screens/Marketplace/useAccountsHook";
import { useTwicCards } from "./useTwicCards";
import { APP_CONSTANTS } from "Constants";

const TWIC_STORE = {
  title: "Forma Store",
  descriptions: ["No out-of-pocket spending necessary", "Save up to 50% off retail on purchases", "Manage your gym membership in Forma"],
  Icon: <ThinStoreIconSvg fillColor={Colors.newCharcoalDarkGrey} height={45} width={45} style={{ fontSize: 1 }} />,
};
const TWIC_CARDS = {
  title: "Forma Debit and Virtual Card",
  descriptions: ["Order your Forma debit card for FREE", "Virtual card available to use immediately", "Use your card for purchases in-store or online"],
  Icon: <Image source={Images.accountCard} style={{ height: 48, width: 48 }} />,
};
const TWIC_CLAIMS = {
  title: "Get Your Claims Reimbursed",
  descriptions: ["Easily file and submit claims", "Claims reviewed within 72 hours", "World-class customer support by Forma"],
  Icon: <Image source={Images.penPaperSvg} style={{ height: 48, width: 48 }} />,
};

type BenefitsType = Array<{ title: string; descriptions: string[]; Icon: JSX.Element }>;

const BenefitsScreen = () => {
  const [carouselLastItemVisible, setCarouselLastItemVisible] = React.useState(false);
  const carouselRef = React.useRef<typeof Carousel>(null);

  const { showMarketplace, isReimbursementEnabled } = useAccountsHook();
  const { hasAllowedPaymentWallets } = useTwicCards();

  const benefits = React.useMemo(() => {
    const userBenefits: BenefitsType = [];
    if (showMarketplace) userBenefits.push(TWIC_STORE);
    if (hasAllowedPaymentWallets) userBenefits.push(TWIC_CARDS);
    if (isReimbursementEnabled) userBenefits.push(TWIC_CLAIMS);
    return userBenefits;
  }, [showMarketplace, isReimbursementEnabled]);

  const renderItem = ({ item, index }) => {
    const { title, Icon, descriptions } = item;

    return (
      <View key={index} style={{ width: "95%", height: "auto", paddingHorizontal: 20, marginTop: 10, alignItems: "center" }}>
        <View style={{ height: 120, width: 120, backgroundColor: Colors.newLightGrey, borderRadius: 120 / 2, justifyContent: "center", alignItems: "center" }}>{Icon}</View>
        <AppHeading fontSize={21} style={{ marginTop: 20, textAlign: "center", marginBottom: 20 }}>
          {title}
        </AppHeading>
        {descriptions.map((item, key) => (
          <View style={{ minHeight: 35, flexDirection: "row", marginTop: 10, justifyContent: "flex-start", width: 280 }} key={key}>
            <Image source={Images.circledCheckmark} resizeMode="contain" style={{ height: 20, width: 20 }} />
            <AppText paddingLeft={8}>{item}</AppText>
          </View>
        ))}
      </View>
    );
  };

  const ContinueButton = React.useMemo(() => {
    return (
      <PrimaryButton
        width={APP_CONSTANTS.MUI_BTN_WIDTH}
        buttonColor={Colors.newBlue}
        onClickHandler={() => {
          NavigationService.navigate(APP_ROUTES.COMPLETE_PROFILE_SCREEN);
        }}
        buttonLabel="Continue"
        shadowOptions={{
          height: 0,
        }}
      />
    );
  }, []);

  return (
    <>
      <Header activeScreen="BenefitsScreen" hideSkipButton={carouselLastItemVisible || benefits.length === 1} />
      <ScreenWrapper newDesignSystem scrollViewProps={{ contentContainerStyle: { flexGrow: 1 }, showsVerticalScrollIndicator: false }}>
        <View style={{ marginTop: 10, display: "flex", height: "100%" }}>
          <MainLayout
            title="Use Forma to manage and spend your benefits."
            description="Your employer has enabled the following ways for you to be able to spend your benefits:"
            progressPercentage={"75%"}
            buttonStyle={{ marginTop: 20 }}
            nextBtnHandler={() => {
              carouselRef.current?.snapToNext();
            }}
            bottomButton={carouselLastItemVisible || benefits.length === 1 ? () => ContinueButton : undefined}
          >
            <BaseCarousel
              data={benefits}
              renderItem={renderItem}
              onItemChange={(key) => {
                if (carouselRef.current?.currentIndex === benefits.length - 1) setCarouselLastItemVisible(true);
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

export default BenefitsScreen;
