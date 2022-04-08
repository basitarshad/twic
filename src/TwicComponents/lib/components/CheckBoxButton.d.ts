import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
declare type FormikCheckboxFieldType = {
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
export declare const CheckBoxButton: (props: FormikCheckboxFieldType) => JSX.Element;
export {};
