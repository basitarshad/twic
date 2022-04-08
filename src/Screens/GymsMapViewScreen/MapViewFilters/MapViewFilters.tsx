import * as React from "react";

import { useMapViewContext } from "../MapViewContext";
import { AppDrawer } from "../../../Components/Commons";
import { MapViewActivitiesDrawer } from "./MapViewActivitiesDrawer";

export const MapViewFilters = () => {
  const { state, dispatcher } = useMapViewContext();
  const { isDrawerOpen = false } = state || {};

  const closeDrawer = () => {
    dispatcher({ type: "TOGGLE_ACTIVITIES_DRAWER", payload: false });
  };

  return (
    <AppDrawer
      // drawerHeight={Metrics.screenHeight / 2}
      isDrawerOpen={isDrawerOpen}
      onCloseHandler={closeDrawer}
      DrawerContent={() => <MapViewActivitiesDrawer />}
    />
  );
};
