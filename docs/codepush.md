## Install App center CLI Globally

To upload builds to IOS and Android through codepush you need to install App Center CLI with the following Commands:

1. **Install APP Center CLI.** - `npm install -g appcenter-cli`
2. **Login APP Center.** - `appcenter login`
3. **Check APP Center installed.** - `appcenter profile list`

### Upload builds

Make sure, you are in twic project directory, merge your fix into `development` and `codepush_forma_dev_env` branches and then merge `codepush_forma_dev_env` branch into `forma_release_configs` branch.

#### To Upload On Android

1. **Run Command.** - `npm run codepush:android`
2. Goto **[App Center Portal](https://appcenter.ms/apps)**
3. Select `android-twic`
4. Select `Distribute` -> `Codepush`
5. Select uploaded build and add release notes in that build.

#### To Upload On IOS

1. Goto `package.json` file and increment the build number for IOS in `codepush:ios` command and then
2. **Run Command.** - `npm run codepush:ios`
3. Goto **[App Center Portal](https://appcenter.ms/apps)**
4. Select `ios-twic`
5. Select `Distribute` -> `Codepush`
6. Select uploaded build and add release notes in that build.
