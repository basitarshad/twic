#create sourcemap folders and set API KEY and APP VERSION

mkdir -p sourcemap/debug/ios
IOS_DEBUG_BUNDLE="sourcemap/debug/ios/ios-debug.bundle"
IOS_DEBUG_BUNDLE_MAP="sourcemap/debug/ios/ios-debug.bundle.map"
API_KEY="b3ad21a68a260479a5705412b28149dd"

IOS_APP_VERSION=$(sed -n '/MARKETING_VERSION/{s/MARKETING_VERSION = //;s/;//;s/^[[:space:]]*//;p;q;}' ios/twicMobileRevamp.xcodeproj/project.pbxproj)
IOS_BUILD_NUMBER=$(sed -n '/CURRENT_PROJECT_VERSION/{s/CURRENT_PROJECT_VERSION = //;s/;//;s/^[[:space:]]*//;p;q;}' ios/twicMobileRevamp.xcodeproj/project.pbxproj)

APP_VERSION="id-$IOS_APP_VERSION-b$IOS_BUILD_NUMBER"
echo "=> bugsnag sourcemap version : $APP_VERSION"

echo "=> bugsnag generating sourcemap"
Download debug source maps from Metro bundler
curl "http://localhost:8081/index.bundle?platform=ios&dev=true&minify=false" > $IOS_DEBUG_BUNDLE
curl "http://localhost:8081/index.bundle.map?platform=ios&dev=true&minify=false" > $IOS_DEBUG_BUNDLE_MAP

echo "=> bugsnag uploading sourcemap"
# Upload source maps to Bugsnag, making sure to specify the correct app-version.
curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
   -F apiKey=$API_KEY \
   -F codeBundleId=$APP_VERSION \
   -F dev=true \
   -F overwrite=true \
   -F platform=ios \
   -F sourceMap=@$IOS_DEBUG_BUNDLE_MAP \
   -F bundle=@$IOS_DEBUG_BUNDLE
