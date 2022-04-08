import * as React from "react";
import Svg, { G, Path } from "react-native-svg";

type WalletSvgIconProps = {
  fillColor?: string;
  secondaryColor?: string;
  style?: any;
};
const WalletSvgIcon = (props: WalletSvgIconProps) => {
  return (
    <Svg width={16} height={12} viewBox="0 0 16 12" {...props}>
      <G fill="none" fillRule="evenodd">
        <Path
          fill="#E27815"
          d="M12.671 1.114c.011.067.017.135.017.202v.404c.517 0 .937.42.937.937v1.468h1.25c.345 0 .625.28.625.625V8c0 .345-.28.625-.625.625h-1.25v1.532c0 .518-.42.938-.938.938H1.438a.938.938 0 01-.937-.938v-7.5c0-.517.42-.937.938-.937l.403-.001c.136-.084.29-.144.457-.17L11.235.082a1.25 1.25 0 011.436 1.031zm-.733 4.511a.75.75 0 100 1.5.75.75 0 000-1.5z"
        />
        <Path
          fill="#22222D"
          d="M12.671 1.114c.011.067.017.135.017.202v.443a1.29 1.29 0 00-.313-.04H1.841c.136-.084.29-.144.457-.17L11.235.082a1.25 1.25 0 011.436 1.031zm2.204 3.011c.345 0 .625.28.625.625V8c0 .345-.28.625-.625.625H10.5A.625.625 0 019.875 8V4.75c0-.345.28-.625.625-.625h4.375zm-2.938 1.5a.75.75 0 100 1.5.75.75 0 000-1.5z"
          opacity={0.5}
        />
      </G>
    </Svg>
  );
};

export default WalletSvgIcon;
