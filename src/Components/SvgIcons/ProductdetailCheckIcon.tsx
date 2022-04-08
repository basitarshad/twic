import * as React from 'react';
import Svg, { Path } from 'react-native-svg'
import { SvgIconType } from '../../types'
import { Colors } from '../../Themes';

const ProductDetailCheckIcon = (props: SvgIconType) => {
  const { fillColor = Colors.primaryText } = props;

  return (
    <Svg width={24} height={24} {...props}>
      <Path
        fill={fillColor}
        fillRule="evenodd"
        stroke-width="10"
        stroke={Colors.darkGrey} 
        stroke-linecap="round" 
        stroke-linejoin="round"
        d="M5.43 11.86L10 16.5l9.226-8.818"
      />
    </Svg>
  )
}

export default ProductDetailCheckIcon
