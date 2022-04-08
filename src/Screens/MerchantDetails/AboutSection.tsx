import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Collapsible from "react-native-collapsible";

import { Metrics } from "../../Themes";
import { AppHeading, RenderHtml } from "../../Components";
import { AboutSectionHeadingContainer, AboutSectionHeadingContentContainer } from "./StyledComponents";

const AboutSection = (props) => {
  const { about, title } = props;
  const [isCollapsed, setCollapsed] = React.useState(true);
  return (
    <View>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setCollapsed(!isCollapsed)}>
        <AboutSectionHeadingContainer>
          <AboutSectionHeadingContentContainer width="80%" alignItems="flex-start">
            <AppHeading paddingTop={Metrics.doubleBaseMargin}>About {title} </AppHeading>
          </AboutSectionHeadingContentContainer>

          <AboutSectionHeadingContentContainer width="20%" alignItems="flex-end" justifyContent="center">
            <Icon name={isCollapsed ? "chevron-down" : "chevron-up"} size={25} style={{ marginTop: Metrics.baseMargin + 5 }} />
          </AboutSectionHeadingContentContainer>
        </AboutSectionHeadingContainer>
      </TouchableOpacity>

      <Collapsible duration={500} align="center" style={{ marginBottom: Metrics.baseMargin }} collapsed={isCollapsed}>
        <RenderHtml
          containerStyle={{
            flex: 1,
          }}
          onLinkPress={() => {}}
          html={about}
        />
      </Collapsible>
    </View>
  );
};

export default AboutSection;
