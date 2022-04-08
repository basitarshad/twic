import * as React from 'react';
import { PrimaryButton } from './PrimaryButton';
import { Colors } from '../commons';
import { PrimaryButtonType } from './types';

export const SecondaryButton = (props: PrimaryButtonType) => {
  const { disabled } = props;
  return (
    <PrimaryButton
      contentWrapperStyle={{ elevation: 0 }}
      buttonColor={Colors.white}
      disabledColor={Colors.white}
      labelStyle={{ color: disabled ? Colors.newDimGrey : Colors.newBlue, marginLeft: 15, textAlign: 'right' }}
      buttonStyle={{ borderWidth: 1, borderColor: Colors.newDimGrey }}
      {...props}
    />
  );
};
