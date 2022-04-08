import * as React from "react";
import { ImageBackground, ActivityIndicator } from "react-native";
import imageCacheHoc from "react-native-image-cache-hoc";

import { Colors } from "Themes";

const options = {
  validProtocols: ["http", "https"],
  defaultPlaceholder: {
    component: ActivityIndicator,
    props: {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      animating: true,
      color: Colors.primary,
    },
  },
};

const CacheableImage = imageCacheHoc(ImageBackground, options);

export const clearImagesCache = () => CacheableImage.flush();
export default CacheableImage;
