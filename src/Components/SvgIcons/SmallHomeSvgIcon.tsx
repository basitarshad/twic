import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
import { SvgIconType } from "../../types";

const SmallHomeSvgIcon = (props: SvgIconType) => {
  const { fillColor = "#22222D" } = props;

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <G fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <G stroke={fillColor} stroke-width="1.3">
          <G>
            <G>
              <G>
                <G>
                  <G>
                    <Path
                      d="M12.907 4.734l5.805 5.333c.184.168.288.406.288.654v7.33c0 .246-.199.445-.444.445l-4.89-.001v-5.442h-3.333v5.442H5.444c-.245 0-.444-.198-.444-.444v-7.304c0-.264.117-.514.32-.683l6.416-5.357c.342-.286.843-.274 1.17.027z"
                      transform="translate(-30 -483) translate(0 288) translate(30 67) translate(0 25) translate(0 97) translate(0 6)"
                    />
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

export default SmallHomeSvgIcon;
