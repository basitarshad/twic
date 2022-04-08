import  {Colors}  from "Themes";

/* 
  ELEMENT SHADOW
*/
type AddElementShadow = {
  shadowColor?: string;
  backgroundColor?: string;
  shadowOffset?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
};
export const AddElementShadow = (options?: AddElementShadow): string => {
  const { shadowColor = Colors.charcoalDarkGrey, shadowOffset = "0px 2px", shadowOpacity = 0.4, shadowRadius = 1, elevation = 2, backgroundColor = Colors.white } = options || {};
  return `
    background-color: ${backgroundColor};
    shadow-color: ${shadowColor};
    shadow-offset: ${shadowOffset};
    shadow-opacity: ${shadowOpacity};
    shadow-radius: ${shadowRadius};
    elevation: ${elevation};
  `;
};
