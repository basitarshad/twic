const formErrorMessages = {
  phoneRegExp: /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
  REQUIRED_ERROR_MESSAGE: 'Required.',
  EMAIL_ERROR_MESSAGE: 'Invalid email address.',
  PHONE_NUMBER_LENGTH_MESSAGE: 'Max. limit is 15 digits.',
  PHONE_NUMBER_ERROR_MESSAGE: 'Invalid phone number.',
  INVALID_ZIP_CODE: 'Invalid zip code.',
}

export default formErrorMessages;