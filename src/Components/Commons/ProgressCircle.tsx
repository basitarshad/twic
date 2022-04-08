import * as React from 'react';
import { View } from 'react-native';
import { ProgressCircle as CircularProgressBar } from 'react-native-svg-charts'


import { Colors, Fonts } from '../../Themes';
import { AppText, AppHeading } from './AppStyledComponents';
import { If, Else, Then } from 'react-if';

type ProgressCircleProps = {
  height: number,
  width: number,
  color: string,
  current: number,
  total: number,
  strokeWidth: number,
  unit: string
}
const ProgressCircle = (props: ProgressCircleProps) => {
  const { height = 0, width = 0, color = '', current = 0, total = 0, strokeWidth = 0, unit = '$' } = props

  const isDollar = unit == '$' ? true : false
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ height, width }}>
        <CircularProgressBar
          style={{ height }}
          progress={current / total}
          animate={true}
          animationDuration={1000}
          strokeWidth={strokeWidth}
          progressColor={color}
        />
      </View>
      <If condition={isDollar}>
        <Then>
          <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
            <AppHeading maxFontSizeMultiplier={1} fontSize={Fonts.size.small - 1} color={color}>{unit}{current}</AppHeading>
            <AppText maxFontSizeMultiplier={1} color={Colors.darkGrey} fontSize={Fonts.size.extraSmall - 1} fontWeight='300'>/{unit}{total}</AppText>
          </View>
        </Then>
        <Else>
          <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
            <AppHeading maxFontSizeMultiplier={1} fontSize={Fonts.size.small - 1} color={color}>{current}{unit}</AppHeading>
            <AppText maxFontSizeMultiplier={1} color={Colors.darkGrey} fontSize={Fonts.size.extraSmall - 1} fontWeight='300'>/{total}{unit}</AppText>
          </View>
        </Else>
      </If>
    </View>
  )
}

export default ProgressCircle;