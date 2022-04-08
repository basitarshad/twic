import { Animated, Easing } from 'react-native';

const fromLeft = (index, position, layout) => {
  const { initWidth } = layout;

  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [-initWidth, 0, 0],
  });

  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index],
    outputRange: [0, 1, 1],
  });

  return { opacity, transform: [{ translateX }] };
}

const fromRight = (index, position, layout) => {
  const { initWidth } = layout;

  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [initWidth, 0, 0],
  });

  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index],
    outputRange: [0, 1, 1],
  });

  return { opacity, transform: [{ translateX }] };
}

const fromTop = (index, position, layout) => {
  const { initHeight } = layout;

  const translateY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [-initHeight, 0, 0],
  });

  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index],
    outputRange: [0, 1, 1],
  });

  return { opacity, transform: [{ translateY }] };
}

const fromBottom = (index, position, layout) => {
  const { initHeight } = layout;

  const translateY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [initHeight, 0, 0],
  });

  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index],
    outputRange: [0, 1, 1],
  });

  return { opacity, transform: [{ translateY }] };
}

const fadeIn = (index, position) => {
  const opacity = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [0, 1],
  });

  return { opacity };
}

const zoomIn = (index, position) => {
  const scale = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [0, 1],
  });

  return { transform: [{ scale }] };
}

const zoomOut = (index, position) => {
  const scale = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [10, 1],
  });

  return { transform: [{ scale }] };
}

const flipY = (index, position) => {
  const rotateY = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: ['180deg', '0deg'],
  });

  return { transform: [{ rotateY }], backfaceVisibility: 'hidden' };
}

const flipX = (index, position) => {
  const rotateX = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: ['180deg', '0deg'],
  });
  return { transform: [{ rotateX }], backfaceVisibility: 'hidden' };
}

const opacity = (index, position) =>
  position.interpolate({
    inputRange: [index - 1, index - 0.5, index],
    outputRange: [0, 1, 1],
  });

const scale = (index, position) =>
  position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 1],
  });

const scaleWithOpacity = (index, position) => ({
  opacity: opacity(index, position),
  transform: [
    { scaleX: scale(index, position) },
    { scaleY: scale(index, position) },
  ],
});

const scaleYWithOpacity = (index, position) => ({
  opacity: opacity(index, position),
  transform: [{ scaleY: scale(index, position) }],
});

const scaleXWithOpacity = (index, position) => ({
  opacity: opacity(index, position),
  transform: [{ scaleX: scale(index, position) }],
});

export default () => {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index, route } = scene;
      const params = route.params || {};
      const transition = params.transition || 'default';
      return {
        default: fromRight(index, position, layout),
        flipX: flipX(index, position),
        flipY: flipY(index, position),
        zoomIn: zoomIn(index, position),
        zoomOut: zoomOut(index, position),
        fadeIn: fadeIn(index, position),
        fromLeft: fromLeft(index, position, layout),
        fromRight: fromRight(index, position, layout),
        fromTop: fromTop(index, position, layout),
        fromBottom: fromBottom(index, position, layout),
        scaleWithOpacity: scaleWithOpacity(index, position),
        scaleXWithOpacity: scaleXWithOpacity(index, position),
        scaleYWithOpacity: scaleYWithOpacity(index, position),
      }[transition];
    },
  };
};
