var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.AppText=void 0;var _taggedTemplateLiteralLoose2=_interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));var _extends2=_interopRequireDefault(require("@babel/runtime/helpers/extends"));var React=_interopRequireWildcard(require("react"));var _reactNative=require("react-native");var _ramda=require("ramda");var _styledComponents=require("styled-components");var _native=_interopRequireDefault(require("styled-components/native"));var _commons=require("../commons");var _this=this,_jsxFileName="/Users/anas.emum/twicapp-mobile-v2/src/TwicComponents/src/components/AppText.tsx",_templateObject,_templateObject2,_templateObject3,_templateObject4,_templateObject5,_templateObject6,_templateObject7,_templateObject8,_templateObject9,_templateObject10;function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!=="function")return null;var cacheBabelInterop=new WeakMap();var cacheNodeInterop=new WeakMap();return(_getRequireWildcardCache=function _getRequireWildcardCache(nodeInterop){return nodeInterop?cacheNodeInterop:cacheBabelInterop;})(nodeInterop);}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}var FONT_WEIGHT=_commons.APP_CONSTANTS.IS_ANDROID?'400':'bold';var FONT_SIZE=_commons.APP_CONSTANTS.IS_ANDROID?_commons.Fonts.size.small:_commons.Fonts.size.medium;var _Text=function _Text(props){return React.createElement(_reactNative.Text,(0,_extends2.default)({maxFontSizeMultiplier:1.1},props,{__self:_this,__source:{fileName:_jsxFileName,lineNumber:14,columnNumber:3}}),props.children);};var baseStyles=(0,_styledComponents.css)(_templateObject||(_templateObject=(0,_taggedTemplateLiteralLoose2.default)(["\n  padding-top: ",";\n  padding-right: ",";\n  padding-bottom: ",";\n  font-size: ",";\n  font-weight: ",";\n  color: ",";\n  text-decoration-line: ",";\n  text-transform: ",";\n  width: ",";\n  text-align: ",";\n  font-family: ",";\n"])),function(props){return(0,_ramda.propOr)(0,'paddingTop',props);},function(props){return(0,_ramda.propOr)(0,'paddingRight',props);},function(props){return(0,_ramda.propOr)(0,'paddingBottom',props);},function(props){return(0,_ramda.propOr)(FONT_SIZE,'fontSize',props);},function(props){return(0,_ramda.propOr)('300','fontWeight',props);},function(props){return(0,_ramda.propOr)(_commons.Colors.primaryText,'color',props);},function(props){return(0,_ramda.propOr)('none','textDecorationLine',props);},function(props){return(0,_ramda.propOr)('none','textTransform',props);},function(props){return(0,_ramda.propOr)('auto','width',props);},function(props){return(0,_ramda.propOr)('auto','textAlign',props);},function(props){return(0,_ramda.propOr)(_commons.Fonts.TTCommons.regular,'fontFamily',props);});var headingStyles=(0,_styledComponents.css)(_templateObject2||(_templateObject2=(0,_taggedTemplateLiteralLoose2.default)(["\n  font-family: ",";\n"])),function(props){return(0,_ramda.propOr)(_commons.Fonts.TTCommons.bold,'fontFamily',props);});var appTextStyles=(0,_styledComponents.css)(_templateObject3||(_templateObject3=(0,_taggedTemplateLiteralLoose2.default)(["\n  padding-left: ",";\n  margin-top: ",";\n"])),function(props){return(0,_ramda.propOr)(0,'paddingLeft',props);},function(props){return(0,_ramda.propOr)(0,'marginTop',props);});var extraSmallTextStyles=(0,_styledComponents.css)(_templateObject4||(_templateObject4=(0,_taggedTemplateLiteralLoose2.default)(["\n  font-size: ",";\n"])),_commons.Fonts.size.extraSmall);var sectionTitleStyles=(0,_styledComponents.css)(_templateObject5||(_templateObject5=(0,_taggedTemplateLiteralLoose2.default)(["\n  font-size: ",";\n  font-family: ",";\n  text-align: ",";\n  flex-direction: row;\n  color: ",";\n"])),function(props){return(0,_ramda.propOr)(_commons.Fonts.size.regular,'fontSize',props);},_commons.Fonts.TTCommons.bold,function(props){return(0,_ramda.propOr)('left','textAlign',props);},function(props){return(0,_ramda.propOr)('black','color',props);});var appScreenTitleStyles=(0,_styledComponents.css)(_templateObject6||(_templateObject6=(0,_taggedTemplateLiteralLoose2.default)(["\n  margin-top: ",";\n  font-size: ",";\n  font-family: ",";\n"])),function(props){return(0,_ramda.propOr)(0,'marginTop',props);},function(props){return(0,_ramda.propOr)(_commons.Fonts.size.h1,'size',props);},_commons.Fonts.TTCommons.bold);var appSectionTitleStyles=(0,_styledComponents.css)(_templateObject7||(_templateObject7=(0,_taggedTemplateLiteralLoose2.default)(["\n  font-size: ",";\n  font-weight: ",";\n  font-family: ",";\n  color: ",";\n"])),_commons.Fonts.size.h2,FONT_WEIGHT,_commons.Fonts.TTCommons.bold,function(props){return(0,_ramda.propOr)(_commons.Colors.primaryText,'color',props);});var errorTextStyles=(0,_styledComponents.css)(_templateObject8||(_templateObject8=(0,_taggedTemplateLiteralLoose2.default)(["\n  color: ",";\n  font-size: ",";\n  font-weight: 300;\n"])),function(props){return(0,_ramda.propOr)(_commons.Colors.error,'color',props);},_commons.Fonts.size.small);var buttonLabelStyles=(0,_styledComponents.css)(_templateObject9||(_templateObject9=(0,_taggedTemplateLiteralLoose2.default)(["\n  font-size: ",";\n  color: ",";\n  font-family: ",";\n  font-weight: ",";\n  text-align: center;\n"])),_commons.Fonts.size.medium,function(props){return(0,_ramda.propOr)(_commons.Colors.white,'color',props);},_commons.Fonts.TTCommons.bold,_commons.APP_CONSTANTS.IS_ANDROID?'400':'bold');var AppText=(0,_native.default)(_Text)(_templateObject10||(_templateObject10=(0,_taggedTemplateLiteralLoose2.default)(["\n  ","\n  ","\n"])),baseStyles,function(_ref){var kind=_ref.kind;switch(kind){case'Heading':return headingStyles;case'ExtraSmall':return extraSmallTextStyles;case'SectionTitle':return sectionTitleStyles;case'AppScreenTitle':return appScreenTitleStyles;case'AppSectionTitle':return appSectionTitleStyles;case'Error':return errorTextStyles;case'ButtonLabel':return buttonLabelStyles;default:return appTextStyles;}});exports.AppText=AppText;
//# sourceMappingURL=AppText.js.map