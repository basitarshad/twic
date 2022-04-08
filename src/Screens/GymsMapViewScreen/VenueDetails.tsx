import * as React from "react";
import { View } from "react-native";
import { find, propEq, pathOr, head } from "ramda";
import { If } from "react-if";
import { connect } from "react-redux";

import { Metrics, Colors, Fonts } from "../../Themes";
import { isEmptyOrNil, getPriceString } from "../../Utils";
import { AppText, AppHeading, CachedImageBackground } from "../../Components/Commons";
import { useMapViewContext } from "./MapViewContext";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";
import { getVendorById } from "../../Actions";
import { VenueDetailsMarkerCardContainer, VenueDetailsCardSectionContainer } from "./StyledComponents";
import { VenueDetailsCardType } from "./types";

export const getHeight = () => {
  const height = Metrics.screenHeight / 5.2;
  return height > 100 ? 100 : height;
};

const findProductInMembershipTier = ({ membershipTier = "", productList = [] }) => {
  const product = find(propEq("title", membershipTier), productList);
  return isEmptyOrNil(product) ? head(productList) : product;
};

const mapDispatchToProps = (dispatch) => {
  return {
    getVendorById: (params) => dispatch(getVendorById(params)),
  };
};

export const VenueDetailsCard = connect(
  null,
  mapDispatchToProps,
)((props: VenueDetailsCardType) => {
  const { userProfile, venueDetails, customAction, getVendorById = () => {} } = props;
  const { stipendConfig } = userProfile || {};
  const userCountry = pathOr("us", ["userInfo", "country"], userProfile);
  const { title: venueTitle = "", activities, image_urls = [], membership_tier = "", vendor } = venueDetails || {};
  let imageUri = head(image_urls);

  const { product_list = [], title: vendorTitle = "", id: vendorId, image_url: vendorLogoUrl = "" } = vendor;
  // product in the membership tier
  const { special_price = "", id: productId } = findProductInMembershipTier({
    membershipTier: membership_tier,
    productList: product_list,
  });

  imageUri = isEmptyOrNil(imageUri) ? vendorLogoUrl : imageUri;

  return (
    <VenueDetailsMarkerCardContainer
      onPress={async () => {
        const vendor = await getVendorById({ id: vendorId });
        if (!isEmptyOrNil(vendor)) {
          NavigationService.navigate(APP_ROUTES.MERCHANT_DETAILS, {
            vendor,
            vendorId,
            productId,
            isVendor: true,
          });
        }
        customAction && customAction();
      }}
    >
      {/* image section */}
      <View style={{ width: "30%" }}>
        <If condition={!isEmptyOrNil(imageUri)}>
          <CachedImageBackground
            imageStyle={{
              borderTopLeftRadius: 10,
              // borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,
              // borderBottomRightRadius: 10
            }}
            source={{ uri: imageUri }}
            style={{
              height: "100%",
            }}
          />
        </If>
      </View>
      {/* vendor description */}
      <View
        style={{
          width: "70%",
          paddingVertical: Metrics.baseMargin,
          paddingHorizontal: Metrics.baseMargin,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {/* venue title */}
        <AppHeading fontSize={Fonts.size.small} paddingTop={0} ellipsizeMode="tail" numberOfLines={1}>
          {venueTitle}
        </AppHeading>
        {/* pricing */}
        <AppHeading fontSize={Fonts.size.small} paddingTop={0} color={Colors.green}>
          From {getPriceString({ price: special_price, country: userCountry, displayAsAmount: stipendConfig.displayAsAmount })}
          /mo
        </AppHeading>
        {/* venodr title */}
        <AppText ellipsizeMode="tail" numberOfLines={1} fontSize={Fonts.size.small}>
          By {vendorTitle}
        </AppText>
        {/* categories */}
        <AppText ellipsizeMode="tail" numberOfLines={1} fontSize={Fonts.size.small} textTransform="capitalize">
          {isEmptyOrNil(activities) ? "-" : activities.join(" . ").replace(/\_/g, " ")}
        </AppText>
      </View>
    </VenueDetailsMarkerCardContainer>
  );
});

export const VenueListingsCard = connect(
  null,
  mapDispatchToProps,
)((props: VenueDetailsCardType) => {
  const { userProfile, venueDetails, customAction, getVendorById } = props;
  const { stipendConfig } = userProfile || {};
  const userCountry = pathOr("us", ["userInfo", "country"], userProfile);

  const { title: venueTitle = "", activities, image_urls = [], membership_tier = "", vendor } = venueDetails || {};
  let imageUri = head(image_urls);

  const { product_list = [], title: vendorTitle = "", id: vendorId, image_url: vendorLogoUrl = "" } = vendor;
  // product in the membership tier
  const { special_price = "", id: productId } = findProductInMembershipTier({
    membershipTier: membership_tier,
    productList: product_list,
  });

  imageUri = isEmptyOrNil(imageUri) ? vendorLogoUrl : imageUri;

  return (
    <VenueDetailsMarkerCardContainer
      style={{
        width: Metrics.screenWidth / 2.35,
        height: "auto",
        flexDirection: "column",
      }}
      onPress={async () => {
        //@ts-ignore
        const vendor = await getVendorById({ id: vendorId });
        if (!isEmptyOrNil(vendor)) {
          NavigationService.navigate(APP_ROUTES.MERCHANT_DETAILS, {
            vendor,
            vendorId,
            productId,
            isVendor: true,
          });
        }
        customAction && customAction();
      }}
    >
      {/* image section */}
      <View style={{ height: 90 }}>
        <If condition={!isEmptyOrNil(imageUri)}>
          <CachedImageBackground
            imageStyle={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            source={{ uri: imageUri }}
            style={{
              height: 90,
            }}
          />
        </If>
      </View>

      {/* vendor description */}
      <View
        style={{
          paddingHorizontal: Metrics.baseMargin,
          paddingTop: Metrics.smallMargin,
          paddingBottom: Metrics.baseMargin,
          justifyContent: "center",
        }}
      >
        {/* venue title */}
        <AppHeading fontSize={Fonts.size.small} paddingTop={0} ellipsizeMode="tail" numberOfLines={1}>
          {venueTitle}
        </AppHeading>
        {/* pricing */}
        <AppHeading fontSize={Fonts.size.small} paddingTop={0} color={Colors.green}>
          From {getPriceString({ price: special_price, country: userCountry, displayAsAmount: stipendConfig.displayAsAmount })}
          /mo
        </AppHeading>
        {/* venodr title */}
        <AppText ellipsizeMode="tail" numberOfLines={1} fontSize={Fonts.size.small}>
          By {vendorTitle}
        </AppText>
        {/* categories */}
        <AppText ellipsizeMode="tail" numberOfLines={1} fontSize={Fonts.size.small} textTransform="capitalize" width="auto">
          {isEmptyOrNil(activities) ? "-" : activities.join(" . ").replace(/\_/g, " ")}
        </AppText>
      </View>
    </VenueDetailsMarkerCardContainer>
  );
});

const SelectedMapMarkerCardContent = (props) => {
  const { userProfile = {} } = props;
  const { state } = useMapViewContext();
  const { selectedMapMarker = {}, vendorVenuesList = [], isSelectedMapMarkerVisible = true } = state || {};

  const venueId = pathOr("", ["properties", "id"], selectedMapMarker);
  const venueDetails = find(propEq("id", venueId), vendorVenuesList) as any;
  if (isEmptyOrNil(venueDetails)) return null;

  return (
    <If condition={isSelectedMapMarkerVisible}>
      <VenueDetailsCardSectionContainer>
        <VenueDetailsCard userProfile={userProfile} venueDetails={venueDetails} />
      </VenueDetailsCardSectionContainer>
    </If>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};

export const SelectedMapMarkerCard = connect(mapStateToProps)(SelectedMapMarkerCardContent);
