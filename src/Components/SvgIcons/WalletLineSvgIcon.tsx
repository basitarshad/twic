import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { Colors } from '../../Themes'

const MoneySvgIcon = props => {
  const { fillColor = Colors.charcoalDarkGrey } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="M19.25 7.411c.69 0 1.25.56 1.25 1.25v10c0 .69-.56 1.25-1.25 1.25h-15c-.69 0-1.25-.56-1.25-1.25v-10c0-.69.56-1.25 1.25-1.25h15zm-.007-1.992a.443.443 0 01.007.081v1.911H4.238a.482.482 0 01.181-.068l14.25-2.336c.273-.045.53.14.574.412zm-1.118 5.2h1.75c.345 0 .625.28.625.624v4.75c0 .345-.28.625-.625.625h-1.75a.625.625 0 01-.625-.625v-4.75c0-.345.28-.625.625-.625z"
      />
    </Svg>
  )
}

export default MoneySvgIcon
