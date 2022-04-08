/// <reference types="react" />
export declare const _Text: (props: any) => JSX.Element;
export declare const AppText: any;
export declare const AppHeading: any;
declare type TransparentButtonsBorderType = {
    borderRadius?: number;
    borderColor?: string;
};
export declare const TransparentButtonsBorder: (options?: TransparentButtonsBorderType | undefined) => string;
declare type AddElementShadowType = {
    shadowColor?: string;
    backgroundColor?: string;
    shadowOffset?: string;
    shadowOpacity?: number;
    shadowRadius?: number;
    elevation?: number;
};
export declare const AddElementShadow: (options?: AddElementShadowType | undefined) => string;
export {};
