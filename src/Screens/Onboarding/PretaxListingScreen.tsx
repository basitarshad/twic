import { AppHeading, AppText } from "Components";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { APP_CONSTANTS } from "Constants";
import { format } from "date-fns";
import { pathOr } from "ramda";
import * as React from "react";
import { Image, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { useSelector } from "react-redux";
import { getAccountColor, getAccountImage } from "Screens/Accounts/metadata";
import { Colors, Images } from "Themes";
import { PrimaryButton } from "twic_mobile_components";
import { getPriceString, ignoreCaseSensitivityAndReplaceWord } from "Utils";
import { BaseCarousel, Header, MainLayout, useNextScreen } from "./Common";
import { PretaxRenderItem } from "./Styles";

const getDescription = (accountType) => {
  switch (true) {
    case ["FSA", "LFS", "DCFSA", "LFS", "FSA", "LPF", "LPFSA"].includes(accountType):
      return "A tax-advantaged account to help you pay for eligible medical, dental and vision expenses outside of your insurance plan.";
    case ["WCS", "HSA"].includes(accountType):
      return "A pretax health savings account to help you pay for qualified medical expenses.";
    default:
      return "";
  }
};
const PretaxListingScreen = () => {
  const carouselRef = React.useRef<typeof Carousel>(null);
  const userPreTaxAccounts = useSelector((state) => pathOr([], ["userProfile", "userPreTaxAccounts"], state));
  const userCountry = useSelector((state) => pathOr([], ["userProfile", "userInfo", "country"], state));
  const [carouselLastItemVisible, setCarouselLastItemVisible] = React.useState(userPreTaxAccounts.length === 1);
  const { openNextScreen } = useNextScreen({ activeScreen: "PretaxListingScreen" });

  const renderItem = ({ item, index }) => {
    const { name, accountType, annualElection, accountTypeClassCode, walletTypeId, planStartDate, planEndDate } = item;
    const formatTitle = ignoreCaseSensitivityAndReplaceWord(name, " wallet", "");

    const selectedAccountProperty = walletTypeId || accountTypeClassCode;
    const accountIcon = getAccountImage.get(selectedAccountProperty) || Images.commuter;
    const borderColor = getAccountColor.get(selectedAccountProperty) || Images.commuter;
    return (
      <PretaxRenderItem key={index} style={{ borderLeftColor: borderColor }}>
        <Image source={accountIcon} style={{ height: 72, resizeMode: "contain", width: 72 }} />
        <AppHeading marginTop={30} fontSize={19}>
          {formatTitle}
        </AppHeading>
        <AppText marginTop={10} color={Colors.charcoalLightGrey}>
          {getDescription(accountType)}
        </AppText>
        <AppHeading fontSize={16} paddingTop={20}>
          Your Election & Plan Information
        </AppHeading>
        <View style={{ height: 65, marginTop: 15, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <AppText marginTop={10}>{getPriceString({ price: annualElection, country: userCountry })}</AppText>
            <AppText marginTop={5} color={Colors.charcoalLightGrey}>
              annual election
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText marginTop={10}>{planStartDate}</AppText>
            <AppText marginTop={5} color={Colors.charcoalLightGrey}>
              effective date
            </AppText>
          </View>
        </View>
        <View>
          <AppText marginTop={10}>{format(new Date(planEndDate), "yyyy") === "2999" ? "Never" : planEndDate}</AppText>
          <AppText marginTop={5} color={Colors.charcoalLightGrey}>
            expires
          </AppText>
        </View>
      </PretaxRenderItem>
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
      <Header activeScreen="PretaxListingScreen" hideSkipButton={carouselLastItemVisible} />
      <ScreenWrapper newDesignSystem scrollViewProps={{ contentContainerStyle: { flexGrow: 1 }, showsVerticalScrollIndicator: false }}>
        <View style={{ marginTop: 10, display: "flex", height: "100%" }}>
          <MainLayout
            title="You’re enrolled in pre-tax savings benefits."
            description="Here are the benefits you elected during open enrollment."
            progressPercentage={"50%"}
            buttonStyle={{ marginTop: 40 }}
            nextBtnHandler={() => {
              carouselRef.current?.snapToNext();
            }}
            bottomButton={carouselLastItemVisible ? () => ContinueButton : undefined}
          >
            <BaseCarousel
              data={userPreTaxAccounts}
              renderItem={renderItem}
              onItemChange={(key) => {
                if (carouselRef.current?.currentIndex === userPreTaxAccounts.length - 1) setCarouselLastItemVisible(true);
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

export default PretaxListingScreen;
