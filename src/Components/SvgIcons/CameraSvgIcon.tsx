import * as React from "react"
import Svg, { Path } from "react-native-svg"

const CameraSvgIcon = (props) => {
  const { fillColor } = props

  return (
    <Svg width={18} height={16} viewBox="0 0 18 16" {...props}>
      <Path
        fill="none"
        stroke={fillColor || "#22222D"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="M16 3a1 1 0 011 1v10a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1h14zM9 6a3 3 0 100 6 3 3 0 000-6zm4.5 0h1M3 1h4v2H3V1z"
      />
    </Svg>
  )
}

export default CameraSvgIcon
