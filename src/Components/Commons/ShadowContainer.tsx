import * as React from 'react'
import { View, Platform } from 'react-native'
import Svg, { Defs, Stop, RadialGradient, Ellipse } from 'react-native-svg'
import { Metrics, Colors } from '../../Themes'

export type ShadowOptionsType = {
  width: number,
  height: number,
  color?: string,
  border?: number,
  shadowRadius?: number,
  opacity?: number,
  x: number,
  y: number,
  style?: object,
  zIndex?: number,
  translateX?: number,
  translateY?: number
}

interface BoxShadowInterface {
  shadowOptions?: ShadowOptionsType,
  children: React.ReactNode
}
export default class BoxShadow extends React.Component<BoxShadowInterface> {
  render = () => {
    //get the shadow shadowOptionss and give them default values
    const { shadowOptions, children } = this.props
    const {
      width = Metrics.screenWidth,
      height = Metrics.navBarHeight,
      color = Colors.darkGrey,
      border = 0,
      shadowRadius = Metrics.screenWidth,
      x = 0,
      y = 0,
      translateX = 0,
      translateY = 0,
      style = {},
      opacity = 0.5,
      zIndex = 1
    } = shadowOptions || {}

    //define the lengths
    const lineWidth = border;

    //return a view ,whose background is a svg picture
    return (
      <View style={[{ position: "relative", width: width, height: height, zIndex }, style]}>
        <Svg
          height={(height + lineWidth * 2)}
          width={(width + lineWidth * 2)}
          style={{ position: "absolute", top: y - lineWidth, left: x - lineWidth }}>
          <Defs>
            <RadialGradient
              id="grad"
              cx={width / 2}
              cy={height}
              rx={shadowRadius}
              ry={Platform.OS === 'android' ? '50' : '55'}
              fx="150"
              fy="75"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor={color} stopOpacity={opacity} />
              <Stop offset="1" stopColor={color} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse x={translateX} y={translateY} cx={width / 2} cy={height} rx={shadowRadius} ry={Platform.OS === 'android' ? '50' : '55'} fill="url(#grad)" />
        </Svg>
        {children}
      </View >
    )
  }
}
