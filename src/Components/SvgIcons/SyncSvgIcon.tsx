import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
import { Colors } from "../../Themes";

const SyncSvgIcon = (props) => {
  const { fillColor = Colors.charcoalDarkGrey } = props;

  return (
    <Svg width="21" height="20" viewBox="0 0 21 20">
      <G fill="none" fill-rule="evenodd">
        <G>
          <G>
            <G>
              <G>
                <G>
                  <Path
                    stroke={fillColor}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.3"
                    d="M14.793 14.961c2.603-2.603 2.603-6.824 0-9.428-.949-.948-2.112-1.551-3.333-1.808M5.24 5.409c-2.603 2.603-2.603 6.824 0 9.428.948.948 2.112 1.551 3.333 1.809"
                    transform="translate(-153 -655) translate(30 248) translate(0 236) translate(0 158) translate(123.109 13)"
                  />
                  <Path
                    fill={fillColor}
                    d="M15.889 13.875l-.59 2.946c-.084.424-.608.583-.914.277l-2.357-2.357c-.306-.306-.147-.83.277-.915l2.946-.589c.38-.076.714.259.638.638zM5.647 3.273L8.004 5.63c.306.305.148.829-.276.914l-2.947.589c-.379.076-.713-.258-.637-.637l.59-2.947c.084-.424.607-.582.913-.276z"
                    transform="translate(-153 -655) translate(30 248) translate(0 236) translate(0 158) translate(123.109 13) rotate(45 10.016 10.185)"
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

export default SyncSvgIcon;
