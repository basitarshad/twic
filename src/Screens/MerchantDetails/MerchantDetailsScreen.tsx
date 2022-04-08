import * as React from "react";
import { View, ScrollView } from "react-native";
import { Divider } from "react-native-elements";
import { connect } from "react-redux";
import { If } from "react-if";

import { AppText, AppHeading, AppFooter, RenderHtml, ScreenContainer } from "../../Components";
import { Metrics, Colors, Fonts } from "../../Themes";
import { MerchantDetailProps } from "../../types";
import { NavigationService, VendorsHelpers } from "../../Services";
import { APP_ROUTES } from "../../Navigation";
import { isEmptyOrNil } from "../../Utils";

import withNavigationReset from "../WithNavigationReset";
import { getVendorById } from "../../Actions";
import { APP_CONSTANTS } from "../../Constants";
import { AmplitudeAnalytics } from "../../AppAnalytics";
import transactions from "../../Services/transactions";
import ImageCarousel from "./ImageCarousel";
import ProductListSection from "./ProductListSection";
import AboutSection from "./AboutSection";
import FaqAndWebsiteSection from "./FaqAndWebsiteSection";
import FooterSection from "./FooterSection";

const FONT_WEIGHT = APP_CONSTANTS.IS_ANDROID ? "400" : "bold";
const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium;
const tagStyles = {
  ul: { paddingLeft: 0, paddingTop: Metrics.baseMargin },
  li: { display: "flex", marginTop: Metrics.smallMargin - 1 },
  b: {
    marginVertical: 7,
    fontFamily: "TTCommons-DemiBold",
    fontWeight: FONT_WEIGHT,
    color: Colors.black,
    fontSize: FONT_SIZE,
  },
};

const onLinkPress = (evt, href, htmlAttribs) => {
  NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: href });
};

const shadowOptions = {
  x: 0,
  y: APP_CONSTANTS.IS_ANDROID ? -10 : -12,
  opacity: APP_CONSTANTS.IS_ANDROID ? 0.1 : 0.5,
  shadowRadius: APP_CONSTANTS.IS_ANDROID ? Metrics.screenWidth * 1.2 : Metrics.screenWidth,
  color: Colors.darkGrey,
  width: Metrics.screenWidth,
  height: 60,
  zIndex: -1,
};

