import * as React from "react";
import Svg, { Path, G } from "react-native-svg";

const EditSvgIcon = (props) => {
  const { fillColor = "#528BEF", height="24",width="24"} = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <G fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <G stroke={fillColor} stroke-width="2">
          <G>
            <G>
              <G>
                <G>
                  <Path
                    d="M12.265 2c1.252 0 2.266 1.014 2.266 2.265V16.5h0H10V4.265C10 3.015 11.014 2 12.265 2zm-2.24 14.468h4.486l-2.246 4.845-2.24-4.845z"
                    transform="translate(-301 -552) translate(30 428) translate(0 92) translate(20 20) translate(251 12) rotate(45 12.265 11.656)"
                  />
                </G>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
}
export default EditSvgIcon;
