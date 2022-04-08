import * as React from "react";
import { useProfileContext } from "./ProfileProvider";
import { MainLayout } from "../Common";

export const CompleteMainLayout = (props) => {
  const { updateProfileData, currentViewIndex } = useProfileContext();
  const { nextBtnHandler = () => updateProfileData("SET_CURRENT_VIEW_INDEX", currentViewIndex + 1) } = props;

  return <MainLayout {...props} nextBtnHandler={nextBtnHandler} />;
};
