import * as React from "react";
import { View } from "react-native";
import { useBackHandler } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/core";

import { NavigationService } from "Services";
import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";

import { ProfileProvider, useProfileContext, ScreenNamePerIndex } from "./ProfileProvider";
import { Avatar } from "./Avatar";
import { UserName } from "./UserName";
import { PersonalEmail } from "./PersonalEmail";
import { UserPassword } from "./UserPassword";
import { ActivateAccount } from "./ActivateAccount";

const CompleteProfile = () => {
  const navigation = useNavigation();
  const { currentViewIndex, openPreviousForm } = useProfileContext();
  const [localViewIndex, setLocalViewIndex] = React.useState(0);

  //  back-arrow visibility and handler logic
  const backHandler = React.useCallback(() => {
    if (currentViewIndex > 0) {
      openPreviousForm();
    } else NavigationService.goBackToPreviousScreen();
  }, [currentViewIndex]);
  React.useEffect(() => {
    navigation.setOptions({ headerLeft: () => <SimpleHeaderBackHandler marginLeft={16} backhandler={backHandler} /> });
  }, [backHandler]);
  useBackHandler(() => {
    backHandler();
    return true;
  });
  // logic to change views
  React.useEffect(() => {
    if (currentViewIndex === localViewIndex) return;
    if (currentViewIndex > localViewIndex) {
      setLocalViewIndex(localViewIndex + 1);
    } else {
      setLocalViewIndex(localViewIndex - 1);
    }
  }, [currentViewIndex, localViewIndex]);
  const renderSection = React.useMemo(() => {
    const screenName = ScreenNamePerIndex[currentViewIndex];
    switch (screenName) {
      case "Avatar":
        return <Avatar />;
      case "UserName":
        return <UserName />;
      case "PersonalEmail":
        return <PersonalEmail />;
      case "UserPassword":
        return <UserPassword />;
      case "ActivateAccount":
        return <ActivateAccount />;
      default:
        null;
    }
  }, [currentViewIndex]);

  return <View style={{ flex: 1, marginTop: 10 }}>{renderSection}</View>;
};

const CompleteProfileScreen = () => {
  return (
    <ScreenWrapper scrollView={false} newDesignSystem>
      <ProfileProvider>
        <CompleteProfile />
      </ProfileProvider>
    </ScreenWrapper>
  );
};

export default CompleteProfileScreen;
