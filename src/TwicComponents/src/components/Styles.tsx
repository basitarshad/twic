import { Colors } from '../commons';

type TransparentButtonsBorderType = {
  borderRadius?: number;
  borderColor?: string;
};

export const TransparentButtonsBorder = (options?: TransparentButtonsBorderType) => {
  const { borderRadius = 4, borderColor = Colors.lightBoxShadowGrey } = options || {};
  return `
  border-right-width: 1;
  border-left-width: 1;
  border-bottom-width: 1;
  border-top-width: 0.25;
  border-radius: ${borderRadius};
  border-color: ${borderColor}`;
};

/*
  ELEMENT SHADOW
*/
type AddElementShadowType = {
  shadowColor?: string;
  backgroundColor?: string;
  shadowOffset?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
};
export const AddElementShadow = (options?: AddElementShadowType): string => {
  const { shadowColor = Colors.charcoalDarkGrey, shadowOffset = '0px 2px', shadowOpacity = 0.4, shadowRadius = 1, elevation = 2, backgroundColor = Colors.white } = options || {};
  return `
    background-color: ${backgroundColor};
    shadow-color: ${shadowColor};
    shadow-offset: ${shadowOffset};
    shadow-opacity: ${shadowOpacity};
    shadow-radius: ${shadowRadius};
    elevation: ${elevation};
  `;
};
