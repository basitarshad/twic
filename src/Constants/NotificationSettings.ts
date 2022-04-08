const NOTIFICATION_SETTINGS = {
  transaction: {
    type: "transaction",
    channel: {
      email: false,
      push: false,
      // slack: false,
    },
    description: "Receive updates about your order or claims on Forma.",
    title: "Transactions",
  },
  // challenge: {
  //   type: 'program',
  //   channel: {
  //     email: false,
  //     push: false,
  //     //slack: false
  //   },
  //   description: 'Receive updates about your challenges on Twic.',
  //   title: "Challenges"
  // },
  card: {
    type: "card",
    channel: {
      email: false,
      push: false,
      //slack: false
    },
    description: "Receive real-time alerts for transactions made from your Forma Card.",
    title: "Forma Card",
  },
  account: {
    type: "wallet",
    channel: {
      email: false,
      push: false,
      //slack: false
    },
    description: "Receive updates about the funds in your account, including renewals and expirations.",
    title: "Accounts",
  },
};

export default NOTIFICATION_SETTINGS;
