import * as React from "react";
import Svg, { G, Path, Defs, Mask, Use } from "react-native-svg";

const ReceiptsSvgIcon = (props) => {
  const { fillColor } = props;

  return (
    <Svg width="60" height="60" viewBox="0 0 60 60">
      <Defs>
        <Path id="g3l7068upa" d="M0 0H64V64H0z" />
      </Defs>
      <G fill="none" fill-rule="evenodd">
        <G>
          <G>
            <G transform="translate(-375 -640) translate(335 180) translate(40 460)">
              <Mask id="ymjzdg0bpb" fill="#fff">
                <Use xlinkHref="#g3l7068upa" />
              </Mask>
              <Path fill="#FFF3EE" d="M47 9L58.258 15.5 58.258 28.5 47 35 35.742 28.5 35.742 15.5zM19 35L27.66 40 27.66 50 19 55 10.34 50 10.34 40z" mask="url(#ymjzdg0bpb)" />
              <G stroke="#F46565" stroke-linecap="round" stroke-linejoin="round" mask="url(#ymjzdg0bpb)">
                <G>
                  <Path
                    d="M34.545 0L34.545 3.455 34.545 34.545 34.545 38 31.091 34.545 27.636 38 24.182 34.545 20.727 38 17.273 34.545 13.818 38 10.364 34.545 6.909 38 3.455 34.545 0 38 0 34.545 0 3.455 0 0 3.455 3.455 6.909 0 10.364 3.455 13.818 0 17.273 3.455 20.727 0 24.182 3.455 27.636 0 31.091 3.455zM6.514 11.577L25.514 11.577M6.514 18.781L20.908 18.781M6.514 25.971L16.302 25.971"
                    transform="translate(15 13)"
                  />
                </G>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default ReceiptsSvgIcon;
