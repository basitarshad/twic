// leave off @2x/@3x
const IMAGES_DIR = "../../assets";
const images = {
  // logos
  appLogo: require(`${IMAGES_DIR}/twic-logo.png`),
  formaIcon: require(`${IMAGES_DIR}/forma-icon.png`),
  appLogoWhite: require(`${IMAGES_DIR}/twic-logo-white.png`),
  rebrandIllustration: require(`${IMAGES_DIR}/illustration1.png`),
  crossWhite: require(`${IMAGES_DIR}/cross-white.png`),
  magicLink: require(`${IMAGES_DIR}/magic-link.png`),
  emailConfirmation: require(`${IMAGES_DIR}/email-confirmation.png`),
  welcomeHero: require(`${IMAGES_DIR}/welcome-hero.png`),
  twicAnimation: require(`${IMAGES_DIR}/twic-landing.json`),
  formaLogo: require(`${IMAGES_DIR}/forma-logo.png`),
  formaStackedLight: require(`${IMAGES_DIR}/forma-stacked.png`),

  // fsastore
  twicPills: require(`${IMAGES_DIR}/twic-pills.png`),
  walgreensStore: require(`${IMAGES_DIR}/walgreens-store.png`),
  hsaStore: require(`${IMAGES_DIR}/hsa-store.png`),
  fsaStore: require(`${IMAGES_DIR}/fsa-store.png`),
  cvsPharmacy: require(`${IMAGES_DIR}/cvs-pharmacy.png`),
  amazonStore: require(`${IMAGES_DIR}/amazon-store.png`),
  arrowExternalLink: require(`${IMAGES_DIR}/arrow-external-link.png`),
  // miscellaneous
  walletIcon: require(`${IMAGES_DIR}/icon-wallet.png`),
  cameraIcon: require(`${IMAGES_DIR}/camera.png`),
  arrowRight: require(`${IMAGES_DIR}/arrow-right.png`),
  arrowBlueRight: require(`${IMAGES_DIR}/arrow-blue-right.png`),
  arrowLeft: require(`${IMAGES_DIR}/arrow-left.png`),
  activateCheckmark: require(`${IMAGES_DIR}/activate-checkmark.png`),
  illustration: require(`${IMAGES_DIR}/illustration.png`),
  circledCheckmark: require(`${IMAGES_DIR}/circled-checkmark.png`),
  penPaperSvg: require(`${IMAGES_DIR}/pen-paper.png`),
  accountCard: require(`${IMAGES_DIR}/credit-card.png`),

  cross: require(`${IMAGES_DIR}/cross.png`),
  topRight: require(`${IMAGES_DIR}/top-right.png`),
  topRightBlue: require(`${IMAGES_DIR}/top-right-blue.png`),

  // merchant detail icons
  globeIcon: require(`${IMAGES_DIR}/icon-outline-web.png`),
  faqIcon: require(`${IMAGES_DIR}/icon-faq.png`),
  lockIcon: require(`${IMAGES_DIR}/icon-lock.png`),
  trashIcon: require(`${IMAGES_DIR}/icon-trash.png`),

  // action links
  resetIcon: require(`${IMAGES_DIR}/icon-reset.png`),
  editIcon: require(`${IMAGES_DIR}/icon-edit.png`),
  plusCircle: require(`${IMAGES_DIR}/icon-plus-circle.png`),
  chevronRightIcon: require(`${IMAGES_DIR}/icon-right.png`),

  // transactions list icon
  store: require(`${IMAGES_DIR}/icon-store.png`),
  emptyDataIllustration: require(`${IMAGES_DIR}/empty-data-illustration.png`),

  // onboarding notification illustartion
  onboardingNotification: require(`${IMAGES_DIR}/onboarding-notification.png`),
  notification: require(`${IMAGES_DIR}/notification-icon.png`),
  notificationIconForma: require(`${IMAGES_DIR}/notification_icon_forma.png`),

  // status icons
  pending: require(`${IMAGES_DIR}/pending-status.png`),
  rejected: require(`${IMAGES_DIR}/rejected-status.png`),
  approved: require(`${IMAGES_DIR}/approved-status.png`),
  recurring: require(`${IMAGES_DIR}/recurring-status.png`),
  completed: require(`${IMAGES_DIR}/completed-status.png`),
  exclamationMark: require(`${IMAGES_DIR}/icon-exclamation-mark.png`),
  exclamationMarkBlack: require(`${IMAGES_DIR}/icon-exclamation-mark-black.png`),
  search: require(`${IMAGES_DIR}/search.png`),
  activeRadio: require(`${IMAGES_DIR}/radio-active.png`),
  inactiveRadio: require(`${IMAGES_DIR}/radio-inactive.png`),
  expireTimer: require(`${IMAGES_DIR}/expire-timer.png`),
  verification: require(`${IMAGES_DIR}/verification.png`),

  categoryCardPlaceholder: require(`${IMAGES_DIR}/category-card-placeholder.png`),

  // map view icons
  mapPin: require(`${IMAGES_DIR}/map_pin_inactive.png`),
  mapPinActive: require(`${IMAGES_DIR}/map_pin_active.png`),
  locationIcon: require(`${IMAGES_DIR}/icon-location.png`),
  gymAndFitnessSection: require(`${IMAGES_DIR}/gym-and-fitness.jpg`),

  // user settings
  bank: require(`${IMAGES_DIR}/user-settings/bank.png`),
  creditCard: require(`${IMAGES_DIR}/user-settings/credit-card.png`),
  whiteCreditCard: require(`${IMAGES_DIR}/user-settings/white-credit-card.png`),
  notifications: require(`${IMAGES_DIR}/user-settings/notifications.png`),
  user: require(`${IMAGES_DIR}/user-settings/user.png`),
  cancel: require(`${IMAGES_DIR}/cancel.png`),
  defaultAvatar: require(`${IMAGES_DIR}/default-avatar.png`),

  // connect a bank account
  bankAccountActiveIllustration: require(`${IMAGES_DIR}/user-settings/bank-illustration-active.png`),
  bankAccountInactiveIllustration: require(`${IMAGES_DIR}/user-settings/bank-illustration-inactive.png`),

  // fitness screen
  healthConnectedIllustration: require(`${IMAGES_DIR}/user-settings/health-connected-illustration.png`),
  healthNotConnectedIllustration: require(`${IMAGES_DIR}/user-settings/health-not-connected-illustration.png`),

  // personal card
  personalCardNotConnectedIllustration: require(`${IMAGES_DIR}/user-settings/personal-card-not-connected-illustration.png`),
  personalCardConnectedIllustration: require(`${IMAGES_DIR}/user-settings/personal-card-connected-illustration.png`),

  //Accounts
  wellness: require(`${IMAGES_DIR}/wellness.png`),
  bgWellness: require(`${IMAGES_DIR}/bg-wellness.png`),
  hsa: require(`${IMAGES_DIR}/hsa.png`),
  bgHsaInvestment: require(`${IMAGES_DIR}/bg-hsa-investment.png`),
  copyToClipboard: require(`${IMAGES_DIR}/copy-to-clipboard.png`),
  bgHsa: require(`${IMAGES_DIR}/bg-hsa.png`),
  fsa: require(`${IMAGES_DIR}/fsa.png`),
  bgFsa: require(`${IMAGES_DIR}/bg-fsa.png`),
  transit: require(`${IMAGES_DIR}/transit.png`),
  biking: require(`${IMAGES_DIR}/biking.png`),
  bgTransit: require(`${IMAGES_DIR}/bg-transit.png`),
  commuter: require(`${IMAGES_DIR}/commuter.png`),
  bgCommuter: require(`${IMAGES_DIR}/bg-commuter.png`),
  rewards: require(`${IMAGES_DIR}/rewards.png`),
  bgRewards: require(`${IMAGES_DIR}/bg-rewards.png`),
  parking: require(`${IMAGES_DIR}/parking.png`),
  bgParking: require(`${IMAGES_DIR}/bg-parking.png`),
  family: require(`${IMAGES_DIR}/family.png`),
  bgFamily: require(`${IMAGES_DIR}/bg-family.png`),
  pet: require(`${IMAGES_DIR}/pet.png`),
  bgPet: require(`${IMAGES_DIR}/bg-pet.png`),
  communication: require(`${IMAGES_DIR}/communication.png`),
  bgCommunication: require(`${IMAGES_DIR}/bg-communication.png`),
  virtualTwicCard: require(`${IMAGES_DIR}/forma-virtual-card.png`),
  virtualTwicCardWithoutLogo: require(`${IMAGES_DIR}/forma-virtual-card-bg.png`),
  virtualTwicCardLogo: require(`${IMAGES_DIR}/forma-virtual-card-logo.png`),
  physicalTwicCard: require(`${IMAGES_DIR}/forma-physical-card.png`),
  uncheckedCheckBox: require(`${IMAGES_DIR}/unchecked-checkbox.jpg`),
  subscripitons: require(`${IMAGES_DIR}/subscriptions.png`),
  pretaxIcon: require(`${IMAGES_DIR}/pretax-icon.png`),
};

export default images;
