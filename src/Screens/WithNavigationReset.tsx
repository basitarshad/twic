import * as React from "react";
import { Animated } from "react-native";
import { propOr, pathOr } from "ramda";

import { useScrollContext } from "./ScrollContext";
import { isEmptyOrNil } from "../Utils";

let listener;
const withNavigationReset = (WrappedComponent) => (props) => {
  const { navigation } = props;
  const { state, dispatcher } = useScrollContext();
  const { scrollY: stateScrollY, lastScrolledValue = 0 } = state || {};

  const [scrollY = new Animated.Value(0), setScrollValue] = React.useState(stateScrollY);

  // add the required event listeners on mount of the screen
  React.useEffect(() => {
    // navigation.addListener('willBlur', () => {
    //   dispatcher({
    //     type: 'RESET_SCROLL_STATE'
    //   })
    //   setScrollValue(new Animated.Value(0))
    // })

    listener = navigation.addListener("focus", () => {
      if (!isEmptyOrNil(lastScrolledValue) && lastScrolledValue > 0) {
        scrollY.setValue(lastScrolledValue);
        dispatcher({
          type: "UPDATE_SCROLL_STATE",
          payload: {
            scrollY,
          },
        });
      }
    });
    return () => {
      dispatcher({
        type: "RESET_SCROLL_STATE",
      });
      setScrollValue(new Animated.Value(0));
      listener();
    };
  }, []);

  // update the context state when the scrollY is updated
  React.useEffect(() => {
    dispatcher({
      type: "UPDATE_SCROLL_STATE",
      payload: {
        scrollY: scrollY,
      },
    });
  }, [scrollY]);

  const AnimatedHeaderEvent = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }]);

  const saveLastScrollValue = (event) => {
    const lastScrolledValue = pathOr(0, ["nativeEvent", "contentOffset", "y"], event);
    dispatcher({
      type: "SET_LAST_SCROLL_STATE",
      lastScrolledValue,
    });
  };

  return <WrappedComponent {...props} AnimatedHeaderEvent={AnimatedHeaderEvent} saveLastScrollValue={saveLastScrollValue} />;
};

export default withNavigationReset;
