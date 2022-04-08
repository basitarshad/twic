import * as React from 'react';
import { PickerProps } from './types';
export declare const PickerIcon: React.FC<{
    color: string;
}>;
export declare const PICKER_THEME: {
    fonts: {
        medium: {
            fontFamily: string;
        };
    };
    roundness: number;
};
export declare const Picker: (props: PickerProps) => JSX.Element;
