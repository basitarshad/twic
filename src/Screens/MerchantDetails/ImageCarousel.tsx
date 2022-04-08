import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import Carousel from "react-native-snap-carousel";
import { If, Then, Else } from "react-if";

import { AppText } from "../../Components";
import { Colors, Fonts, Metrics } from "../../Themes";
import { useIsDeviceOrientationPortrait, isEmptyOrNil } from "../../Utils";
import { CarouselContainer, CarouselImage, CarouselImageContainer, CarouselPaginationContainer, CarouselPaginationDot } from "./StyledComponents";

const Pagination = (props) => {
  const { index = 0, total = 0, title = "" } = props;
  return (
    <If condition={total > 1}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CarouselPaginationContainer>
          <AppText textTransform="uppercase" fontSize={Fonts.size.extraSmall} paddingRight={5} fontWeight="bold" color={Colors.white}>
            {title.length > 25 ? `${title.substring(0, 25)}...` : title}
          </AppText>
          <If condition={total > 1}>
            <Then>
              {Array.from(Array(total), (e, i) => {
                return <CarouselPaginationDot key={i} active={i == index} />;
              })}
            </Then>
          </If>
        </CarouselPaginationContainer>
      </View>
    </If>
  );
};
const ImageCarousel = (props) => {
  const { images, title = "" } = props;
  const [isImageLoading, toggleImageLoading] = React.useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);
  const isPortrait = useIsDeviceOrientationPortrait();
  const renderItem = ({ item, index }) => {
    return (
      <CarouselImageContainer key={index}>
        <CarouselImage onLoadStart={() => toggleImageLoading(true)} onLoadEnd={() => toggleImageLoading(false)} resizeMode={!isPortrait ? "contain" : "stretch"} source={{ uri: item }} />
        <If condition={isImageLoading}>
          <ActivityIndicator
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 10,
              bottom: 0,
            }}
            color={Colors.primary}
            animating={isImageLoading}
          />
        </If>
      </CarouselImageContainer>
    );
  };
  return (
    <CarouselContainer>
      <If condition={!isEmptyOrNil(images)}>
        <Then>
          <Carousel pagingEnabled loop={true} autoplay={true} autoplayDelay={500} data={images} renderItem={renderItem} onSnapToItem={(index) => setActiveSlideIndex(index)} sliderWidth={Metrics.screenWidth} itemWidth={Metrics.screenWidth} />
          <Pagination index={activeSlideIndex} total={images.length} title={title} />
        </Then>
        <Else>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <AppText>No images to display.</AppText>
          </View>
        </Else>
      </If>
    </CarouselContainer>
  );
};
export default ImageCarousel;
