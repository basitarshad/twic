import * as React from "react";

import { Metrics } from "../../Themes";
import { DividerStyle } from "./StyledComponents";

const DrawerDivider = (props: { marginTop?: number }) => {
  const { marginTop = Metrics.baseMargin + Metrics.smallMargin } = props;
  return <DividerStyle marginTop={marginTop} />;
};

export default DrawerDivider;
