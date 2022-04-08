import * as React from "react";
import { Image, View } from "react-native";
import { If } from "react-if";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import { SecondaryButton } from "twic_mobile_components";
import styled from "styled-components";

import { AppText, AppAlert } from "Components";
import { Colors, Fonts, Images } from "Themes";
import { createFormData } from "Utils";
import UploadSvgIcon from "Components/SvgIcons/UploadSvgIcon";

import { useProfileContext } from "./ProfileProvider";
import { CompleteMainLayout } from "./Style";
import { toggleStatusBarTheme } from "../../../Hooks";

const { useState, useRef } = React;

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

const ImageContainer = styled(View)`
  margin-top: 20px;
  margin-bottom: 20px;
  align-items: center;
`;

const getImagePath = (formDataImage) => formDataImage?._parts[0][1].uri;

export const Avatar = () => {
  const { updateProfileData, openNextForm, imageData } = useProfileContext();
  const [avatarUrl, setAvatarUrl] = useState(imageData ? getImagePath(imageData) : undefined);
  const [error, setError] = useState("");
  const actionSheetRef = useRef(null);

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
          const data = createFormData({
            data: {
              file: {
                uri: image.path,
                name: getFileName(image),
                type: image.mime,
              },
            },
          });
          setAvatarUrl(image.path);
          setError("");
          updateProfileData("SET_IMAGE_DATA", data);
        })
        .catch(() => {
          setError("Please upload an image");
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
  const nextBtnHandler = () => {
    openNextForm();
  };

  return (
    <CompleteMainLayout disabledNextButton={!avatarUrl} progressPercentage={"97%"} title="Let’s finish setting up your Forma benefits account." description=" Upload a profile photo." nextBtnHandler={nextBtnHandler}>
      <ImageContainer>
        <Image source={avatarUrl ? { uri: avatarUrl } : Images.defaultAvatar} style={{ width: 120, height: 120, marginTop: 70, borderRadius: 60 }} />
        <View style={{ marginTop: 40 }} />
        <SecondaryButton
          customIcon={() => <UploadSvgIcon fillColor={Colors.newBlue} />}
          buttonStyle={{ borderWidth: 1, borderColor: Colors.newDimGrey, paddingRight: 20 }}
          labelStyle={{ color: Colors.newBlue, fontSize: Fonts.size.medium, fontFamily: "TTCommons-DemiBold", paddingLeft: 15, fontWeight: "bold", paddingRight: 5 }}
          shadowOptions={{ width: "0%", height: 0 }}
          width={"85%"}
          onClickHandler={openActionSheet}
          buttonLabel="Upload Image"
        />
        <If condition={!!error}>
          <AppText color={Colors.error} paddingTop={5}>
            {error}
          </AppText>
        </If>
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
      </ImageContainer>
    </CompleteMainLayout>
  );
};
