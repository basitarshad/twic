import * as React from "react";
import { pathOr } from "ramda";

import { ScreenContainer } from "../../Components";
import { MapView } from "./MapView";

const GymsMapViewScreen = (props) => {
  const navigationParams = pathOr({}, ["route", "params"], props);

  return (
    <ScreenContainer>
      <MapView navigationParams={navigationParams} />
    </ScreenContainer>
  );
};

export default GymsMapViewScreen;
