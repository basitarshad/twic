import * as React from 'react';
import Collapsible from 'react-native-collapsible';

type SlideInView = {
  customStyle?: object,
  duration?: number,
  children: any,
  isVisible: boolean
}
const SlideInView = (props: SlideInView) => {
  const {
    customStyle = {},
    duration = 500,
    children,
    isVisible = false
  } = props

  return (
    <Collapsible
      duration={duration}
      align='center'
      style={customStyle}
      collapsed={!isVisible}>
      {children}
    </Collapsible>
  )
}

export default SlideInView;