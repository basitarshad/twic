import * as React from 'react';
import { View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import styled from 'styled-components/native';

import { Colors, Fonts, Metrics } from '../../Themes';
import { AppTextExtraSmall, _Text } from './AppStyledComponents';
import { APP_ROUTES } from '../../Navigation';
import { NavigationService } from '../../Services';

const CarouselBadgeContainer = styled.View`
  background-color: ${Colors.white};
  border-radius: 10;
  position: absolute;
  top: 10;
  left: 10;
  padding-horizontal: 5;
  padding-vertical: 5;
`
const CarouselItemBadge = (props) => {
  const {
    badgeColor = 'primary',
    badgeLabel = 'New',
    badgeIcon = 'star'
  } = props

  return (
    <CarouselBadgeContainer>
      <AppTextExtraSmall color={badgeColor}>
        <Icon name={badgeIcon} style={{ fontSize: Fonts.size.extraSmall, color: Colors[badgeColor] }} />&nbsp;{badgeLabel}
      </AppTextExtraSmall>
    </CarouselBadgeContainer>
  )
}

// render component for the carousel section
const RenderCarouselParallaxImage = ({ item, index }, parallaxProps) => {
  return (
    <TouchableOpacity onPress={() => NavigationService.navigate(APP_ROUTES.CHALLENGE_DETAILS, { challengeId: item.id })}>
      <View
        key={index}
        style={{
          width: Metrics.screenWidth - 60,
          height: Metrics.screenWidth / 2 - 60,
        }}>
        <ParallaxImage
          source={{ uri: item.imageUrl }}
          containerStyle={CarouselStyleSheet.imageContainer}
          style={CarouselStyleSheet.image}
          parallaxFactor={0.4}
          spinnerColor={Colors.primary}
          {...parallaxProps}
        />
        <View style={CarouselStyleSheet.carouselTitleContainer}>
          <_Text
            style={CarouselStyleSheet.carouselTitle}
            numberOfLines={2}
          >
            {item.title}
          </_Text>

        </View>
        {/* <CarouselItemBadge /> */}
      </View>
    </TouchableOpacity>
  );
}

type CarouselSectionProps = {
  carouselList: Array<Object>,
  autoPlay?: boolean,
  firstItemIndex?: number,
  hasParallaxImages: boolean
}
const CarouselSection = (props: CarouselSectionProps) => {
  const {
    carouselList = [],
    autoPlay = false,
    firstItemIndex = 0,
    hasParallaxImages = true
  } = props

  return (
    <View style={{ flex: 1, paddingVertical: 10 }}>
      <Carousel
        sliderWidth={Metrics.screenWidth}
        autoplay={autoPlay}
        loop={true}
        firstItem={firstItemIndex}
        sliderHeight={Metrics.screenWidth / 2 - 60}
        itemWidth={Metrics.screenWidth - 60}
        data={carouselList}
        renderItem={RenderCarouselParallaxImage}
        hasParallaxImages={hasParallaxImages}
      />
    </View>
  )
}

// stylesheet for the carousel component
const CarouselStyleSheet = StyleSheet.create({
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover'
  },
  carouselTitleContainer: {
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    bottom: 0.1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  carouselTitle: {
    color: Colors.white,
    fontWeight: '700'
  }
});

export default CarouselSection;