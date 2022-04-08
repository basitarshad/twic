import * as React from 'react';
import { Text } from 'react-native';
import { propOr } from 'ramda';
import { css } from 'styled-components';
import styled from 'styled-components/native';

import { APP_CONSTANTS, Colors, Fonts } from '../commons';
import { AppTextProps } from './types';

const FONT_WEIGHT = APP_CONSTANTS.IS_ANDROID ? '400' : 'bold';
const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium;

const _Text = (props: AppTextProps) => (
  <Text maxFontSizeMultiplier={1.1} {...props}>
    {props.children}
  </Text>
);

const baseStyles = css`
  padding-top: ${props => propOr(0, 'paddingTop', props)};
  padding-right: ${props => propOr(0, 'paddingRight', props)};
  padding-bottom: ${props => propOr(0, 'paddingBottom', props)};
  font-size: ${props => propOr(FONT_SIZE, 'fontSize', props)};
  font-weight: ${props => propOr('300', 'fontWeight', props)};
  color: ${props => propOr(Colors.primaryText, 'color', props)};
  text-decoration-line: ${props => propOr('none', 'textDecorationLine', props)};
  text-transform: ${props => propOr('none', 'textTransform', props)};
  width: ${props => propOr('auto', 'width', props)};
  text-align: ${props => propOr('auto', 'textAlign', props)};
  font-family: ${props => propOr(Fonts.TTCommons.regular, 'fontFamily', props)};
`;

const headingStyles = css`
  font-family: ${props => propOr(Fonts.TTCommons.bold, 'fontFamily', props)};
`;

const appTextStyles = css`
  padding-left: ${props => propOr(0, 'paddingLeft', props)};
  margin-top: ${props => propOr(0, 'marginTop', props)};
`;

const extraSmallTextStyles = css`
  font-size: ${Fonts.size.extraSmall};
`;

const sectionTitleStyles = css`
  font-size: ${props => propOr(Fonts.size.regular, 'fontSize', props)};
  font-family: ${Fonts.TTCommons.bold};
  text-align: ${props => propOr('left', 'textAlign', props)};
  flex-direction: row;
  color: ${props => propOr('black', 'color', props)};
`;

const appScreenTitleStyles = css`
  margin-top: ${props => propOr(0, 'marginTop', props)};
  font-size: ${props => propOr(Fonts.size.h1, 'size', props)};
  font-family: ${Fonts.TTCommons.bold};
`;

const appSectionTitleStyles = css`
  font-size: ${Fonts.size.h2};
  font-weight: ${FONT_WEIGHT};
  font-family: ${Fonts.TTCommons.bold};
  color: ${props => propOr(Colors.primaryText, 'color', props)};
`;

const errorTextStyles = css`
  color: ${props => propOr(Colors.error, 'color', props)};
  font-size: ${Fonts.size.small};
  font-weight: 300;
`;

const buttonLabelStyles = css`
  font-size: ${Fonts.size.medium};
  color: ${props => propOr(Colors.white, 'color', props)};
  font-family: ${Fonts.TTCommons.bold};
  font-weight: ${APP_CONSTANTS.IS_ANDROID ? '400' : 'bold'};
  text-align: center;
`;

export const AppText = styled(_Text)<AppTextProps>`
  ${baseStyles}
  ${({ kind }) => {
    switch (kind) {
      case 'Heading':
        return headingStyles;
      case 'ExtraSmall':
        return extraSmallTextStyles;
      case 'SectionTitle':
        return sectionTitleStyles;
      case 'AppScreenTitle':
        return appScreenTitleStyles;
      case 'AppSectionTitle':
        return appSectionTitleStyles;
      case 'Error':
        return errorTextStyles;
      case 'ButtonLabel':
        return buttonLabelStyles;
      default:
        return appTextStyles;
    }
  }}
`;
