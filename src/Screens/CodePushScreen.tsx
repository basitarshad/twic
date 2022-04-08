import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import styled from "styled-components/native";
import { AppHeading, ScreenContainer } from "../Components";
import { Colors, Fonts, Images, Metrics } from "../Themes";
import { toggleStatusBarTheme, useStatusBarTheme } from "../Hooks";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  waitingText: {
    color: Colors.newDarkGrey,
    paddingTop: Metrics.doubleBaseMargin * 2,
  },
  logo: {
    resizeMode: "contain",
    height: 140,
  },
});

const LoaderIcon = styled(EvilIcon)`
  font-size: ${Fonts.size.h1};
  color: ${Colors.newDarkGrey};
  font-weight: bold;
  text-align: center;
`;

const CodePushScreen = () => {
  React.useEffect(() => {
    setTimeout(() => {
      toggleStatusBarTheme("default");
    }, 100);
  }, []);

  return (
    <ScreenContainer style={{ backgroundColor: Colors.warmWhite }}>
      <View style={styles.mainContainer}>
        <Image source={Images.formaLogo} style={styles.logo} />
        <AppHeading style={styles.waitingText}>Please wait while the app is updating.</AppHeading>
        <View style={{ marginTop: Metrics.baseMargin }}>
          <Animatable.View iterationCount={"infinite"} animation="rotate">
            <LoaderIcon name="spinner-3" />
          </Animatable.View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default CodePushScreen;
