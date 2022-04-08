import * as React from "react"
import { Animated } from 'react-native'
import Svg, { Path } from "react-native-svg"

const AnimatedPath = Animated.createAnimatedComponent(Path)
const ArrowSvgIcon = (props) => {
  const { fillColor = "#3C3D47" } = props

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <AnimatedPath
        fill="none"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="M11.67 6.632L6 12l5.67 5.413M6 12h12.54"
      />
    </Svg>
  )
}

export default ArrowSvgIcon
