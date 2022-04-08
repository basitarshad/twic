import * as React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Collapsible from 'react-native-collapsible';

import { Metrics, Colors, Fonts } from '../../Themes';
import { AppHeading, RenderHtml } from '../../Components';
import { NavigationService } from '../../Services';
import { APP_ROUTES } from '../../Navigation';

const HtmlStyles = {
  b: {
    marginVertical: 7,
    fontFamily: 'TTCommons-DemiBold',
    fontWeight: Platform.OS === 'android' ? '900' : 'bold',
    color: Colors.black,
    fontSize: Fonts.size.small
  },
  p: {
    marginVertical: 5,
    padding: 0,
    fontFamily: 'TTCommons-Regular',
    textAlign: 'justify'
  }
}

const SectionHeadingContainer = styled.View`
  flex-direction: row;
  padding-bottom: ${Metrics.smallMargin}; 
`

type SectionHeadingContentContainerProps = {
  alignItems: string
  justifyContent?: string
  width?: string
}
const SectionHeadingContentContainer = styled(View) <SectionHeadingContentContainerProps>`
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'}; 
  align-items: ${props => props.alignItems};
  width: ${props => props.width}; 
`

const onLinkPress = (evt, href, htmlAttribs) => {
  NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: href })
}


const CollapsibleText = (props) => {
  const { title, text } = props;
  const [isCollapsed, setCollapsed] = React.useState(true);

  return (
    <View>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setCollapsed(!isCollapsed)}>
        <SectionHeadingContainer>
          <SectionHeadingContentContainer width='80%' alignItems='flex-start'>
            <AppHeading paddingTop={Metrics.doubleBaseMargin}>{title}</AppHeading>
          </SectionHeadingContentContainer>
      
          <SectionHeadingContentContainer width='20%' alignItems='flex-end' justifyContent='center'>
            <Icon name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={25} style={{ marginTop: Metrics.baseMargin + 5 }} />
          </SectionHeadingContentContainer>
        </SectionHeadingContainer>
      </TouchableOpacity>

      <Collapsible
        duration={500}
        align='center'
        style={{ paddingBottom: Metrics.baseMargin}}
        collapsed={isCollapsed}>
        <RenderHtml onLinkPress={onLinkPress} html={text} tagStyles={HtmlStyles} />
      </Collapsible>
    </View>
  );
}

export default CollapsibleText;