## Android, IOS environment updates

#### Description

- There were some outdated gradle versions, libraries which were needed in order to create android dev and release builds with minimum time slot.
- For IOS, xcode 13 was getting warning for of `build creation with legacy`, which is suppressed

## Changes in android:

1- Updations in `android/build.gradle` files:

- buildToolsVersion = "30.0.2"
- androidXCore = "1.3.0"
- kotlinVersion = "1.4.31"
- classpath("com.android.tools.build:gradle:4.2.0")
- compileSdkVersion = 30
- buildToolsVersion = "30.0.2"
- Added `mavenCentral()`
- Sequence of repositories to download the artifacts is:

  - google()
  - mavenCentral()
  - jCenter()

  This change is done so that when downloading the artifacts for android precedence is give to google then mavenCentral and then jCenter

2- Updations in `gradle-wrapper.properties`:

- distributionUrl=https\://services.gradle.org/distributions/gradle-6.7.1-all.zip (Updated Gradle)

## Changes in IOS:

1- Updations in `WorkspaceSettings.xcsettings` files:

- <key>DisableBuildSystemDeprecationDiagnostic</key>
  <true/>

This key is added to suppress the error for `build with legacy`

## Changes in libraries:

1- Removed libraries:

- react-native-autocomplete-input
- react-native-communications
- react-native-linear-gradient
- react-native-picker

2- Updated libraries:

- @react-native-firebase/app
- @react-native-firebase/messaging
- lottie-react-native
- react-if
- react-native-background-fetch
- react-native-modal
- react-native-simple-toast
- react-native-vector-icons
