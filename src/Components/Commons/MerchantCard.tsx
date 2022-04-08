import * as React from "react";
import { View } from "react-native";
import { If, Then, Else } from "react-if";
import { equals } from "ramda";
import styled from "styled-components/native";

import { Metrics, Colors, Fonts } from "../../Themes";
import { MerchantInfoProps } from "../../types";
import { isEmptyOrNil, getPriceString } from "../../Utils";
import { AppText, AppHeading } from "./AppStyledComponents";
import { NavigationService } from "../../Services";
import APP_ROUTES from "../../Navigation/AppRoutes";
import CachedImageBackground from "./CachedImageBackground";

const getProductPrice = (cardData: MerchantInfoProps) => {
  const { msrp, specialPrice, displayAsAmount, priceUnit } = cardData;

  const oldPrice = () => (
    <AppText color={Colors.secondaryText} fontWeight="300" textDecorationLine="line-through">
      {getPriceString({ price: msrp, unit: priceUnit, displayAsAmount })}
    </AppText>
  );
  return (
    <AppHeading paddingTop={5} color={Colors.green}>
      {oldPrice()} {getPriceString({ price: specialPrice, unit: priceUnit, displayAsAmount })}
    </AppHeading>
  );
};

const getVendorPrice = (cardData: MerchantInfoProps) => {
  const { priceLimitLower = 0, priceLimitUpper = 0, isOneTimeProduct, displayAsAmount, priceUnit } = cardData;

  const isPriceRangeAvailable = !equals(priceLimitLower, priceLimitUpper);
  const oldPrice = () => (
    <AppText color={Colors.secondaryText} fontWeight="300" textDecorationLine="line-through">
      {getPriceString({ price: priceLimitUpper, unit: priceUnit, displayAsAmount })}
    </AppText>
  );
  const perMonthText = () => (!isOneTimeProduct ? <AppHeading color={Colors.blue}>/mo</AppHeading> : null);
  return (
    <>
      <If condition={!isPriceRangeAvailable}>
        <AppText paddingTop={Metrics.smallMargin} width={Metrics.screenWidth / 2.5} fontWeight={"bold"} color={Colors.blue}>
          {getPriceString({ price: priceLimitLower, unit: priceUnit, displayAsAmount })} {perMonthText()}
        </AppText>
      </If>
      <If condition={isPriceRangeAvailable}>
        <AppHeading paddingTop={Metrics.smallMargin} width={Metrics.screenWidth / 2.5} color={Colors.blue}>
          {oldPrice()} {getPriceString({ price: priceLimitLower, unit: priceUnit, displayAsAmount })} {perMonthText()}
        </AppHeading>
      </If>
    </>
  );
};

const CardImage = (props) => {
  const { imageUri } = props;

  const imageBackgroundHeight = Metrics.screenWidth / 3.5;
  return (
    <View
      style={{
        height: imageBackgroundHeight,
        backgroundColor: Colors.dimGrey,
        borderRadius: 10,
      }}
    >
      <If condition={!isEmptyOrNil(imageUri)}>
        <CachedImageBackground
          imageStyle={{ borderRadius: 10 }}
          source={{ uri: imageUri }}
          style={{
            height: imageBackgroundHeight,
          }}
        />
      </If>
    </View>
  );
};

const MerchantCardContainer = styled.TouchableOpacity`
  border-radius: 10px;
  width: ${Metrics.screenWidth / 2.3};
  background-color: ${Colors.white};
`;

type MerchantCardProps = {
  cardData: MerchantInfoProps;
  showCategory?: boolean;
  style?: {
    marginVertical?: number;
    marginHorizontal?: number;
    marginLeft?: number;
    marginRight?: number;
    margin?: number;
    width?: number;
  };
};
const MerchantCard = (props: MerchantCardProps) => {
  const { cardData, style = {} } = props;
  const { title, subtitle, imageUri, isVendor = true, vendorId, productId } = cardData;
  const isVendorSoothe = cardData.vendorId === "soothe";

  return (
    <View testID={title} accessibilityLabel={title}>
      <MerchantCardContainer onPress={() => NavigationService.navigate(APP_ROUTES.MERCHANT_DETAILS, { vendorId, productId, isVendor })} style={style}>
        <CardImage imageUri={imageUri} />

        {/* Subtitle */}
        <If condition={!isEmptyOrNil(subtitle)}>
          <AppText paddingTop={Metrics.baseMargin} width={Metrics.screenWidth / 2.5} ellipsizeMode="tail" numberOfLines={1} color={Colors.secondaryText} fontSize={Fonts.size.small}>
            By {subtitle}
          </AppText>
        </If>

        <View style={{ paddingBottom: Metrics.baseMargin }}>
          <AppHeading width={Metrics.screenWidth / 2.5} ellipsizeMode="tail" numberOfLines={1}>
            {title}
          </AppHeading>

          {/* prices */}
          <If condition={isVendorSoothe}>
            <Then>
              <AppHeading paddingTop={Metrics.smallMargin} color={Colors.green}>
                From {getPriceString({ price: cardData.priceLimitLower, unit: cardData.priceUnit, displayAsAmount: cardData.displayAsAmount })}
              </AppHeading>
            </Then>
            <Else>
              <If condition={isVendor}>{getVendorPrice(cardData)}</If>
              <If condition={!isVendor}>{getProductPrice(cardData)}</If>
            </Else>
          </If>
        </View>
      </MerchantCardContainer>
    </View>
  );
};

export default MerchantCard;
