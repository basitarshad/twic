import * as React from 'react';
import { View } from 'react-native';

type ListItemSeparator = {
  width?: number
}
export const ListItemSeparator = (props: ListItemSeparator) => {
  const { width = 5 } = props

  return <View style={{ width }} />
}