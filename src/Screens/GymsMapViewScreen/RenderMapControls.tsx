import * as React from "react";

import { Colors } from "../../Themes";
import { MapSearchBar } from "./MapSearchBar/MapSearchBar";
import { MapControlsContainer } from "./StyledComponents";

export const RenderMapControls = (props) => {
  const { currentSnapIndex } = props;
  const containerStyle = currentSnapIndex === "full" && {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  };
  return (
    <MapControlsContainer style={containerStyle}>
      <MapSearchBar {...props} />
    </MapControlsContainer>
  );
};
