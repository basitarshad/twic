import * as React from 'react';
import { Image, View } from 'react-native';
import styled from 'styled-components/native';
import { map, propOr } from 'ramda';

import { AppText } from '../../Components';
import { Metrics, Fonts } from '../../Themes';
import { AppHeading } from '../Commons';
import { useChallengeContext } from './ChallengeContext';
import { ApplicableActivityChallengeProps } from '../../types';
import ActivitiesDrawer from './ActivitiesDrawer';


const SectionContainer = styled.View`
  flex-direction: row;
  padding-top: ${Metrics.baseMargin};
  padding-bottom: ${Metrics.baseMargin};
  justify-content: flex-start;
`
const ActivityContainer = styled.TouchableOpacity`
  padding-right: ${Metrics.doubleBaseMargin};
`

const ActivityCard = (props) => {
  const { iconUrl, title, onPressHandler } = props
  return (
    <ActivityContainer onPress={onPressHandler}>
      <Image
        style={{ width: 70, height: 70 }}
        source={{ uri: iconUrl }}
      />
      <AppText fontSize={Fonts.size.small} paddingTop={5} textAlign='center'>{title}</AppText>
    </ActivityContainer>
  );
}

const ApplicableActivitiesSection = () => {
  const { state, dispatcher } = useChallengeContext();
  const {
    statsGauge
  } = propOr({}, 'challenge', state)

  const applicableActivities = propOr([], 'formattedApplicableActivities', statsGauge) as Array<ApplicableActivityChallengeProps>;
  const openActivitiesDrawer = (type) => {
    dispatcher({
      type: 'OPEN_ACTIVITY_DRAWER',
      payload: type
    })
  }

  return (
    <View>
      <AppHeading>Eligible Activities</AppHeading>
      <SectionContainer>
        {
          map((activity) => {
            const { iconUrl, title, type } = activity
            return (
              <ActivityCard
                key={title}
                iconUrl={iconUrl}
                title={title}
                onPressHandler={() => openActivitiesDrawer(type)}
              />
            )
          }, applicableActivities)
        }
      </SectionContainer>
      <ActivitiesDrawer />
    </View>
  )
}

export default ApplicableActivitiesSection