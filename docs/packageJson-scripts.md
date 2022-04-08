## Package.json scripts

**Android**

1. `npm run android:clean` - Clean gradle settings from android folder
2. `npm run android:release` - It will create a release build for testing and production roleout
3. `npm run android:dev` - It will create a dev build and run on emulator or physical device
4. `upload-sourcemaps:release:android` - We upload code base to bugsnag release, so that when we have a crash or bug on release we get exact location of the code base where it occured. It can be done on for debug, staging and release
5. `npm run codepush:android` - We push small changes that are made in js without going through the whole cycle of uploading a build. It can be done to staging or directly to release. Detailed information for codepush can be gathered from **codepush.md** document placed in same folder.
6. `npm run codepush:clear:android` - We push small changes that are made in js without going through the whole cycle of uploading a build. It can be done to staging or directly to release.

**Ios**

1. `npm run clean-pods` - Delete previous pods and create fresh pods whilst remaining in the root folder
2. `npm run pods` - Create pods whilst remaining in the root folder
3. `npm run ios:dev` - It will create a dev build and run on emulator or physical device
4. `upload-sourcemaps:release:ios` - We upload code base to bugsnag release, so that when we have a crash or bug on release we get exact location of the code base where it occured. It can be done on for debug, staging and release
5. `npm run codepush:ios` - We push small changes that are made in js without going through the whole cycle of uploading a build. It can be done to staging or directly to release. Detailed information for codepush can be gathered from **codepush.md** document placed in same folder.
6. `npm run codepush:clear:ios` - We push small changes that are made in js without going through the whole cycle of uploading a build. It can be done to staging or directly to release.

**Common**

1. `npm run test:watch` - Run jest testcases with watch mode on
2. `npm run test` - Run jest testcases with watch mode off
3. `npm run compile` - Delete dist folder and then re-create the dist folder. Dist folder has compiled js code which is used by both OS
