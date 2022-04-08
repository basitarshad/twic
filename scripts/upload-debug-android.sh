#create sourcemap folders and set API KEY and APP VERSION

mkdir -p sourcemap/debug/android
ANDROID_DEBUG_BUNDLE="sourcemap/debug/android/android-debug.bundle"
ANDROID_DEBUG_BUNDLE_MAP="sourcemap/debug/android/android-debug.bundle.map"
API_KEY="b3ad21a68a260479a5705412b28149dd"

ANDROID_APP_VERSION_NAME="1.1.0"
ANDROID_APP_VERSION_CODE="1"
 
APP_VERSION="ad-$ANDROID_APP_VERSION_NAME-b$ANDROID_APP_VERSION_CODE"
echo "=> bugsnag sourcemap version : $APP_VERSION"

echo "=> bugsnag generating sourcemap"
# Download debug source maps from Metro bundler
curl "http://localhost:8081/index.bundle?platform=android&dev=true&minify=false" >$ANDROID_DEBUG_BUNDLE
curl "http://localhost:8081/index.bundle.map?platform=android&dev=true&minify=false" >$ANDROID_DEBUG_BUNDLE_MAP

echo "=> bugsnag uploading sourcemap"
# Upload source maps to Bugsnag, making sure to specify the correct app-version.
curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
   -F apiKey=$API_KEY \
   -F codeBundleId=$APP_VERSION \
   -F dev=true \
   -F overwrite=true \
   -F platform=android \
   -F sourceMap=@$ANDROID_DEBUG_BUNDLE_MAP \
   -F bundle=@$ANDROID_DEBUG_BUNDLE