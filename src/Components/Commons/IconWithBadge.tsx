import * as React from 'react';
import { View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { If } from 'react-if';
import { Colors, Fonts, Metrics } from '../../Themes';
import { isEmpty } from 'ramda';
import styled from 'styled-components/native'

import { AppText } from './AppStyledComponents';

const BadgeCounterContainer = styled.View`
  position: absolute;
  left: -5;
  top: 0;
  background-color: ${Colors.darkPrimary};
  border-radius: 50;
  height: 15;
  padding-horizontal: 3;
  align-items: center;
`

interface BadgeCounterProps {
  badgeCounter: number,
  badgeStyle?: Object
}
const BadgeCounter = (props: BadgeCounterProps) => {
  const {
    badgeCounter = 0,
  } = props

  return (
    <BadgeCounterContainer>
      <AppText
        color={Colors.white}
        fontSize={Fonts.size.small}
        fontWeight='bold'
        width={40}
        textAlign='center'
      >
        {badgeCounter > 1000 ? `${badgeCounter}+` : badgeCounter}
      </AppText>
    </BadgeCounterContainer >
  )
}

interface IconWithBadgeTypeProps {
  name?: string,
  color?: string,

  iconSize?: string,
  iconStyle?: object,

  showBadge?: boolean,
  badgeCounter?: number,

  useCustomIcon?: boolean,
  customIconSource?: any,

  useSvgIcon?: boolean,
  RenderSvgIcon?(): React.ReactElement
}
const IconWithBadge = (props: IconWithBadgeTypeProps) => {
  const {
    name = 'chevron-down',
    color = Colors.primary,
    iconSize = 'medium',
    showBadge = false,
    badgeCounter = 0,
    useCustomIcon = false,
    customIconSource,
    useSvgIcon = false,
    RenderSvgIcon = () => <></>,
    iconStyle = {
      margin: Metrics.baseMargin
    }
  } = props;

  return (
    <View
      style={iconStyle}
    >
      {/* Render font awesome icon */}
      <If condition={!useCustomIcon && !useSvgIcon && !isEmpty(name)}>
        <Icon name={name} style={{ fontSize: Metrics.icons[iconSize], color }} />
      </If>
      {/* Render custom PNG Icon from assets */}
      <If condition={useCustomIcon}>
        <Image source={customIconSource} style={{ height: Metrics.icons[iconSize], width: Metrics.icons[iconSize] }} />
      </If>
      {/* Render the SVG Icons */}
      <If condition={useSvgIcon}>
        {RenderSvgIcon()}
      </If>

      <If condition={showBadge && badgeCounter > 0}>
        <BadgeCounter badgeCounter={badgeCounter} />
      </If>
    </View>
  );
}

export default IconWithBadge;