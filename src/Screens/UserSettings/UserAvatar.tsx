import * as React from "react";
import { View } from "react-native";
import { Avatar } from "react-native-elements";
import ImagePicker from "react-native-image-crop-picker";
import { connect } from "react-redux";
import ActionSheet from "react-native-actionsheet";
import { SecondaryButton } from "twic_mobile_components";

import { RowContainer, AppSectionTitle, AppText, AppAlert } from "Components/Commons";
import { Metrics, Colors, Fonts } from "Themes";
import { createFormData } from "Utils";
import { uploadUserAvatar } from "Actions";
import { UploadSvgIcon } from "Components/SvgIcons";
import { toggleStatusBarTheme } from "../../Hooks";

// options for the error dialog
const getAvatarErrorAlertOptions = (response) => ({
  title: `Error`,
  message: response.error,
  alertActions: [
    {
      text: "Ok",
      onPress: () => console.log(response.error),
    },
  ],
});

const UserAvatarContent = (props) => {
  const { userProfile, updateAvatar } = props;
  const { userInfo } = userProfile;
  const actionSheetRef = React.useRef(null);

  const [avatarUrl, setAvatarUrl] = React.useState(undefined);

  React.useEffect(() => {
    setAvatarUrl(userInfo.avatarUrl);
  }, [userInfo.avatarUrl]);

  const getFileName = (response) => {
    if (!response) return "";
    try {
      const { filename: fileName, path } = response;
      const nameFromURI = path.substring(path.lastIndexOf("/") + 1);
      return fileName || nameFromURI;
    } catch (e) {
      return "";
    }
  };

  const handleAvatarSelection = (index: number) => {
    const pickFunctionName = (index: number) => {
      if (index === 0) return "openCamera";
      else if (index === 1) return "openPicker";
      return "openPicker";
    };

    const pickerFunction = pickFunctionName(index);

    try {
      ImagePicker[pickerFunction]({
        includeBase64: true,
      })
        .then((image: any) => {
          // MAKE CHANGE FOR VIDEO
          const data = createFormData({
            data: {
              file: {
                uri: image.path,
                name: getFileName(image),
                type: image.mime,
              },
            },
          });
          setAvatarUrl(undefined);
          updateAvatar(data);
        })
        .catch((err) => {
          // AppAlert(getAvatarErrorAlertOptions(err));
        });
    } catch (error) {
      AppAlert(getAvatarErrorAlertOptions({ error }));
    }
  };

  const openActionSheet = () => {
    //@ts-ignore
    actionSheetRef.current.show();
    toggleStatusBarTheme("upload");
  };

  return (
    <View>
      {/* avatar */}
      <RowContainer
        style={{
          marginVertical: 2,
          position: "relative",
        }}
      >
        <Avatar
          size={70}
          rounded
          // icon={{ name: 'user', type: 'font-awesome' }}
          title={userInfo.initials}
          source={{ uri: avatarUrl }}
          containerStyle={{ justifyContent: "center" }}
        />

        <View style={{ marginLeft: Metrics.doubleBaseMargin * 1.5 }}>
          {/* name */}
          <AppSectionTitle ellipsizeMode="tail" numberOfLines={1}>
            {userInfo.fullName}
          </AppSectionTitle>
          {/* email */}
          <AppText ellipsizeMode="tail" numberOfLines={1} testID="email-address" accessibilityLabel="email-address">
            {userInfo.email}
          </AppText>
        </View>
      </RowContainer>

      {/* upload avatar button */}
      <View style={{ marginTop: Metrics.baseMargin + 5, alignItems: "flex-start", marginLeft: 2 }}>
        <SecondaryButton
          onClickHandler={openActionSheet}
          buttonLabel="Replace Image"
          customIcon={() => (
            <View style={{ paddingRight: 10 }}>
              <UploadSvgIcon fillColor={Colors.newBlue} height={16} width={16} />
            </View>
          )}
          labelStyle={{
            fontWeight: "bold",
            fontFamily: "TTCommons-DemiBold",
            fontSize: Fonts.size.medium,
            color: Colors.newBlue,
            textAlign: "center",
          }}
          buttonStyle={{ height: 30, borderRadius: 7, paddingTop: 0, paddingBottom: 0, borderColor: Colors.newDimGrey, borderWidth: 1 }}
          width={Metrics.screenWidth / 2.25}
          testId="upload-receipt-button"
        />
      </View>
      <ActionSheet
        ref={actionSheetRef}
        title={"Select Picture"}
        options={["Take Photo", "Choose from Library", "Cancel"]}
        cancelButtonIndex={2}
        onPress={(index) => {
          toggleStatusBarTheme("light");
          if (index === 0 || index === 1) handleAvatarSelection(index);
        }}
      />
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateAvatar: (data) => dispatch(uploadUserAvatar(data)),
  };
};

export const UserAvatar = connect(mapStateToProps, mapDispatchToProps)(UserAvatarContent);
