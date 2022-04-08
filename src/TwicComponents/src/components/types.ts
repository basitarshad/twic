import React from 'react';

type TextTransform = 'lowercase' | 'uppercase' | 'full-width' | 'inherit' | 'capitalize';
type TextKind = 'Text' | 'Heading' | 'ExtraSmall' | 'SectionTitle' | 'AppSectionTitle' | 'AppScreenTitle' | 'Error' | 'ButtonLabel';

export type AppTextProps = {
  children: any;
  kind?: TextKind;
  color?: string; //Colors
  paddingTop?: number; //pixels
  paddingLeft?: number; //pixels
  paddingRight?: number; //pixels
  paddingBottom?: number; //pixels
  marginTop?: number; //pixels
  textAlign?: 'left' | 'right' | 'center';
  fontWeight?: string;
  fontSize?: string | number;
  fontFamily?: string;
  textDecorationLine?: string;
  textTransform?: TextTransform | 'none';
  width?: number | 'auto';
  testID?: string;
  accessibilityLabel?: string;
  style?: any;
};

export interface PrimaryButtonType {
  buttonLabel: string;
  buttonColor?: string;
  buttonShadowColor?: string;
  fullWidth?: boolean;
  width?: number | 'auto' | string;
  activeOpacity?: number;
  onClickHandler(): void;
  disabled?: boolean;
  loading?: boolean;
  buttonStyle?: object;
  labelStyle?: object;
  shadowOptions?: object;
  shadowContainerStyle?: object;
  contentWrapperStyle?: Object;
  customIcon?: () => any;
  testId?: string;
  disabledColor?: string;
}

export type PickerProps = {
  label: string;
  placeholderText?: string;
  value: string;
  pickerMode?: 'flat' | 'outlined' | undefined;
  onValueChange(value: any): void;
  onDonePress?(): void;
  onOpenHandler?(): void;
  items: Array<any>;
  errorMessage?: string;
  customInputStyle?: object;
  pickerIOSContainer?: object;
  pickerAndroidContainer?: object;
  customErrorContainerStyle?: object;
  textInputContainerStyle?: object;
  RenderCustomIcon?(): React.ReactElement;
  testId?: string;
  hidePlaceholder?: boolean;
  textProps?: object;
};

type Modify<T, R> = Omit<T, keyof R> & R;

export type AutoCompleteFieldProps = Modify<
  InputFieldProps,
  {
    data: string[];
    onChangeHandler?: () => any;
    value?: string;
    seeAllCallBack?: (searchedString: string) => any;
    seeAllText?: string;
    clickableFieldCallBack?: (element: string) => any;
  }
>;

export type InputFieldProps = {
  setRef?(value: any): void;
  onChangeHandler(value: any): void;
  onBlurHandler?(value: any): void;
  onFocusHandler?(value: any): void;
  testId?: string;
  ref?: any;
  testID?: string;
  accessibilityLabel?: string;
  theme?: any;
  textInputContainerStyle?: any;
  mode?: 'outlined' | 'flat';
  label?: string;
  value?: any;
  error?: boolean;
  underlineColor?: string;
  underlineColorAndroid?: string;
  render?: () => React.ReactElement;
  textProps?: object;
  items?: any[];
  errorMessage?: string;
  colors?: any;
  placeholder?: string;
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onChangeText?: (value: string) => void;
  onSubmitEditing?: (e: any) => void;
  onBlur?(value: any): void;
  onFocus?(value: any): void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiLine?: boolean;
  numberOfLines?: number;
  maxFontSizeMultiplier?: number;
  returnKeyType?: 'default' | 'done';
  rightIconName?: string;
  rightIconComponent?(): React.ReactElement;
  //styling props
  InputStyle?: Object;
  iconProps?: Object;
  showInputLinkComponent?: boolean;
  InputLinkComponent?(): React.ReactElement;
  inputFieldStyle?: object;
  disabledInputStyle?: object;
  prefix?: string;
  leftCustomIcon?: string | ((e?: any) => React.ReactElement);
  leftCustomIconProps?: {};
  customErrorContainerStyle?: {};
  inputMode?: 'outlined' | 'flat' | undefined;
  iconColor?: string;
  pickerStateColor?: string;
};

export type DatePickerProps = {
  label: string;
  onConfirmDate(date): void;
  value: any;
  fieldStyle?: any;
  labelPaddingTop?: number;
  onOpenHandler?: () => void;
  errorMessage?: string;
  disabled?: boolean;
  textInputContainerStyle?: object;
  textProps?: object;
  iconProps?: object;
  RenderCustomIcon?: React.ComponentType<{ color: string }>;
  pickerMode?: 'flat' | 'outlined' | undefined;
  testId?: string;
  datePickerProps?: object;
  customStyles?: object;
};
