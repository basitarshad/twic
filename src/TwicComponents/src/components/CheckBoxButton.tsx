import * as React from 'react';
import { View, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckIcon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';

import { APP_CONSTANTS, Colors, Metrics, Fonts } from '../commons';
import { AppText } from './AppText';

type FormikCheckboxFieldType = {
  fieldName: string;
  fieldProps: {
    checked: boolean;
    checkedColor?: string;
    uncheckedColor?: string;
    checkedIcon?: React.ReactElement<{}>;
    uncheckedIcon?: React.ReactElement<{}>;
    onPress?(): void;
    textStyle?: StyleProp<TextStyle>;
    iconRight?: boolean;
    title?: string;
    iconContainer?: StyleProp<ViewStyle>;
  };
  containerStyle?: StyleProp<ViewStyle>;
};

const CheckBoxContainer = styled.TouchableOpacity`
  display: flex;
  margin-bottom: ${Metrics.baseMargin + 5};
  margin-top: 2px;
  padding-vertical: 5px;
  align-items: center;
`;

export const CheckBoxButton = (props: FormikCheckboxFieldType) => {
  const { fieldProps, containerStyle = {} } = props;
  const {
    checkedColor,
    uncheckedColor,
    onPress,
    iconContainer = {},
    textStyle = {},
    iconRight = false,
    title,
    checked,
    checkedIcon = <CheckIcon name="checksquare" color={checkedColor ? checkedColor : Colors.blue} size={17} />,
    uncheckedIcon = <Icon name="square-o" color={uncheckedColor ? uncheckedColor : Colors.darkGrey} size={17} />,
  } = fieldProps;
  return (
    <CheckBoxContainer style={[{ flexDirection: iconRight ? 'row-reverse' : 'row' }, containerStyle]} onPress={onPress}>
      <View style={[styles.iconContainer, iconContainer]}>{checked ? checkedIcon : uncheckedIcon}</View>
      {title && <AppText style={[styles.textStyles, textStyle]}>{title}</AppText>}
    </CheckBoxContainer>
  );
};
const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
    borderRadius: 0,
  },
  textStyles: {
    marginLeft: 10,
    color: Colors.black,
    fontWeight: '300',
    fontSize: APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small,
    fontFamily: Fonts.TTCommons.bold,
  },
});
