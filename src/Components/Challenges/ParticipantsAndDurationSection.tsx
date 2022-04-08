import * as React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { propOr } from 'ramda';

import { IconWithBadge, AppText } from '../Commons';
import { Metrics, Fonts, Colors } from '../../Themes';
import { useChallengeContext } from './ChallengeContext';

const SectionContainer = styled.View`
  flex-direction: row;
`

type CardContainerProps = {
  width: string,
  alignItems?: string,
  justifyContent?: string,
  paddingTop?: number
}
const CardContainer = styled(View) <CardContainerProps>`
  width: ${props => props.width}; 
  justify-content: ${props => props.alignItems ? props.alignItems : 'flex-start'}; 
  align-items: ${props => props.alignItems ? props.alignItems : 'flex-start'};
  padding-top: ${props => propOr(0, 'paddingTop', props)};
`

type cardProps = {
  iconName: string,
  label: string,
  text: string
}
const Card = (props: cardProps) => {
  const { iconName = '', label = '', text = '' } = props
  return (
    <CardContainer width='50%' paddingTop={Metrics.doubleBaseMargin}>
      <IconWithBadge
        name={iconName}
        color={Colors.darkGrey}
        iconStyle={{ marginLeft: -1 }}
        iconSize={'small'}
      />
      <AppText fontSize={Fonts.size.small - 1} color={Colors.darkGrey} paddingTop={5} textTransform='uppercase'>{label}</AppText>
      <AppText fontSize={Fonts.size.normal} fontWeight='400' paddingTop={3}>{text}</AppText>
    </CardContainer>
  );
}

const ParticipantsAndDurationSection = () => {
  const { state } = useChallengeContext();
  const {
    numberOfParticipants = '-',
    duration = '-'
  } = propOr({}, 'challenge', state);

  return (
    <SectionContainer>
      <Card iconName='users' label='Participants' text={`${numberOfParticipants} Participants`} />
      <Card iconName='calendar' label='Days Remaining' text={`${duration} days left`} />
    </SectionContainer>
  )
}

export default ParticipantsAndDurationSection