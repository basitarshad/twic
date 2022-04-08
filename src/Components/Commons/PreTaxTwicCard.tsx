import * as React from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";

import { Colors, Metrics, Images } from "../../Themes";
import { AppText, RowContainer } from ".";
import { TwicCardStyle } from "./AppStyledComponents";

// It is styled with props other wise it give error, styled-component
// has some issues with import from index.ts file
const CardText = styled((props) => <AppText {...props} />)`
  color: ${Colors.white};
  font-weight: bold;
  font-size: 16;

  letter-spacing: 2;
  text-transform: uppercase;
`;

const RenderCardUnit = (props) => {
  const { label, value, style = {}, labelStyle = {} } = props;
  return (
    <View style={style}>
      <CardText style={{ marginBottom: Metrics.smallMargin, ...labelStyle }}>{label}</CardText>
      <CardText>{value}</CardText>
    </View>
  );
};

type TwicCardType = {
  cardInfo: {
    firstName: string;
    lastName: string;
    cardLast4: string;
  };
  style?: any;
};

const PreTaxTwicCard = (props: TwicCardType) => {
  const {
    cardInfo: { firstName, lastName, cardLast4 },
    style = {},
  } = props;
  const { containerMarginTop = 0, cardHeight = 225, cardWidth = "100%" } = style;
  const fullName = `${firstName} ${lastName}`;
  return (
    <TwicCardStyle containerMarginTop={containerMarginTop} cardHeight={cardHeight} cardWidth={cardWidth} testID={fullName} accessibilityLabel={fullName} source={Images.virtualTwicCard}>
      <RowContainer justifyContent="space-between">
        <RenderCardUnit label={fullName} value={`**** **** **** ${cardLast4}`} style={{ marginTop: Metrics.doubleBaseMargin }} labelStyle={{ fontSize: 18 }} />
      </RowContainer>
      <RowContainer justifyContent="space-between">
        <RenderCardUnit label="Exp. Date" value="****" />
        <RenderCardUnit label="CVC" value="***" />
        <View style={{ position: "relative", height: 50, width: 100 }} />
      </RowContainer>
    </TwicCardStyle>
  );
};

export default PreTaxTwicCard;
