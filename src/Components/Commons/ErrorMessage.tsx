import * as React from 'react';
import styled from 'styled-components/native';

import { Colors, Metrics } from '../../Themes';
import { AppText } from './AppStyledComponents';

export const ErrorContainer = styled.View`
  justify-content: center;
  alignItems: center;
  padding-vertical: ${Metrics.baseMargin};
  padding-horizontal: ${Metrics.smallMargin};
  border-width: 1;
  border-color: ${Colors.primary};
  border-radius: ${Metrics.baseMargin};
  margin-top: ${Metrics.baseMargin};
`

type LinkLabelProps = {
  errorText: string,
}
const ErrorMessage = (props: LinkLabelProps) => {
  const {
    errorText = '',
  } = props;
  return (
    <ErrorContainer>
      <AppText color={Colors.primary}>{errorText}</AppText>
    </ErrorContainer>
  )
}

export default ErrorMessage