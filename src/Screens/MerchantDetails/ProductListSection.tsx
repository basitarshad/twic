import * as React from "react";
import { View, ScrollView, FlatList } from "react-native";
import { If, Then, Else } from "react-if";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AppHeading, AppText, ListItemSeparator } from "../../Components";
import { Metrics, Colors, Fonts } from "../../Themes";
import { getPriceString, isEmptyOrNil } from "../../Utils";
import { ProductCardContainer, ProductCardContent, ProductCardContentContainer, ProductListingContainer } from "./StyledComponents";

const ProductSelectionCheck = (props) => {
  const { isSelected } = props;
  const circleBackground = {
    height: 20,
    width: 20,
    borderRadius: 50,
    backgroundColor: isSelected ? Colors.black : Colors.lightGrey,
  };

  return (
    <View
      style={{
        ...circleBackground,
        ...(isSelected
          ? {
              borderWidth: 1.5,
              borderColor: Colors.white,
              justifyContent: "center",
              alignItems: "center",
            }
          : {}),
      }}
    >
      <If condition={isSelected}>
        <Icon name="check" size={Fonts.size.small} style={{ color: Colors.white, fontWeight: "bold" }} />
      </If>
    </View>
  );
};

const ProductCard = (props) => {
  const { product, onProductSelect, isSelected } = props;

  const backgroundColor = isSelected ? Colors.black : Colors.white;
  const textColor = isSelected ? Colors.white : Colors.black;
  const priceTextColor = isSelected ? Colors.white : Colors.blue;
  const textDecorationLineColor = isSelected ? Colors.white : Colors.darkGrey;
  const isOneTimeProductColor = isSelected ? Colors.white : Colors.blue;

  const { title, displayAsAmount, priceUnit, specialPrice, msrp, productId } = product;
  const currentPrice = getPriceString({ price: specialPrice, unit: priceUnit, displayAsAmount });
  const originalPrice = () => (
    <AppText fontSize={Fonts.size.small} color={textDecorationLineColor} textDecorationLine="line-through">
      {getPriceString({ price: msrp, unit: priceUnit, displayAsAmount })}
    </AppText>
  );
  const perMonth = () =>
    !product.isOneTimeProduct ? (
      <AppHeading fontSize={Fonts.size.small} color={isOneTimeProductColor}>
        /mo
      </AppHeading>
    ) : null;
  const isVendorSoothe = product.vendorId === "soothe";

  return (
    <ProductCardContainer backgroundColor={backgroundColor} onPress={() => onProductSelect(productId)}>
      <ProductCardContentContainer>
        <ProductCardContent width="25%" alignItems="center">
          <ProductSelectionCheck isSelected={isSelected} />
        </ProductCardContent>

        <ProductCardContent width="75%">
          <AppHeading style={{ paddingTop: 2 }} fontSize={Fonts.size.small} width={140} ellipsizeMode="tail" numberOfLines={1} color={textColor}>
            {title}
          </AppHeading>
          <If condition={isVendorSoothe}>
            <Then>
              <AppHeading fontSize={Fonts.size.small} color={priceTextColor}>
                From {currentPrice} {perMonth()}
              </AppHeading>
            </Then>
            <Else>
              <AppHeading fontSize={Fonts.size.small} color={priceTextColor}>
                <If condition={msrp === specialPrice}>
                  <Then>
                    {currentPrice} {perMonth()}
                  </Then>
                  <Else>
                    {originalPrice()} {currentPrice} {perMonth()}
                  </Else>
                </If>
              </AppHeading>
            </Else>
          </If>
        </ProductCardContent>
      </ProductCardContentContainer>
    </ProductCardContainer>
  );
};

type ProductListSection = {
  onProductSelect(id: string): void;
  productsList: Array<any>;
  selectedProductId: string;
};
const ProductListSection = (props: ProductListSection) => {
  const { productsList, selectedProductId, onProductSelect } = props;
  return (
    <View>
      <If condition={!isEmptyOrNil(productsList)}>
        <Then>
          <AppHeading style={{ paddingHorizontal: Metrics.newScreenHorizontalPadding }}>Available Plans</AppHeading>
          <ProductListingContainer>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => ListItemSeparator({ width: 10 })}
              data={productsList}
              renderItem={({ item }) => <ProductCard isSelected={selectedProductId == item.productId} selectedProductId={selectedProductId} product={item} onProductSelect={onProductSelect} />}
              keyExtractor={(item) => item.productId}
            />
          </ProductListingContainer>
        </Then>
      </If>
    </View>
  );
};

export default ProductListSection;
