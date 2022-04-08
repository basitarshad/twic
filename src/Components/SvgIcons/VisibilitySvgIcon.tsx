import * as React from 'react';
import Svg, { Path } from 'react-native-svg'
import { SvgIconType } from '../../types'
import { Colors } from '../../Themes';

const VisibilitySvgIcon = (props: SvgIconType) => {
  const { fillColor = Colors.blue } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="M12 6.3c4.97 0 9 4.2 9 5.7s-4.03 5.3-9 5.3-9-3.8-9-5.3 4.03-5.7 9-5.7zm0 1.8a3 3 0 100 6 3 3 0 000-6z"
      />
    </Svg>
  )
}

export default VisibilitySvgIcon
