import * as React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import * as Animatable from 'react-native-animatable';
import { If } from 'react-if';
import { propOr, prop } from 'ramda';

import { APP_CONSTANTS, Colors, Fonts, Metrics } from '../commons';
import { AppText } from './AppText';
import BoxShadow from './BoxShadow';
import { PrimaryButtonType } from './types';

const smallButtonWidth = APP_CONSTANTS.MUI_BTN_WIDTH / 2;
interface ButtonContainerType {
  fullWidth?: boolean;
  buttonColor?: string;
  width?: number | 'auto' | string;
  buttonShadowColor?: string;
}

const ButtonContainer = styled(View)<ButtonContainerType>`
  width: ${props => (props.fullWidth ? APP_CONSTANTS.MUI_BTN_WIDTH : prop('width', props))};
  height: ${Metrics.section * 2 - 2};
  padding-horizontal: ${Metrics.baseMargin + 2};
  padding-vertical: ${Metrics.baseMargin + 2};
  border-radius: ${Metrics.baseMargin};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => propOr(Colors.primary, 'buttonColor', props)};
`;

const ButtonIcon = styled(EvilIcon)`
  font-size: ${Fonts.size.h1};
  color: ${Colors.white};
  font-weight: bold;
  text-align: center;
`;
const ButtonLoaderIcon = () => (
  <Animatable.View iterationCount={'infinite'} animation="rotate">
    <ButtonIcon name="spinner-3" />
  </Animatable.View>
);

export const PrimaryButton = (props: PrimaryButtonType) => {
  const {
    buttonLabel = 'Save',
    customIcon = () => {},
    fullWidth = false,
    width = smallButtonWidth,
    onClickHandler,
    disabled = false,
    loading = false,
    buttonColor = Colors.newBlue,
    buttonShadowColor,
    buttonStyle,
    labelStyle,
    shadowOptions = {},
    shadowContainerStyle = {},
    contentWrapperStyle = {},
    testId = '',
    disabledColor = Colors.newDimGrey,
  } = props;

  const ButtonContent = () => {
    return (
      <ButtonContainer fullWidth={fullWidth} width={width} buttonColor={disabled ? disabledColor : buttonColor} buttonShadowColor={buttonShadowColor || buttonColor} style={buttonStyle}>
        <If condition={Boolean(customIcon)}>{customIcon()}</If>
        <If condition={loading}>
          <ButtonLoaderIcon />
        </If>
        <If condition={!loading}>
          <AppText kind="ButtonLabel" style={labelStyle}>
            {buttonLabel}
          </AppText>
        </If>
      </ButtonContainer>
    );
  };

  return (
    <View testID={disabled ? `${testId}-disabled` : testId} accessibilityLabel={disabled ? `${testId}-disabled` : testId}>
      <BoxShadow
        shadowOptions={{
          ...APP_CONSTANTS.PRIMARY_BUTTON_SHADOW,
          shadowColor: disabled ? disabledColor : buttonColor,
          backgroundColor: buttonColor,
          borderBottomColor: buttonColor,
          bottom: 4,
          width: '0%',
          height: 0,
          ...shadowOptions,
        }}
        contentWrapperStyle={{
          shadowColor: disabled ? disabledColor : buttonColor,
          shadowOffset: '0px 2px',
          shadowOpacity: 0.75,
          shadowRadius: 2,
          elevation: 2,
          backgroundColor: disabled ? disabledColor : buttonColor,
          borderRadius: 7,
          alignItems: 'flex-end',
          ...contentWrapperStyle,
        }}
        otherOptions={{
          alignSelf: 'center',
        }}
        shadowContainerStyle={shadowContainerStyle}
        onPress={onClickHandler}
        disabled={disabled}
      >
        <ButtonContent />
      </BoxShadow>
    </View>
  );
};
