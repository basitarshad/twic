## React-native Setup:

1. Install home-brew by running this command in terminal `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"`
2. Once homeBrew is installed. Run the following commands to install Node Watchman, JRE, JDK and React-Native CLI
   - `brew install node`
   - `brew install watchman`
   - `brew tap AdoptOpenJDK/openjdk`
   - `brew cask install adoptopenjdk8`
   - `npm install -g react-native-cli`

#### For IOS:

1. You have to install Xcode from App Store.
2. Once Xcode is installed, install cocapods with this command in terminal `sudo gem install cocoapods`

#### For Android:

1. **[Download Android studio](https://developer.android.com/studio/index.html?source=post_page---------------------------)**.
2. Once downloaded, open android studio and goto Configure > SDK Manager.
3. Go to Appearance & Behavior → System Settings → Android SDK and check ✅ the box of latest version from Hide Obsolete Packages.
4. Also check ✅ the boxes of below in Show package details,
   - Android SDK Platform 28
   - Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image.
5. Click “Apply” to download and install the Android SDK and related build tools.
6. Set up environment variables to getting start with native code, Open terminal and run following commands:-
   - `cd ~/`
   - `touch ~/.bash_profile`
   - `open -e .bash_profile`
7. Once .bash_profile is opened, paste the following lines:-
   - `export ANDROID_HOME=$HOME/Library/Android/sdk`
   - `export ANDROID_HOME=$HOME/Library/Android/sdk`
   - `export PATH=$PATH:$ANDROID_HOME/emulator`
   - `export PATH=$PATH:$ANDROID_HOME/tools`
   - `export PATH=$PATH:$ANDROID_HOME/tools/bin`
   - `export PATH=$PATH:$ANDROID_HOME/platform-tools`
8. Once all steps are done, then you can create android emulator(AVD) to run the app on device.. for that you have to follow the following steps:-
   - Open Android Studio.
   - Goto the Configure > AVD Manager- Create Virtual Device > pick any Phone from the list and click “Next”.
   - Click “Next” then “Finish” to create your AVD. At this point you should be able to click on the green triangle button next to your AVD to launch it , then proceed to the next step.

## Twic App Setup:

1. Clone the project from twic GitHub Repo.
2. Goto your twic repo project folder through terminal and run the following command:-
   - `git checkout development`
   - `npm install`
   - `npm run clean-pods`
   - `npm run compile` (to create dist folder because our app runs from dist)
3. Install (v12.18.3) node versions and (6.14.6) npm version.
4. Once all commands are done, now you are good to run project on iOS and Android

#### For IOS:

1. Open Xcode
2. Goto Preferences > Accounts login with your credentials
3. Goto Signing & Capabilities. Create provisioning profile and Signing Certificate.
4. Now run app from Xcode play button or by following command in terminal npm run ios:dev.

#### For Android:

1. Open Android Studio
2. Sync grade by importing twic project Android folder in Android Studio
3. Once synced, now you can run app on AVD emulator or Real android device by running following command in terminal npm run android:dev
