import * as React from 'react';
import LottieView from 'lottie-react-native';
import { Images } from '../../Themes'

type TwicAnimation = {
  customStyle?: object
}
const TwicAnimation = (props: TwicAnimation) => {
  const { customStyle = {} } = props

  return (
    <LottieView
      source={Images.twicAnimation}
      autoPlay
      loop
      style={{
        ...customStyle,
        zIndex: -1,
      }}
      resizeMode='cover'
    />
  );
}

export default TwicAnimation