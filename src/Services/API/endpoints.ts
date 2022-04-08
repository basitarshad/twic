export default {
  // legacy challenges feature endpoints
  RUNNING_CHALLENGES: `/api/challenges/running`,
  CHALLENGES: `/api/challenges/`,
  GET_CHALLENGE_BY_ID: `/api/challenges/`,
  APPLICABLE_ACTIVITIES_CHALLENGES: `/api/challenges/applicable-activity-types`,
  GET_LAST_SYNCED_ACTIVITIY_DATA: `/api/challenges/get-last-synced-data`,
  UPDATE_ACTIVITY_DATA: `/api/challenges/activity-data`,
  UPDATE_ACTIVITY_DATA_BULK: `/api/challenges/activity-data-bulk`,

  // GET_DYNAMIC_LOCATION_PRICING: `/api/v2/dynamic_location_pricing`,
  GET_DYNAMIC_LOCATION_PRICING: `api/v2/vendors/vendor-coupon-codes/location-pricings`,

  // API'S CONVERTED TO V2
  USER_PUSH_NOTIFICATION_TOKEN: `/api/v2/settings/notification/token`,
  GET_POSTTAX_WALLET_CATEGORIES: "/api/v2/claims/categories",
  USER_ACCOUNT_TRANSACTIONS_HISTORY_V2: `api/v2/employee-wallets`,
  USER_TRANSACTIONS: `api/v2/transactions`,
  USER_PRETAX_ACCOUNT_TRANSACTIONS_HISTORY_V2: `/cdh/v2/transactions`,
  GET_VENDOR_BY_TRANSACTION_ID: `api/v2/transactions`,
  SUBMIT_NEW_REIMBURSEMENT: "/api/v2/claims",
  PRETAX_EXPENSES: "cdh/v2/expenses",
  PRETAX_REIMBURSEMENT: "cdh/v2/claims",
  PRETAX_REIMBURSEMENT_RECEIPT: "cdh/v2/claims/receipts",
  USER_REIMBURSEMENTS: `api/v2/transactions?types=reimbursement`,
  CARDHOLDER_INFO: `api/v2/twic-cardholder`,
  USER_TWIC_CARD_DETAILS: `api/v2/twic-cards`,
  TWIC_CARD: `api/v2/twic-cards`,
  PRETAX_CARDS: `cdh/v2/cards`,
  USER_DEPENDENTS: `cdh/v2/dependents`,
  SEND_MAGIC_LINK: `/auth/v2/login/magic`,
  GET_IDENTITY: `auth/v2/login/identify`,
  VERIFY_MAGIC_LINK: `/auth/magic`,
  PRETAX_ACCOUNT_PLAN: `cdh/v2/accounts/pretax-plans`,
  USER_PRETAX_ACCOUNT_TRANSACTIONS_HISTORY: `cdh/v2/transactions`,
  PRETAX_ACCOUNTS: `cdh/v2/accounts`,
  USER_NOTIFICATION_SETTINGS: `api/v2/settings/notifications`,
  VENUE_ACTIVITIES: `api/v2/vendors/vendor-venues/activities`,
  GET_VENDOR_BY_ID: `api/v2/vendors/`,
  GET_VENDOR_BY_SUBSCRIPTION_ID: `api/v2/subscriptions`,
  CHECKOUT: `api/v2/transactions/checkout`,
  GET_SALES_TAX: `api/v2/transactions/sales-tax`,
  USER_SUBSCRIPTIONS: `api/v2/subscriptions?`,
  USER_ORDERS: `api/v2/transactions`,
  USER_PROFILE: `api/v2/settings/profile`,
  USER_DEMOGRAPHIC_V2: `cdh/v2/demographics`,
  CHANGE_ACCOUNT_PASSWORD: `api/v2/settings/password`,
  RESET_PASSWORD: `auth/v2/login/reset`,
  USER_CDH_DETAILS: `cdh/v2/details`,
  SINGLE_TRANSACTION: (id) => `api/v2/transactions/${id}?populate=reimbursement_history`,
  USER_COUNTRY_STATES: (countryCode) => `api/v2/metadata/countries/${countryCode}/states`,

  AUTH: `auth/v2/login/password`,
  USER_PAYMENT_DETAILS: `api/v2/settings/payment-token`,
  CANCEL_SUBSCRIPTION: (subscriptionId) => `api/v2/subscriptions/${subscriptionId}/cancel`,
  USER_WALLET_TRANSACTION_DETAILS: `api/v2/transactions`,
  USER_WALLET_TWIC_CARD_TRANSACTION_DETAILS: `api/v2/twic-card-transactions`,
  MANUAL_BANK_LINK: `api/v2/connected-accounts/manual`,
  VERIFY_MANUAL_BANK_LINK: `api/v2/connected-accounts/verify`,
  ACTIVATE_BANK_ACCOUNT: `api/v2/connected-accounts/activate`,
  CONNECT_BANK_ACCOUNT: `api/v2/connected-accounts/automatic`,
  USER_ALEGEUS_AUTHENTICATION: `api/v2/employee/alegeus/authenticate`,
  USER_SUBSCRIPTION_DETAILS: `api/v2/subscriptions/`,

  UPDATE_USER_NOTIFICATIONS_SETTINGS: `api/v2/settings/notifications`,
};
