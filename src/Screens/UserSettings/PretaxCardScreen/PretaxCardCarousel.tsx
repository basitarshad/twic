import * as React from "react";
import { pathOr, propOr } from "ramda";
import { View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import styled from "styled-components/native";

import { PreTaxTwicCard } from "../../../Components";
import { Colors, Metrics } from "../../../Themes";
import { PreTaxCardContainer, CarouselContainer } from "./StyledComponents";
import { TwicCardCarouselType } from "./types";

const PretaxCardCarousel = (props: TwicCardCarouselType) => {
  const { cards, onCardSwipe, cardStyle = { carouselContainerHeight: 260 }, cardIndex, swiperRef } = props;
  const { carouselContainerHeight } = cardStyle;

  const _renderItem = ({ item, index }) => {
    return (
      <PreTaxCardContainer>
        <PreTaxTwicCard
          style={{
            cardWidth: "97%",
          }}
          cardInfo={{
            firstName: pathOr("", ["cardholder", "firstName"], item),
            lastName: pathOr("", ["cardholder", "lastName"], item),
            cardLast4: propOr("", "cardLast4", item),
          }}
        />
      </PreTaxCardContainer>
    );
  };
  return (
    <CarouselContainer carouselContainerHeight={carouselContainerHeight}>
      <View>
        <Carousel
          pagingEnabled
          ref={swiperRef}
          firstItem={cardIndex}
          initialScrollIndex={cardIndex}
          onSnapToItem={(index) => onCardSwipe(index)}
          data={cards}
          renderItem={_renderItem}
          sliderWidth={Metrics.screenWidth - 32}
          itemWidth={Metrics.screenWidth - 32}
        />
        <Pagination
          dotsLength={cards.length}
          activeDotIndex={cardIndex}
          containerStyle={{ backgroundColor: "transparent", marginTop: 0, position: "absolute", bottom: -50, alignItems: "center", alignSelf: "center" }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: Colors.black,
          }}
          inactiveDotStyle={{
            backgroundColor: Colors.lightGrey,
            width: 10,
            height: 10,
            borderRadius: 5,
          }}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
      </View>
    </CarouselContainer>
  );
};

export default PretaxCardCarousel;
