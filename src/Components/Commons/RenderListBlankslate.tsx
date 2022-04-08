import * as React from "react";
import { View } from "react-native";
import { ReactComponentLike } from "prop-types";
import { If, Then } from "react-if";

import { RowContainer, AppText } from "./AppStyledComponents";
import { isEmptyOrNil } from "../../Utils";

type RenderListBlankslate = {
  blankslateMessage?: string;
  actionHandler?(): React.ReactNode;
};
const RenderListBlankslate = (props: RenderListBlankslate) => {
  const { blankslateMessage = "No results found.", actionHandler = null } = props;

  return (
    <View>
      <RowContainer justifyContent="center">
        <AppText>{blankslateMessage}</AppText>
      </RowContainer>
      <If condition={!isEmptyOrNil(actionHandler) === true}>
        <Then>
          <RowContainer justifyContent="center">
            {
              //@ts-ignore
              actionHandler && actionHandler()
            }
          </RowContainer>
        </Then>
      </If>
    </View>
  );
};

export default RenderListBlankslate;
