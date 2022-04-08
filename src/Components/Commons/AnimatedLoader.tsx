import * as React from "react";
import styled from "styled-components/native";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import * as Animatable from "react-native-animatable";
import { Fonts, Colors, Metrics } from "../../Themes";
import { View } from "react-native";

const LoaderIcon = styled(EvilIcon)`
  font-size: 30;
  color: ${Colors.primary};
  font-weight: bold;
  text-align: center;
`;
type AnimatedLoader = {
  customStyle?: object;
};
const AnimatedLoader = (props: AnimatedLoader) => {
  const { customStyle = {} } = props;
  return (
    <View
      style={{
        width: Metrics.screenWidth,
        alignContent: "center",
        ...customStyle,
      }}
    >
      <Animatable.View iterationCount={"infinite"} animation="rotate">
        <LoaderIcon name="spinner-3" />
      </Animatable.View>
    </View>
  );
};

export default AnimatedLoader;
