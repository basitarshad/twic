import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "Themes";
import { SvgIconType } from "../../types";

export const CreditCardSvg = (props: SvgIconType) => {
  const { fillColor = Colors.newBlue } = props;
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill={fillColor}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.18 6.30002C3.18 5.90237 3.50235 5.58002 3.9 5.58002H20.1C20.4976 5.58002 20.82 5.90237 20.82 6.30002V7.62002H3.18V6.30002ZM1.62 8.40002V6.30002C1.62 5.04081 2.64079 4.02002 3.9 4.02002H20.1C21.3592 4.02002 22.38 5.04081 22.38 6.30002V8.40002V17.7C22.38 18.9592 21.3592 19.98 20.1 19.98H3.9C2.64079 19.98 1.62 18.9592 1.62 17.7V8.40002ZM20.82 9.18002V17.7C20.82 18.0977 20.4976 18.42 20.1 18.42H3.9C3.50235 18.42 3.18 18.0977 3.18 17.7V9.18002H20.82ZM16.2 12.78C15.6371 12.78 15.1806 13.236 15.18 13.7988C15.18 13.7992 15.18 13.7996 15.18 13.8C15.18 14.3633 15.6367 14.82 16.2 14.82C16.7633 14.82 17.22 14.3633 17.22 13.8C17.22 13.2367 16.7633 12.78 16.2 12.78ZM14.4 15.6484C14.8648 16.1011 15.4998 16.38 16.2 16.38C17.6249 16.38 18.78 15.2249 18.78 13.8C18.78 12.3751 17.6249 11.22 16.2 11.22C15.4998 11.22 14.8648 11.4989 14.4 11.9517C13.9352 11.4989 13.3002 11.22 12.6 11.22C11.1751 11.22 10.02 12.3751 10.02 13.8C10.02 15.2249 11.1751 16.38 12.6 16.38C13.3002 16.38 13.9352 16.1011 14.4 15.6484ZM13.62 13.8C13.62 14.3633 13.1633 14.82 12.6 14.82C12.0367 14.82 11.58 14.3633 11.58 13.8C11.58 13.2367 12.0367 12.78 12.6 12.78C13.1633 12.78 13.62 13.2367 13.62 13.8Z"
      />
    </Svg>
  );
};