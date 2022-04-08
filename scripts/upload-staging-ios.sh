#create sourcemap folders and set API KEY and APP VERSION

mkdir -p sourcemap/release/ios
IOS_RELEASE_BUNDLE="sourcemap/release/ios/ios-release.bundle"
IOS_RELEASE_BUNDLE_MAP="sourcemap/release/ios/ios-release.bundle.map"
API_KEY="b3ad21a68a260479a5705412b28149dd"

IOS_APP_VERSION=$(sed -n '/MARKETING_VERSION/{s/MARKETING_VERSION = //;s/;//;s/^[[:space:]]*//;p;q;}' ios/twicMobileRevamp.xcodeproj/project.pbxproj)
IOS_BUILD_NUMBER=$(sed -n '/CURRENT_PROJECT_VERSION/{s/CURRENT_PROJECT_VERSION = //;s/;//;s/^[[:space:]]*//;p;q;}' ios/twicMobileRevamp.xcodeproj/project.pbxproj)

APP_VERSION="is-$IOS_APP_VERSION-b$IOS_BUILD_NUMBER"
echo "=> bugsnag sourcemap version : $APP_VERSION"

echo "=> bugsnag generating sourcemap"

# Generate source maps using react-native bundler
react-native bundle \
    --platform ios \
    --dev false \
    --entry-file index.js \
    --bundle-output $IOS_RELEASE_BUNDLE \
    --sourcemap-output $IOS_RELEASE_BUNDLE_MAP

echo "=> bugsnag uploading sourcemap"
# # Upload source maps to Bugsnag, making sure to specify the correct app-version.
curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
  -F apiKey=$API_KEY \
  -F codeBundleId=$APP_VERSION \
  -F dev=false \
  -F overwrite=true \
  -F platform=ios \
  -F sourceMap=@$IOS_RELEASE_BUNDLE_MAP \
  -F bundle=@$IOS_RELEASE_BUNDLE
