import * as React from 'react';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
declare type AvatarProps = {
    iconComponent?: () => React.ReactElement<{}>;
    width: number;
    height: number;
    title?: string;
    source: {
        uri?: string;
    };
    titleStyles?: TextStyle;
    imageStyles?: StyleProp<ImageStyle>;
    rounded?: boolean;
    overlayContainerStyles?: ViewStyle;
    containerStyles?: ViewStyle;
};
export declare const Avatar: React.FC<AvatarProps>;
export {};
