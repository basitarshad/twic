## Checklist for release prod builds

To upload builds to IOS and Android for production, after merging development into forma_release_configs branch check the following steps:

1. For ios change Product Scheme to release from `Xcode`.
2. Increment ios build number `(from Xcode)` and android versionCode from `android/app/build.gradle` file.
3. Check `api.config `file to see url should be `twic.ai`.
4. BrainTree prod key enabled from `braintree.actions.ts` file.
5. Bugsnag prod configs enabled for ios and android from `BugsnagAnalytics.ts` file (development and production envs).
6. Amplitude prod key enabled + APIs to log events from `AmplitudeAnalytics` file.
7. CodePush ios (Info.plist file) + android (strings.xml file) production keys.
8. Plaid Action sheet prod key should be enabled from `PlaidActionSheet.tsx` file.
9. FetchVersionService should be enabled from `FetchVersionService.ts` file.
10. APPLICATION_ID & SEARCH_API_KEY keys should be enabled from `marketplaceVendors.api.ts` file (algolia).
11. Check Api Key for stripe in `stripe.api.ts` function `createTokenWithBankAccount`.
12. Source Maps for ios and android to be pushed from forma_release_configs. This needs to be done before making the ios and android apps live.
