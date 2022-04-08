import * as React from "react";
import { Field } from "formik";
import DatePicker from "react-native-datepicker";
import { Platform, View } from "react-native";
import { If } from "react-if";
import { clone } from "ramda";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/AntDesign";

import { Colors, Metrics, Fonts } from "../../../../Themes";
import { isEmptyOrNil } from "../../../../Utils";
import { AppText, TransparentButtonsBorder } from "../../AppStyledComponents";
import { CalendarSvgIcon } from "../../../SvgIcons";
import { Divider } from "react-native-elements";
import BoxShadow from "../../BoxShadow";
import { APP_CONSTANTS } from "../../../../Constants";
import { PickerOverlay } from "../PickerOverlay";
type DatePickerProps = {
  onConfirmDate(date): void;
  value: any;
  fieldStyle?: any;
  renderShadow?: boolean;
  labelPaddingTop?: number;
  onOpenHandler?: () => void;
  testId?: string;
};
type FormikDatePickerField = {
  fieldName: string;
  errorMessage: string;
  fieldProps: DatePickerProps;
  renderShadow?: boolean;
  labelPaddingTop?: number;
  errorStyle?: Object;
};

const isPlatformIos = Platform.OS === "ios";

const PickerFieldContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 15px;
  padding-vertical: ${isPlatformIos ? "8px" : "12px"};
  border-color: ${Colors.lightBoxShadowGrey};

  ${!APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder()};
  background-color: ${Colors.white};
`;
const AppDatePicker = React.forwardRef((props: DatePickerProps, ref) => {
  const {
    onConfirmDate,
    value = "",
    renderShadow = false,
    labelPaddingTop = 2,
    testId = "",
    fieldStyle = {
      width: "100%",
      paddingLeft: 0,
      paddingRight: isPlatformIos ? 0 : 5,
      paddingVertical: 5,
    },
    onOpenHandler = () => {},
  } = props;
  const initialValue = clone(value);
  const [date, setDate] = React.useState(value);

  const onCancelPress = () => {
    onConfirmDate(initialValue);
  };

  const handleDateSubmission = (date) => {
    setDate(date);
    onConfirmDate(date);
  };

  return (
    <DatePicker
      ref={ref}
      date={date}
      mode="date"
      placeholder="Choose date"
      format="ll"
      minDate="1970-01-01"
      maxDate={new Date()}
      confirmBtnText="Done"
      cancelBtnText="Cancel"
      onOpenModal={() => {
        onOpenHandler();
      }}
      testID={testId}
      onCancelPress={() => onCancelPress()}
      onDateChange={(date) => handleDateSubmission(date)}
      showIcon
      allowFontScaling={false}
      adjustsFontSizeToFit={true}
      iconComponent={
        <View style={{ top: -1 }}>
          <Icon name="caretdown" size={isPlatformIos ? Fonts.size.extraSmall : Fonts.size.tiny} color={Colors.black} />
        </View>
      }
      style={fieldStyle}
      customStyles={{
        dateTouchBody: {
          flexDirection: "row",
          height: 20,
        },
        dateInput: {
          top: -2,
          height: 20,
          borderWidth: 0,
          alignItems: "flex-start",
        },
        btnTextConfirm: {
          color: Colors.blue,
        },
        dateText: {
          fontSize: Fonts.size.small,
          fontFamily: "TTCommons-Regular",
          color: Colors.black,
          paddingTop: labelPaddingTop,
        },
        placeholderText: {
          fontSize: Fonts.size.small,
          fontFamily: "TTCommons-Regular",
          paddingTop: labelPaddingTop,
          color: Colors.charcoalLightGrey,
        },
        // fixing the alignment for ios14
        datePicker: {
          justifyContent: "center",
        },
      }}
    />
  );
});

const FormikDatePickerField = (props: FormikDatePickerField) => {
  const ref = React.useRef<{ onPressDate: () => void }>(null);
  const { fieldName, fieldProps, errorMessage, renderShadow = false, labelPaddingTop = 2, errorStyle = {} } = props;
  const _DatePickerField = React.useCallback(() => {
    return <AppDatePicker ref={ref} {...fieldProps} renderShadow={renderShadow} labelPaddingTop={labelPaddingTop} />;
  }, [fieldProps, ref]);

  const pickerOverlayOnclick = () => {
    if (ref.current && ref.current.onPressDate && typeof ref.current.onPressDate === "function") ref.current.onPressDate();
  };
  if (renderShadow) {
    return (
      <>
        <BoxShadow
          shadowOptions={{
            ...APP_CONSTANTS.SECONDARY_BUTTONS_AND_FIELDS_SHADOW,
          }}
        >
          <PickerOverlay onPress={pickerOverlayOnclick}>
            <PickerFieldContainer>
              <View style={{ width: "9%" }}>
                <CalendarSvgIcon />
              </View>
              <View style={{ width: "91%" }}>
                <Field name={fieldName}>
                  {() => {
                    return _DatePickerField();
                  }}
                </Field>
              </View>
            </PickerFieldContainer>
          </PickerOverlay>
        </BoxShadow>
        <View
          style={{
            flex: 1,
            height: 20,
            marginTop: 5,
            marginBottom: Metrics.doubleBaseMargin,
            ...errorStyle,
          }}
        >
          <If condition={!isEmptyOrNil(errorMessage)}>
            <AppText color={Colors.error} fontSize={Fonts.size.small}>
              {errorMessage}
            </AppText>
          </If>
        </View>
      </>
    );
  }

  return (
    <>
      <PickerOverlay onPress={pickerOverlayOnclick}>
        <View style={{ flexDirection: "row", paddingRight: 10 }}>
          <View style={{ paddingTop: isPlatformIos ? -2 : 1 }}>
            <CalendarSvgIcon />
          </View>
          <Field name={fieldName}>
            {() => {
              return _DatePickerField();
            }}
          </Field>
        </View>
      </PickerOverlay>
      <Divider
        style={{
          backgroundColor: !isEmptyOrNil(errorMessage) ? Colors.primary : Colors.dimGrey,
          height: 2,
          marginTop: Platform.OS === "ios" ? Metrics.baseMargin - 2 : Metrics.baseMargin + 4,
        }}
      />
      <View
        style={{
          flex: 1,
          height: 20,
          marginTop: 5,
          marginBottom: Metrics.doubleBaseMargin,
        }}
      >
        <If condition={!isEmptyOrNil(errorMessage)}>
          <AppText color={Colors.error} fontSize={Fonts.size.small}>
            {errorMessage}
          </AppText>
        </If>
      </View>
    </>
  );
};

export default FormikDatePickerField;
