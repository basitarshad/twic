## Checklist for amplitude events

1- `Claim Details Viewed` event is logged when user opens a claim. File is `ReimbursementDetailScreen.tsx`.
2- `Claims List Viewed` event is logged when user opens `transation` tab from bottom tabs. File is `ClaimsListingSection.tsx`.
3- `New Claim Viewed` event is logged when user opens add claim form. File is `NewReimbursementsScreen.tsx`.
4- `Submit Reimbursement` event is logged when user submits a new claim. File is `transactions.actions.ts`.
5- `Payments Viewed` event is logged when user opens payments screen. File is `PaymentsScreen.tsx`.
6- `Twic Card Viewed` event is logged when user opens twic card screen. File is `TwicCardsScreen.tsx`.
7- `Store Viewed` event is logged when user opens home screen. File is `HomeScreen.tsx`.
8- `Accounts Viewed` event is logged when user opens account detail page from `accounts` tab in bottom tabs. File is `PostTaxAccountDetailScreen.tsx or PreTaxAccountDetailScreen.tsx`.
9- `Merchant product viewed` event is logged when user open any product. File is `MerchantDetailsScreen.tsx`.
10- `Checkout started` event is logged when user clicks checkout button on product detail screen. File is `FooterSection.tsx`.
11- `Checkout completed` event is logged when user when checkout is completed. File is `checkout.actions.ts`.

`AmplitudeAnalytics.ts` file is a central file where all the events actions are created
