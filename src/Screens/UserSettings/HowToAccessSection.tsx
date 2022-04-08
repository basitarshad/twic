import { AppHeading, AppText, RenderHtml } from "Components";
import * as React from "react";
import { Else, If, Then } from "react-if";
import { Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";
import { Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components";
import { Colors, Fonts, Metrics } from "Themes";
import { openExternalLink } from "Utils";

export type HowToAccessSectionContentContainerProps = {
  alignItems: string;
  justifyContent?: string;
  flex?: number;
};

export const HowToAccessSectionContainer = styled(View)`
  flex-direction: row;
  padding-bottom: ${Metrics.smallMargin};
`;

export const SectionHeadingContentContainer = styled(View)<HowToAccessSectionContentContainerProps>`
  flex: ${(props) => (props.flex ? props.flex : 1)};
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : "flex-start")};
  align-items: ${(props) => props.alignItems};
`;

const fontStyle = {
  fontSize: Fonts.size.small,
  lineHeight: 18,
  fontFamily: "TTCommons-Regular",
  color: Colors.black,
};

const onLinkPress = (evt, href, htmlAttribs) => {
  openExternalLink(href);
};

const isHTML = (string) => /<[a-z/][\s\S]*>/i.test(string);

const RenderText = (props) => {
  const { instruction } = props;
  const containsHtml = isHTML(instruction);
  return (
    <If condition={containsHtml}>
      <Then>
        <RenderHtml containerStyle={{ paddingBottom: Metrics.baseMargin }} fontStyle={fontStyle} html={instruction} onLinkPress={onLinkPress} />
      </Then>
      <Else>
        <AppText paddingBottom={Metrics.smallMargin} paddingTop={Metrics.smallMargin} fontSize={Fonts.size.small}>
          <Text style={{ color: Colors.newPrimary }}>{"\u2022" + " "} </Text>
          {instruction}
        </AppText>
      </Else>
    </If>
  );
};

export const HowToAccessSection = (props) => {
  const { howToAccess } = props;
  const [isCollapsed, setCollapsed] = React.useState(true);
  return (
    <View>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setCollapsed(!isCollapsed)}>
        <HowToAccessSectionContainer>
          <SectionHeadingContentContainer flex={2} alignItems="flex-start">
            <AppHeading paddingTop={Metrics.doubleBaseMargin}>What to expect</AppHeading>
          </SectionHeadingContentContainer>

          <SectionHeadingContentContainer flex={1} alignItems="flex-end" justifyContent="center">
            <Icon name={isCollapsed ? "chevron-down" : "chevron-up"} size={25} style={{ marginTop: Metrics.baseMargin + 5, color: Colors.black }} />
          </SectionHeadingContentContainer>
        </HowToAccessSectionContainer>
      </TouchableOpacity>

      <Divider style={{ backgroundColor: Colors.lightGrey, height: 1, marginTop: Metrics.baseMargin }} />

      <View style={{ marginTop: Metrics.doubleBaseMargin }}>
        <Collapsible duration={500} style={{ paddingBottom: Metrics.baseMargin }} collapsed={isCollapsed}>
          {howToAccess.map((access, index) => (
            <RenderText instruction={access.instruction} key={index} />
          ))}
        </Collapsible>
      </View>
    </View>
  );
};
