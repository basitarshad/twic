import * as React from 'react'
import Svg, { G, Circle, Path } from 'react-native-svg'
import { Colors } from '../../Themes';

const MoneySvgIcon = props => {
  const { fillColor = Colors.charcoalDarkGrey } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <G fill="none" fillRule="evenodd" transform="translate(3 3)">
        <Circle
          cx={9}
          cy={9}
          r={9}
          stroke={fillColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.3}
        />
        <Path
          fill={fillColor}
          d="M9.853 14.625V13.43a3.526 3.526 0 001.795-.908c.228-.22.406-.463.534-.73.129-.268.193-.542.193-.823 0-.535-.119-.968-.356-1.301a2.815 2.815 0 00-.89-.809 5.21 5.21 0 00-1.165-.492c-.42-.122-.808-.239-1.164-.351a4.35 4.35 0 01-.89-.38.664.664 0 01-.356-.605c0-.244.123-.468.37-.675.248-.206.594-.31 1.039-.31.445 0 .791.113 1.038.338.248.225.371.535.371.928h1.706c0-.365-.057-.698-.17-.998-.114-.3-.27-.565-.468-.794a2.739 2.739 0 00-.704-.584 3.536 3.536 0 00-.883-.366V3.375H8.221V4.57a3.79 3.79 0 00-1.023.296 2.7 2.7 0 00-.794.541 2.45 2.45 0 00-.52.745 2.177 2.177 0 00-.185.893c0 .516.119.93.356 1.245.238.314.534.57.89.766.356.197.745.352 1.165.464.42.113.808.228 1.164.345.356.117.653.25.89.4a.71.71 0 01.357.633c0 .282-.129.528-.386.739-.257.21-.648.316-1.172.316-.485 0-.865-.124-1.142-.373a1.235 1.235 0 01-.416-.963h-1.78a2.717 2.717 0 00.742 1.906c.227.239.5.436.816.59.316.155.662.26 1.038.317v1.195h1.632z"
        />
      </G>
    </Svg>
  )
}

export default MoneySvgIcon