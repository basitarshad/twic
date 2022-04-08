import * as React from "react";
import styled from "styled-components/native";
import { Image, View } from "react-native";
import { If, Then, Else } from "react-if";

import { Colors, Images, Metrics } from "../../Themes";
import { LockSvgIcon } from "../SvgIcons";
import { formatCardNumberWithFourLettersSpacing } from "../../Utils";
import { AppText } from "./AppStyledComponents";

const TwicCardContainer = styled.ImageBackground`
  width: ${Metrics.screenWidth - Metrics.newScreenHorizontalPadding * 2};
  margin-vertical: ${Metrics.baseMargin};
  height: ${Metrics.screenWidth / 1.75};
  justify-content: center;
`;

const LockedTwicCardContainer = styled.View`
  width: ${Metrics.screenWidth - Metrics.newScreenHorizontalPadding * 2};
  margin-vertical: ${Metrics.baseMargin};
  height: ${Metrics.screenWidth / 1.75};
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: ${Colors.disabledTwicCard};
  border-radius: ${Metrics.baseMargin + 4};
`;

type CardInfoType = {
  name: string;
  expMonth: number;
  expYear: number;
  cvv: string;
  cardNumber: string;
  cardType?: string;
  status?: string;
  TwicCardContainerCustomStyle?: object;
};

const INACTIVE_STATUS = "inactive";
const cardNumberFontSize = (Metrics.screenWidth - 120) / 11;
const TwicCardStyled = (props: CardInfoType) => {
  const { name, expMonth, expYear, cvv, cardNumber, cardType = "virtual", status = "active", TwicCardContainerCustomStyle = {} } = props;
  const formatedCardNumber = formatCardNumberWithFourLettersSpacing(cardNumber);
  return (
    <If condition={cardType === "virtual"}>
      <Then>
        <TwicCardContainer
          imageStyle={{
            borderRadius: 10,
            resizeMode: "contain",
          }}
          source={Images.virtualTwicCardWithoutLogo}
          style={TwicCardContainerCustomStyle}
        >
          <View style={{ marginHorizontal: Metrics.screenHorizontalPadding, justifyContent: "space-between" }}>
            <AppText color={Colors.white} size={cardNumberFontSize} fontWeight={"300"} style={{ alignSelf: "center", height: "50%", lineHeight: 110, fontSize: 24 }}>
              {formatedCardNumber}
            </AppText>
            <View style={{ paddingTop: 10, paddingBottom: 5 }}>
              <View>
                <AppText color={Colors.white} fontWeight={500} fontSize={20} paddingBottom={5}>
                  {name}
                </AppText>
              </View>
              <View style={{ flexDirection: "row", width: "50%" }}>
                <AppText color={Colors.white} fontWeight={500}>
                  EXP&nbsp;&nbsp;
                </AppText>
                <AppText color={Colors.white} fontWeight={300}>
                  {expMonth}/{expYear}&nbsp;&nbsp;&nbsp;&nbsp;
                </AppText>
                <AppText color={Colors.white} fontWeight={500}>
                  CVV&nbsp;&nbsp;
                </AppText>
                <AppText color={Colors.white} fontWeight={300}>
                  {cvv}
                </AppText>
              </View>
            </View>
            <Image source={Images.virtualTwicCardLogo} style={{ width: 32, height: 32, position: "absolute", right: 0, bottom: 7, resizeMode: "contain" }} />
          </View>
          <If condition={status === INACTIVE_STATUS}>
            <LockedTwicCardContainer style={TwicCardContainerCustomStyle}>
              <LockSvgIcon />
            </LockedTwicCardContainer>
          </If>
        </TwicCardContainer>
      </Then>
      <Else>
        <TwicCardContainer
          imageStyle={{
            borderRadius: 10,
            resizeMode: "contain",
          }}
          source={Images.physicalTwicCard}
          style={TwicCardContainerCustomStyle}
        >
          <If condition={status === INACTIVE_STATUS}>
            <LockedTwicCardContainer style={TwicCardContainerCustomStyle}>
              <LockSvgIcon />
            </LockedTwicCardContainer>
          </If>
        </TwicCardContainer>
      </Else>
    </If>
  );
};
export default TwicCardStyled;
