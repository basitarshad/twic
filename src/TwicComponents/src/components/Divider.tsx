import * as React from 'react';
import { Divider as PaperDivider } from 'react-native-paper';

type Props = {
  style?: Object;
  testID?: string;
};

export const Divider = (props: Props) => {
  const { style = {}, testID = '' } = props;
  return <PaperDivider style={style} testID={testID} />;
};
