declare type BoxShadowType = {
    children: any;
    shadowOptions: {
        width?: string;
        borderRadius?: number;
        opacity?: number;
        backgroundColor?: string;
        borderBottomColor?: string;
        borderBottomWidth?: number;
        shadowColor: string;
        shadowOpacity: number;
        shadowRadius: number;
        shadowOffset: {
            width: number;
            height: number;
        };
        height: number;
        bottom: number;
    };
    disabled?: boolean;
    otherOptions?: Object;
    shadowContainerStyle?: Object;
    contentWrapperStyle?: Object;
    touchableOpactiyRequired?: boolean;
    onPress?: () => void;
    testId?: string;
};
declare const BoxShadow: (props: BoxShadowType) => JSX.Element;
export default BoxShadow;