const MerchantDetailsScreen = (props) => {
  const { route, AnimatedHeaderEvent, saveLastScrollValue, userProfile, getVendorById, logEventToAmplitude } = props;

  const vendorId = route.params.vendorId || "";
  const productId = route.params.productId || "";
  const [state, setState] = React.useState({
    vendor: {},
    selectedProductId: "",
    product: {},
  });
  const { vendor, selectedProductId, product } = state;

  React.useEffect(() => {
    const getVendorDetails = async () => {
      const vendor = await getVendorById({ id: vendorId });
      const product = VendorsHelpers.getProductDetails({ vendor, productId: productId, userProfile });
      const productCategories = transactions.getProductCategories(product);
      // LOG EVENT FOR PRODUCT DETAIL PAGE
      logEventToAmplitude({ price: product.specialPrice || "", product_id: product.productId || "", name: product.vendorTitle || "", categories: productCategories, vendor_id: vendorId });
      setState({ ...state, vendor, product, selectedProductId: productId });
    };
    getVendorDetails();
  }, [vendorId]);

  const handleProductSelection = async (id) => {
    const product = VendorsHelpers.getProductDetails({ vendor, productId: id, userProfile });
    setState({ ...state, selectedProductId: id, product });
  };

  const { imageUrls, productTitle, isPricingPlanAvailable, specialTerms, vendorTitle, about, cancellationRefund, description, faqs, gettingStarted, productsList = [], websiteUrl } = product as MerchantDetailProps;

  if (isEmptyOrNil(vendor)) return <ScreenContainer />;

  return (
    <ScreenContainer>
      {/* Start of page content section */}
      <View style={{ paddingBottom: Metrics.screenHorizontalPadding * 2 }}>
        <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16} onMomentumScrollEnd={saveLastScrollValue} onScroll={AnimatedHeaderEvent}>
          {/* Image Slider Section  */}
          <ImageCarousel images={imageUrls} title={productTitle} />

          {/* Heading and product listing section (only for vendors) */}
          <View style={{ paddingVertical: Metrics.baseMargin }}>
            <View
              style={{
                paddingHorizontal: Metrics.newScreenHorizontalPadding,
                paddingVertical: Metrics.baseMargin,
              }}
            >
              <AppHeading fontSize={Fonts.size.h1} testID={productTitle} accessibilityLabel={productTitle}>
                {productTitle}
              </AppHeading>
              <AppText fontSize={Fonts.size.small} paddingTop={Metrics.smallMargin} color={Colors.darkGrey}>
                by {vendorTitle}
              </AppText>
            </View>
            {/* product listing section (only for vendors) */}
            <If condition={isPricingPlanAvailable}>
              <ProductListSection onProductSelect={handleProductSelection} productsList={productsList} selectedProductId={selectedProductId} />
            </If>
          </View>

          {/* Main section after header and price plan  */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: Metrics.newScreenHorizontalPadding,
            }}
          >
            {/* Description section */}
            <If condition={!isEmptyOrNil(description)}>
              <View>
                <AppHeading>About this offer</AppHeading>
                <RenderHtml
                  onLinkPress={onLinkPress}
                  html={description}
                  tagsStyles={tagStyles}
                  classesStyles={{
                    "ant-typography-danger": { color: "red" },
                  }}
                />
              </View>
            </If>

            {/* Getting started section */}
            <If condition={!isEmptyOrNil(gettingStarted)}>
              <View style={{ marginBottom: Metrics.baseMargin }}>
                <AppHeading paddingTop={Metrics.doubleBaseMargin}>Getting Started</AppHeading>
                <View style={{ paddingTop: Metrics.baseMargin }}>
                  <RenderHtml onLinkPress={onLinkPress} html={gettingStarted} />
                </View>
              </View>
            </If>

            {/* Special terms section */}
            <If condition={!isEmptyOrNil(specialTerms)}>
              <View style={{ marginBottom: Metrics.baseMargin }}>
                <AppHeading paddingTop={Metrics.doubleBaseMargin}>Special Terms</AppHeading>
                <View style={{ paddingTop: Metrics.baseMargin }}>
                  <RenderHtml onLinkPress={onLinkPress} html={specialTerms} />
                </View>
              </View>
            </If>

            {/* Cancellation / Refund section */}
            <If condition={!isEmptyOrNil(cancellationRefund)}>
              <View>
                <AppHeading paddingTop={Metrics.doubleBaseMargin + 5}>Cancellation / Refund</AppHeading>
                <View style={{ paddingTop: Metrics.baseMargin }}>
                  <RenderHtml onLinkPress={onLinkPress} html={cancellationRefund} />
                </View>
              </View>
            </If>

            {/* About section */}
            <If condition={!isEmptyOrNil(about)}>
              <AboutSection about={about} title={vendorTitle} />
            </If>

            <Divider style={{ backgroundColor: Colors.lightGrey, height: 0.7 }} />

            {/* FAQ and Website section */}
            <FaqAndWebsiteSection title={vendorTitle} faqs={faqs} websiteUrl={websiteUrl} />
          </View>
        </ScrollView>
        {/* End of page content section */}
      </View>
      <View style={{ position: "absolute", bottom: 5 }}>
        {/* Page footer section */}
        <AppFooter applyShadow shadowOptions={shadowOptions}>
          <FooterSection product={product} />
        </AppFooter>
      </View>
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
    getVendorById: (params) => dispatch(getVendorById(params)),
    logEventToAmplitude: (params) => dispatch(AmplitudeAnalytics.productDetailView(params)),
  };
};

export default withNavigationReset(connect(mapStateToProps, mapDispatchToProps)(MerchantDetailsScreen));
