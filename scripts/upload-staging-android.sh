#create sourcemap folders and set API KEY and APP VERSION

mkdir -p sourcemap/release/android
ANDROID_RELEASE_BUNDLE="sourcemap/release/android/android-release.bundle"
ANDROID_RELEASE_BUNDLE_MAP="sourcemap/release/android/android-release.bundle.map"
API_KEY="b3ad21a68a260479a5705412b28149dd"

ANDROID_APP_VERSION_NAME="1.1.0"
ANDROID_APP_VERSION_CODE="12"

APP_VERSION="as-$ANDROID_APP_VERSION_NAME-b$ANDROID_APP_VERSION_CODE"
echo "=> bugsnag sourcemap version : $APP_VERSION"

echo "=> bugsnag generating sourcemap"
# Generate source maps using react-native bundler
react-native bundle \
    --platform android \
    --dev false \
    --entry-file index.js \
    --bundle-output $ANDROID_RELEASE_BUNDLE \
    --sourcemap-output $ANDROID_RELEASE_BUNDLE_MAP

echo "=> bugsnag uploading sourcemap"
# Upload source maps to Bugsnag, making sure to specify the correct app-version.
curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
   -F apiKey=$API_KEY \
   -F codeBundleId=$APP_VERSION \
   -F dev=false \
   -F overwrite=true \
   -F platform=android \
   -F sourceMap=@$ANDROID_RELEASE_BUNDLE_MAP \
   -F bundle=@$ANDROID_RELEASE_BUNDLE

