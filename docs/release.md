## Release Configurations

To upload builds to IOS and Android for production:

1. Merge development to forma_release_configs Branch.
2. Follow `checklist.md` document in project directory docs folder.
3. Before uploading builds on App store and Play Store, Upload Sourcemaps for IOS with command `npm upload-sourcemaps:release:ios` and Android with command: `npm upload-sourcemaps:release:android`.
4. Once Sourcemaps uploaded you can see them on **[Bugnsag Portal](https://app.bugsnag.com/twic/twicapp-mobile/errors)** for testing.
5. Create release builds for ios and android. For reference you can double check **[Release Document](https://docs.google.com/document/d/1pkOGU4M5CNXsUXUOwR9iNogZ6D1sBDq4c0kUc1P3wVU/edit#heading=h.i7yl8j2e1hq)** Steps for uploading builds.
6. Finally, you are all good with uploading Builds and Sourcemaps for production. Now you can merge your `development` branch with `codepush_forma_dev_env` and `master` branches and then create a release tag.
