import * as React from "react";
import { Input } from "react-native-elements";
import styled from "styled-components/native";
import { isEmpty, propOr, path } from "ramda";
import { If } from "react-if";
import { View, Platform, Keyboard } from "react-native";

import { Colors, Fonts, Metrics } from "../../../Themes";
import { AppText, _Text } from "../AppStyledComponents";
import { isEmptyOrNil } from "../../../Utils";

type InputContainerProps = {
  marginBottom?: string;
  marginTop?: string;
  paddingHorizontal?: number;
};
const InputContainer = styled(View)<InputContainerProps>`
  margin-top: ${(props) => propOr("0px", "marginTop")(props)};
  margin-bottom: ${(props) => propOr("0px", "marginBottom")(props)};
  padding-horizontal: ${(props) => propOr(0, "paddingHorizontal")(props)};
  flex-direction: row;
`;

const InputErrorText = styled((props) => <_Text {...props} />)`
  color: ${Colors.error};
  font-size: ${Fonts.size.small};
  font-family: TTCommons-Regular;
`;
export type InputFieldProps = {
  label: string | JSX.Element;
  value: string;
  disabled?: boolean;
  errorMessage?: string;
  placeholder?: string;
  multiLine?: boolean;
  onChangeHandler(value: any): void;
  onBlurHandler?(value: any): void;
  onFocusHandler?(value: any): void;
  onSubmitEditing?(value: any): void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  rightIcon?: () => JSX.Element;
  //styling props
  InputStyle?: Object;

  showInputLinkComponent?: boolean;
  InputLinkComponent?(): React.ReactElement;
  inputFieldStyle?: object;
  disabledInputStyle?: object;
  prefix?: string;
  testId?: string;
};

const InputField = (props: InputFieldProps) => {
  const {
    label = "",
    placeholder = "",
    value = "",
    disabled = false,
    onChangeHandler,
    onBlurHandler = () => {},
    onFocusHandler = () => {},
    onSubmitEditing = () => {},
    errorMessage = "",
    prefix = "",
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    showInputLinkComponent = false,
    InputLinkComponent = () => <></>,
    rightIcon = () => <></>,
    multiLine = false,
    testId = "",

    //styling props
    inputFieldStyle,
    disabledInputStyle = {},
  } = props;
  const ShowPrefixComponent = () =>
    !isEmptyOrNil(prefix) ? (
      <AppText paddingBottom={2} color={Colors.black} fontSize={Fonts.size.medium}>
        {prefix}
      </AppText>
    ) : null;
  const inputFieldRef = React.useRef(null);

  React.useEffect(() => {
    const keyboardDidHide = () => {
      if (Platform.OS === "android") {
        Keyboard.dismiss();
        const onBlurHandler = path(["current", "input", "blur"], inputFieldRef) as Function;
        if (typeof onBlurHandler === "function") onBlurHandler();
      }
    };
    Keyboard.addListener("keyboardDidHide", keyboardDidHide);
  }, []);
  return (
    <View style={inputFieldStyle}>
      <InputContainer>
        <Input
          autoCorrect={false}
          testID={testId}
          accessibilityLabel={testId}
          ref={inputFieldRef}
          containerStyle={{ paddingHorizontal: 0 }}
          inputStyle={{
            fontSize: Fonts.size.small,
            fontFamily: "TTCommons-Regular",
            paddingLeft: Platform.OS === "android" ? -3 : 0,
          }}
          disabled={disabled}
          disabledInputStyle={disabledInputStyle}
          placeholder={placeholder}
          label={label}
          labelProps={{
            maxFontSizeMultiplier: 1.1,
          }}
          labelStyle={{
            fontWeight: Platform.OS === "android" ? "400" : "bold",
            color: Colors.charcoalDarkGrey,
            fontSize: Fonts.size.small,
            fontFamily: "TTCommons-DemiBold",
            //paddingBottom: numberOfLines > 1 ? Metrics.smallMargin : 0
          }}
          placeholderTextColor={Colors.charcoalLightGrey}
          value={value}
          leftIcon={() => ShowPrefixComponent()}
          rightIcon={() => rightIcon()}
          leftIconContainerStyle={{
            left: -(Metrics.baseMargin + 5),
            position: "absolute",
            top: Platform.OS === "android" ? Metrics.smallMargin : 0,
          }}
          onChangeText={onChangeHandler}
          onSubmitEditing={onSubmitEditing}
          onBlur={onBlurHandler}
          onFocus={onFocusHandler}
          // errorMessage={errorMessage}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiLine}
          inputContainerStyle={{
            borderBottomColor: !isEmptyOrNil(errorMessage) ? Colors.primary : Colors.dimGrey,
            borderBottomWidth: 2,
            paddingLeft: !isEmptyOrNil(prefix) ? Metrics.baseMargin * prefix.length + 3 : 0,
          }}
          maxFontSizeMultiplier={1.1}
          returnKeyType={multiLine ? "default" : "done"}
        />
      </InputContainer>
      <InputContainer marginTop="5px" marginBottom={`${Metrics.baseMargin}px`}>
        {/* TODO: this view should be conditional */}
        <View style={{ flex: 1, height: 20 }}>
          <If condition={!isEmpty(errorMessage)}>
            <InputErrorText testID={`${testId}-error`} accessibilityLabel={`${testId}-error`}>
              {errorMessage}
            </InputErrorText>
          </If>
        </View>
        <If condition={showInputLinkComponent}>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <InputLinkComponent />
          </View>
        </If>
      </InputContainer>
    </View>
  );
};

export default InputField;
