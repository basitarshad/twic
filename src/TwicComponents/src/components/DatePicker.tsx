import * as React from 'react';
import { StyleProp, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { If, Then } from 'react-if';
import { clone } from 'ramda';
import Icon from 'react-native-vector-icons/AntDesign';

import { APP_CONSTANTS, Colors, Metrics, Utilities, Fonts } from '../commons';
import { AppText } from './AppText';
import { PICKER_THEME } from './Picker';
import { DatePickerProps } from './types';
import { TextInput } from 'react-native-paper';

const { isEmptyOrNil } = Utilities;

export const CalendarIcon: React.FC<{ color: string }> = props => {
  const { color } = props;
  const pickerStyle: StyleProp<any> = APP_CONSTANTS.IS_ANDROID
    ? {
        position: 'absolute',
        right: !APP_CONSTANTS.IS_ANDROID ? 0 : 5,
        color: color,
      }
    : { color: color };

  return <Icon name="calendar" style={pickerStyle} size={APP_CONSTANTS.IS_ANDROID ? Fonts.size.tiny : Fonts.size.medium + 1} color={color} />;
};

export const DatePickerField = (props: DatePickerProps) => {
  const [colors, setColors] = React.useState({ pickerColor: Colors.newDimGrey, text: Colors.newCharcoalDarkGrey, icon: Colors.charcoalLightGrey });
  const textInputRef = React.useRef<any>(null);
  const {
    onConfirmDate,
    label = '',
    value = '',
    labelPaddingTop = 4,
    testId = '',
    errorMessage = '',
    disabled = false,
    textProps = {},
    iconProps = {},
    pickerMode = 'outlined',
    RenderCustomIcon = CalendarIcon,
    fieldStyle = {
      width: '100%',
      paddingLeft: 0,
      paddingRight: !APP_CONSTANTS.IS_ANDROID ? 0 : 5,
      paddingVertical: 5,
    },
    onOpenHandler = () => {},
    datePickerProps = {},
    customStyles = {},
  } = props;
  const pickerStateColor = disabled ? Colors.newDisabled : isEmptyOrNil(errorMessage) ? colors.pickerColor : Colors.error;

  const initialValue = clone(value);
  const iconColor = disabled ? Colors.disabledText : colors.icon;
  const paddingTop = pickerMode === 'flat' ? Metrics.screenHorizontalPadding : 0;

  const onCancelPress = () => {
    onConfirmDate(initialValue);
  };

  const handleDateSubmission = date => {
    onConfirmDate(date);
  };
  const onCloseModal = () => {
    textInputRef.current.handleBlur();
    setColors({ ...colors, pickerColor: Colors.newDimGrey, icon: Colors.charcoalLightGrey });
  };

  const RenderDatePicker = () => (
    <DatePicker
      date={value}
      mode="date"
      placeholder="Choose date"
      format="ll"
      minDate="1970-01-01"
      maxDate={new Date()}
      confirmBtnText="Done"
      cancelBtnText="Cancel"
      onOpenModal={() => {
        textInputRef.current.handleFocus();
        setColors({ ...colors, pickerColor: Colors.newBlue, icon: Colors.newBlue });
        onOpenHandler();
      }}
      onCloseModal={onCloseModal}
      testID={testId}
      onCancelPress={() => onCancelPress()}
      onDateChange={date => {
        onCloseModal();
        handleDateSubmission(date);
      }}
      showIcon
      allowFontScaling={false}
      adjustsFontSizeToFit={true}
      iconComponent={<RenderCustomIcon {...iconProps} color={isEmptyOrNil(errorMessage) ? iconColor : Colors.error} />}
      style={fieldStyle}
      customStyles={{
        dateTouchBody: {
          flexDirection: 'row',
          height: 45,
          paddingHorizontal: 15,
          paddingTop: paddingTop,
        },
        dateInput: {
          top: -2,
          height: 20,
          borderWidth: 0,
          alignItems: 'flex-start',
        },
        btnTextConfirm: {
          color: Colors.blue,
          fontFamily: 'TTCommons-DemiBold',
          fontSize: Fonts.size.h3,
        },
        dateText: {
          fontSize: Fonts.size.small,
          fontFamily: 'TTCommons-Regular',
          color: Colors.black,
          paddingTop: labelPaddingTop,
        },
        placeholderText: {
          fontSize: Fonts.size.small,
          fontFamily: 'TTCommons-Regular',
          paddingTop: labelPaddingTop,
          color: Colors.charcoalLightGrey,
        },
        // fixing the alignment for ios14
        datePicker: {
          justifyContent: 'center',
        },
        ...customStyles,
      }}
      {...datePickerProps}
    />
  );

  return (
    <>
      {/* @ts-ignore */}
      <TextInput
        style={{ backgroundColor: Colors.white, textAlign: 'auto' }}
        theme={{
          ...PICKER_THEME,
          colors: {
            primary: Colors.blue,
            error: Colors.error,
            disabled: Colors.newDisabled,
            placeholder: pickerStateColor,
            text: Colors.black,
          },
        }}
        ref={textInputRef}
        underlineColor={pickerStateColor}
        underlineColorAndroid={pickerStateColor}
        testID={testId}
        accessibilityLabel={testId}
        mode={pickerMode}
        label={!isEmptyOrNil(value) ? label : ''}
        value={!isEmptyOrNil(value) ? value : ''}
        error={!isEmptyOrNil(errorMessage) ? true : false}
        render={RenderDatePicker}
        {...textProps}
      />
      <If condition={!disabled && !isEmptyOrNil(errorMessage)}>
        <Then>
          <View>
            <AppText kind={'Error'}>{errorMessage}</AppText>
          </View>
        </Then>
      </If>
    </>
  );
};
