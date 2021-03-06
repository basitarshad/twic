import * as React from "react";
import Svg, { G, Path, Defs, Mask, Use, Circle } from "react-native-svg";

const MaximizeBenefits = (props) => {
  const { fillColor } = props;

  return (
    <Svg width="60" height="60" viewBox="0 0 60 60">
      <Defs>
        <Path id="m7v3y13kga" d="M0 0H64V64H0z" />
      </Defs>
      <G fill="none" fill-rule="evenodd">
        <G>
          <G>
            <G>
              <G transform="translate(-375 -761) translate(335 180) translate(40 460) translate(0 121)">
                <Mask id="nl83sb36pb" fill="#fff">
                  <Use xlinkHref="#m7v3y13kga" />
                </Mask>
                <Path fill="#FFF3EE" d="M16 3L27.258 9.5 27.258 22.5 16 29 4.742 22.5 4.742 9.5zM41.5 39L52.325 45.25 52.325 57.75 41.5 64 30.675 57.75 30.675 45.25z" mask="url(#nl83sb36pb)" />
                <G stroke="#F46565" mask="url(#nl83sb36pb)">
                  <G transform="translate(15 13)">
                    <Path d="M13.907 28.715l10.429 1.042c.61.062 1.065.593 1.03 1.205l-.047.844c-.034.608-.536 1.082-1.145 1.082h-6.347c-.587 0-1.064.477-1.064 1.065 0 .2.057.398.165.568l.183.173c.21.333.576.534.97.534h4.327c.1 0 .198-.013.295-.039l9.545-1.48c.592-.159 1.2.193 1.358.785.022.084.034.17.037.256l.017.633c.012.466-.26.894-.687 1.08l-11.56 5.058c-.201.088-.423.117-.64.082L7.816 39.527c-.55-.088-.957-.558-.965-1.115L6.76 32.11c-.007-.482.288-.917.739-1.088l5.887-2.238c.166-.063.344-.087.521-.07zm-10.06 2.33c.632 0 1.146.514 1.146 1.147v6.746c0 .633-.514 1.146-1.147 1.146h-2.7C.513 40.084 0 39.571 0 38.938v-6.746c0-.633.513-1.146 1.146-1.146h2.7z" />
                    <Circle cx="17" cy="11.004" r="11.004" />
                    <Path d="M17 4L17 6.5M17 15L17 17.5M19.5 9c0-1.667-.833-2.5-2.5-2.5-2.058 0-3 1.272-3 2.26 0 1.641 1.158 2.247 2.997 2.244 1.838-.004 2.996.21 2.996 2.195 0 1.5-1.493 2.301-2.993 2.301-1.667 0-2.667-.711-3-2.133" />
                  </G>
                </G>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default MaximizeBenefits;
