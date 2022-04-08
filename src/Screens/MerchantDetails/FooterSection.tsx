import * as React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { If, Then, Else } from "react-if";
import { equals } from "ramda";
import { useDispatch } from "react-redux";
import { PrimaryButton } from "twic_mobile_components";

import { AppText, AppHeading } from "../../Components";
import { Metrics, Colors, ApplicationStyles, Fonts } from "../../Themes";
import { getPriceString } from "../../Utils";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";
import { APP_CONSTANTS } from "../../Constants";
import { AmplitudeAnalytics } from "../../AppAnalytics";
import transactions from "../../Services/transactions";

const FooterMainContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: ${Metrics.newScreenHorizontalPadding};
  padding-right: ${Metrics.newScreenHorizontalPadding - 2.5};
  padding-top: ${APP_CONSTANTS.IS_ANDROID ? Metrics.baseMargin - 1 : Metrics.baseMargin - 1};
  padding-bottom: ${APP_CONSTANTS.IS_ANDROID ? 0 : 0};
  border-top-width: 0.5;
  border-color: ${Colors.lightGrey};
  background-color: ${Colors.white};
`;

const FooterSection = (props) => {
  const { product } = props;
  const { specialPrice, msrp, isOneTimeProduct, priceUnit, displayAsAmount, productId, vendorTitle } = product;
  const productCategories = transactions.getProductCategories(product);
  const isPriceEqual = !equals(specialPrice, msrp);
  const msrpText = () => (
    <AppText color={Colors.darkGrey} textDecorationLine="line-through">
      {getPriceString({ price: msrp, unit: priceUnit, displayAsAmount })}
    </AppText>
  );
  const perMonthText = () => (!isOneTimeProduct ? <AppHeading color={Colors.blue}>/mo</AppHeading> : null);
  const isVendorSoothe = product.vendorId === "soothe";
  const dispatch = useDispatch();
  const navigateToCheckoutScreen = (product) => {
    dispatch(
      AmplitudeAnalytics.productCheckoutStarted({
        price: product.specialPrice || "",
        product_id: productId || "",
        name: vendorTitle || "",
        categories: productCategories,
        vendor_id: product.vendorId || "",
      }),
    );
    NavigationService.navigate(APP_ROUTES.CHECKOUT_MERCHANT, { product });
  };
  return (
    <FooterMainContainer>
      <View style={{ ...ApplicationStyles.container }}>
        <If condition={isVendorSoothe}>
          <Then>
            <AppText fontSize={Fonts.size.medium} fontWeight="bold" color={Colors.blue}>
              From {getPriceString({ price: specialPrice, unit: priceUnit, displayAsAmount })}
            </AppText>
          </Then>
          <Else>
            <AppHeading fontSize={Fonts.size.regular} color={Colors.blue}>
              {isPriceEqual && msrpText()} {getPriceString({ price: specialPrice, unit: priceUnit, displayAsAmount })} {perMonthText()}
            </AppHeading>
          </Else>
        </If>
      </View>

      <View style={{ ...ApplicationStyles.container, alignItems: "flex-end" }}>
        <PrimaryButton
          fullWidth={false}
          width={Math.round(Metrics.screenWidth / 2.5)}
          buttonLabel="Buy Now"
          buttonColor={Colors.newPrimary}
          onClickHandler={() => navigateToCheckoutScreen(product)}
          shadowOptions={{
            width: "0%",
          }}
          testId="checkout-button"
        />
      </View>
    </FooterMainContainer>
  );
};

export default FooterSection;
