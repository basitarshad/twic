declare type TransparentButtonsBorderType = {
    borderRadius?: number;
    borderColor?: string;
};
export declare const TransparentButtonsBorder: (options?: TransparentButtonsBorderType | undefined) => string;
export declare const CardContainer: any;
export declare const UnselectedRadioButtonContainer: any;
export declare const RadioButtonContainer: any;
export declare const RadioButtonIndicator: any;
export declare type RadioButtonProps = {
    isSelected: boolean;
    label: string;
    onCheckboxChange(value: any): void;
    shadowOptions?: object;
    testId?: string;
};
export declare const RadioButton: (props: RadioButtonProps) => JSX.Element;
export {};
