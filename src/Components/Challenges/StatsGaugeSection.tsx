import * as React from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import { ProgressChart } from "react-native-chart-kit";
import { propOr } from 'ramda';
import numeral from 'numeral';
import styled from 'styled-components/native';
import { If, Then, Else } from 'react-if';

import { Metrics, Fonts, Colors } from '../../Themes';
import { AppText } from '..';
import { AppHeading } from '../Commons';
import { useChallengeContext } from './ChallengeContext';

const screenWidth = Dimensions.get("window").width - Metrics.doubleBaseMargin * 2;

type VerticalSeparatorProps = {
  backgroundColor?: string, //Colors
}
const VerticalSeparator = styled(View) <VerticalSeparatorProps>`
  height: 40;
  width: 7;
  background-color: ${props => propOr(Colors.primaryText, 'backgroundColor', props)};
  border-radius: 4;
`
const StatsGaugeCardContainer = styled.View`
  flex-direction: row;
  flex: 1;
  padding-vertical: ${Metrics.baseMargin};
  justify-content: center;
`
const StatsGaugeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const StatsGauge = (props) => {
  const { statsGauge = {} } = props
  const { totalPoints = 0, statGaugeData = [] } = statsGauge
  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    default_color: `rgba(234, 236, 238)`,
    strokeWidth: 2,
    total_points: numeral(totalPoints).format('0,0.0a')
  };

  return (
    <View style={{ height: 220 }}>
      <ProgressChart
        //@ts-ignore
        data={statGaugeData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />
    </View>
  )
}

const ActivityValueUnit = (props) => {
  const { value, unit } = props
  return (
    <AppText
      fontSize={Fonts.size.normal}
      fontWeight='500'
      paddingTop={3}>
      {value}
      <AppText fontWeight='300' fontSize={Fonts.size.small}> {unit}</AppText>
    </AppText>
  )
}

const RenderMeditationMinutes = (props) => {
  const { activityValue = 0 } = props
  const hours = Math.floor(activityValue / 60)
  const minutes = Math.floor(activityValue % 60)

  return (
    <View style={{ flexDirection: 'row' }}>
      <ActivityValueUnit
        value={hours}
        unit={'hrs'}
      />
      <View style={{ marginLeft: Metrics.smallMargin }}>
        <ActivityValueUnit
          value={minutes}
          unit={'min'}
        />
      </View>
    </View>
  )
}

const StatsGaugeCard = (props) => {
  const { item } = props
  const { color = '', title = '', activityValue = 0, unit = '', type = '' } = item

  return (
    <StatsGaugeCardContainer>
      <VerticalSeparator backgroundColor={color} />
      <View style={{ paddingLeft: 10 }}>
        <AppText fontSize={Fonts.size.small - 1} color={Colors.darkGrey} textTransform='uppercase'>{title}</AppText>

        {/* step count */}
        <If condition={type === 'steps'}>
          <ActivityValueUnit
            value={numeral(activityValue).format('0,0.0a')}
            unit={unit}
          />
        </If>
        {/* meditation minutes */}
        <If condition={type === 'meditation'}>
          <RenderMeditationMinutes activityValue={activityValue} />
        </If>

      </View>
    </StatsGaugeCardContainer>
  )
}

const StatsGaugeSection = (props) => {
  const { state } = useChallengeContext();
  const { statsGauge } = propOr({}, 'challenge', state);
  const { statGaugeData = [] } = statsGauge

  return (
    <View>
      <AppHeading>Current Stats</AppHeading>
      <StatsGauge statsGauge={statsGauge} />
      <StatsGaugeContainer>
        <FlatList
          data={statGaugeData}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          numColumns={2}
          renderItem={({ item }) => <StatsGaugeCard item={item} />}
          keyExtractor={(item: any) => item.title}
        />
      </StatsGaugeContainer>
    </View>
  )
}

export default StatsGaugeSection