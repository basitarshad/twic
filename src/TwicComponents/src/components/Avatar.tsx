import * as React from 'react';
import { Animated, Image, ImageStyle, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { AppText } from './AppText';

const getRoundedBorderRadius = (width: number, height: number): number => {
  if (width >= height) {
    return width / 2;
  }
  return height / 2;
};

const OverlayFadeInView = ({ roundedStyles, children, overlayContainerStyles, hideOverlay }: any) => {
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (hideOverlay) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, hideOverlay]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        styles.overlayContainer,
        roundedStyles,
        overlayContainerStyles,
      ]}
    >
      {children}
    </Animated.View>
  );
};

type AvatarProps = {
  iconComponent?: () => React.ReactElement<{}>;
  width: number;
  height: number;
  title?: string;
  source: { uri?: string };
  titleStyles?: TextStyle;
  imageStyles?: StyleProp<ImageStyle>;
  rounded?: boolean;
  overlayContainerStyles?: ViewStyle;
  containerStyles?: ViewStyle;
};

export const Avatar: React.FC<AvatarProps> = ({ iconComponent, width, height, title, titleStyles, source, imageStyles, rounded = false, overlayContainerStyles, containerStyles }) => {
  const [hideOverlay, setHideOverlay] = React.useState(false);
  const roundedStyles = rounded ? { borderRadius: getRoundedBorderRadius(width, height) } : {};
  const imageSize = { width, height };
  return (
    <View style={[{ position: 'relative' }, roundedStyles, containerStyles, imageSize]}>
      <Image onLoad={() => setHideOverlay(true)} source={source} style={[imageStyles, roundedStyles, imageSize]} />
      <OverlayFadeInView hideOverlay={hideOverlay} roundedStyles={roundedStyles} overlayContainerStyles={overlayContainerStyles}>
        {(title && <AppText style={[styles.titleStyles, titleStyles]}>{title}</AppText>) || (iconComponent && iconComponent())}
      </OverlayFadeInView>
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyles: {
    color: '#ffffff',
    fontSize: 30,
  },
  overlayContainer: { backgroundColor: '#bdbdbd', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' },
});
