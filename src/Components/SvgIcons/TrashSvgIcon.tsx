import * as React from 'react';
import Svg, { Path } from 'react-native-svg'
import { SvgIconType } from '../../types'
import { Colors } from '../../Themes';

const TrashSvgIcon = (props: SvgIconType) => {
  const { fillColor = Colors.charcoalDarkGrey } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="M7 7.5h10V18a1 1 0 01-1 1H8a1 1 0 01-1-1V7.5h0zM13.382 4c.379 0 .725.214.894.553l.362.723a.506.506 0 01.052.262h3.81a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h3.81V5.5c0-.078.018-.154.053-.224l.362-.723A.998.998 0 0110.619 4h2.764zM10.5 10.5v5m3-5v5"
      />
    </Svg>
  )
}

export default TrashSvgIcon
