import * as React from 'react';
import { Keyboard, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import styled from 'styled-components/native';
import { isEmpty, path } from 'ramda';
import { If } from 'react-if';

import { APP_CONSTANTS, Colors, Fonts, Metrics, Utilities } from '../commons';
import { AppText } from './AppText';
import { InputFieldProps } from './types';

const { isEmptyOrNil } = Utilities;

type InputContainerProps = {
  marginBottom?: number;
  marginTop?: number;
  paddingHorizontal?: number;
};
const ErrorInputContainer = styled(View)<InputContainerProps>`
  flex-direction: row;
`;

const INPUT_FIELD_THEME = {
  fonts: {
    medium: {
      fontFamily: Fonts.TTCommons.regular,
    },
  },
  colors: {
    primary: Colors.blue,
    error: Colors.error,
    disabled: Colors.newDimGrey,
    placeholder: Colors.newDimGrey,
    text: Colors.black,
  },
  roundness: Metrics.baseMargin,
};

export const InputField = (props: InputFieldProps) => {
  const [colors, setColors] = React.useState({ icon: Colors.charcoalLightGrey });
  const inputFieldRef = React.useRef(null);
  const {
    label = '',
    placeholder = '',
    value = '',
    inputMode = 'outlined',
    disabled = false,
    onChangeHandler,
    setRef = undefined,
    onBlurHandler = () => {},
    onFocusHandler = () => {},
    onSubmitEditing = () => {},
    errorMessage = '',
    prefix = '',
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    showInputLinkComponent = false,
    InputLinkComponent = () => <></>,
    rightIconName = '',
    rightIconComponent,
    multiLine = false,
    testId = '',

    //styling props
    inputFieldStyle,
    textProps = {},
    iconProps = {},
    leftCustomIcon,
    leftCustomIconProps = {},
    customErrorContainerStyle = {},
  } = props;

  const iconColor = disabled ? Colors.disabledText : colors.icon;
  React.useEffect(() => {
    const keyboardDidHide = () => {
      if (APP_CONSTANTS.IS_ANDROID) {
        Keyboard.dismiss();
        const onBlurHandler = path(['current', 'input', 'blur'], inputFieldRef) as Function;
        if (typeof onBlurHandler === 'function') {
          onBlurHandler();
        }
      }
    };
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);
  }, []);

  const ShowPrefixComponent = () => {
    if (leftCustomIcon) {
      /* @ts-ignore */
      return <TextInput.Icon name={leftCustomIcon} size={20} color={!isEmptyOrNil(errorMessage) ? Colors.error : iconColor} style={{ marginTop: inputMode === 'outlined' ? Metrics.baseMargin - 2 : Metrics.section }} {...leftCustomIconProps} />;
    }
    if (rightIconComponent) {
      return rightIconComponent();
    }

    return !isEmptyOrNil(prefix) ? (
      <TextInput.Affix text={prefix} textStyle={inputMode === 'outlined' ? { color: Colors.black } : { color: Colors.black, marginBottom: multiLine ? Metrics.baseMargin - 2 : 0, paddingRight: Metrics.smallMargin }} />
    ) : null;
  };
  const ShowRightIconComponent = () => {
    if (rightIconComponent) {
      return rightIconComponent();
    } else if (!isEmptyOrNil(rightIconName)) {
      /* @ts-ignore */
      return <TextInput.Icon name={rightIconName} size={20} color={!isEmptyOrNil(errorMessage) ? Colors.error : iconColor} style={{ marginTop: inputMode === 'outlined' ? Metrics.baseMargin - 2 : Metrics.section }} {...iconProps} />;
    } else {
      return null;
    }
  };

  return (
    <View style={inputFieldStyle}>
      {/* @ts-ignore */}
      <TextInput
        theme={INPUT_FIELD_THEME}
        accessibilityLabel={testId}
        style={{ backgroundColor: Colors.white, textAlign: 'auto' }}
        testID={testId}
        ref={setRef || inputFieldRef}
        placeholder={placeholder}
        label={label}
        value={value}
        mode={inputMode}
        error={!isEmptyOrNil(errorMessage) ? true : false}
        disabled={disabled}
        left={ShowPrefixComponent()}
        right={ShowRightIconComponent()}
        // right={<TextInput.Icon name={() => <Icon name={"caretdown"} />} />}
        onChangeText={onChangeHandler}
        onSubmitEditing={onSubmitEditing}
        onBlur={val => {
          !isEmptyOrNil(rightIconName) && setColors({ ...colors, icon: Colors.charcoalLightGrey });
          onBlurHandler(val);
        }}
        onFocus={val => {
          !isEmptyOrNil(rightIconName) && setColors({ ...colors, icon: Colors.newBlue });
          onFocusHandler(val);
        }}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiLine}
        numberOfLines={multiLine ? 3 : 1} //For android only
        maxFontSizeMultiplier={1.1}
        returnKeyType={multiLine ? 'default' : 'done'}
        {...textProps}
      />
      {/* TODO: this view should be conditional */}
      <If condition={!isEmpty(errorMessage)}>
        <ErrorInputContainer style={customErrorContainerStyle}>
          <View style={{ flex: 1 }}>
            <AppText kind="Error" testID={`${testId}-error`} accessibilityLabel={`${testId}-error`}>
              {errorMessage}
            </AppText>
          </View>
        </ErrorInputContainer>
      </If>
      <If condition={showInputLinkComponent}>
        <ErrorInputContainer style={customErrorContainerStyle}>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <InputLinkComponent />
          </View>
        </ErrorInputContainer>
      </If>
    </View>
  );
};
