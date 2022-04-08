declare const AppConstants: {
    APP_LOADED: string;
    IS_ANDROID: boolean;
    PRIMARY_BUTTON_SHADOW: {
        width: string;
        shadowRadius: number;
        shadowOpacity: number;
        shadowOffset: {
            width: number;
            height: number;
        };
        bottom: number;
        height: number;
    };
    SECONDARY_BUTTONS_AND_FIELDS_SHADOW: {
        width: string;
        shadowRadius: number;
        shadowOpacity: number;
        shadowOffset: {
            width: number;
            height: number;
        };
        bottom: number;
        height: number;
        shadowColor: string;
    };
    SECONDARY_BUTTON_COMMON_STYLE_FULL_WIDTH: {
        buttonStyle: {
            height: number;
            justifyContent: string;
            width: string;
            alignItems: string;
        };
        shadowContainerStyle: {
            alignItems: string;
        };
        boxShadowProps: {
            alignSelf: string;
        };
        containerStyles: {
            justifyContent: string;
            bottom: number;
        };
    };
    MUI_BTN_WIDTH: number;
};
export default AppConstants;
