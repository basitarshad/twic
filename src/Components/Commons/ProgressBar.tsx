import * as React from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";
import { Colors } from "Themes";
const { useRef, useEffect, useState, useCallback } = React;

const defaultColors = { mainView: Colors.blue, topBar: "#538bef", bottomBar: "#cadcfb" };
const ProgressBarMainView = styled.View`
  height: 35px;
  width: 100%;
  position: relative;
  background-color: ${({ bgColor }) => bgColor};
`;
const BottomProgressBarUI = styled(Animated.View)`
  height: 100%;
  background-color: ${({ bgColor }) => bgColor};
`;
const TopProgressBarUI = styled(Animated.View)`
  height: 100%;
  background-color: ${({ bgColor }) => bgColor};
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
`;

const useAnimatedProgress = (progress: number) => {
  let animation = useRef(new Animated.Value(0));

  const setProgressAnimateWidth = useCallback((val: number) => {
    Animated.timing(animation.current, {
      toValue: val,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    setProgressAnimateWidth(progress);
  }, [progress]);

  return animation;
};

type ProgressBarProps = {
  progressBottom: number;
  progressTop: number;
  colors?: typeof defaultColors;
  upperLimit?: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progressBottom = 0, progressTop = 0, colors = defaultColors, upperLimit = 100 }) => {
  let animationBottom = useAnimatedProgress(progressBottom);
  let animationTop = useAnimatedProgress(progressTop);

  const width = animationBottom.current.interpolate({
    inputRange: [0, upperLimit],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });
  const widthTop = animationTop.current.interpolate({
    inputRange: [0, upperLimit],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });
  const { mainView, topBar, bottomBar } = colors;
  return (
    <>
      <ProgressBarMainView bgColor={mainView}>
        <BottomProgressBarUI style={{ width }} bgColor={bottomBar} />
        <TopProgressBarUI style={{ width: widthTop }} bgColor={topBar} />
      </ProgressBarMainView>
    </>
  );
};
