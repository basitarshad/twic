import * as React from 'react';
import Svg, { Path } from 'react-native-svg'
import { SvgIconType } from '../../../types'

const CategoriesSvgIcon = (props: SvgIconType) => {
  const { fillColor = '#70747D' } = props;

  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" {...props}>
      <Path
        fill="none"
        stroke={fillColor}
        strokeWidth={1.3}
        d="M24.5 18a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-5a1.5 1.5 0 01-1.5-1.5v-5a1.5 1.5 0 011.5-1.5h5zm-12 0a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 016 24.5v-5A1.5 1.5 0 017.5 18h5zm0-12A1.5 1.5 0 0114 7.5v5a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 016 12.5v-5A1.5 1.5 0 017.5 6h5zm12 0A1.5 1.5 0 0126 7.5v5a1.5 1.5 0 01-1.5 1.5h-5a1.5 1.5 0 01-1.5-1.5v-5A1.5 1.5 0 0119.5 6h5z"
      />
    </Svg>
  )
}

export default CategoriesSvgIcon
