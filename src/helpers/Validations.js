const REGEX_EMAIL = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const REGEX_PHONE_NUMBER = /(^[0-9]{2})?(\s|-)?(9?[0-9]{4})-?([0-9]{4}$)/;

const REGEX_NAME = /^[A-Z][a-z].*$/;

export const emailValidation = (email) => {
  const testEmail = REGEX_EMAIL.test(email);
  return testEmail;
};

export const phoneNumberValidation = (phoneNumber) => {
  const testPhoneNumber = REGEX_PHONE_NUMBER.test(phoneNumber);
  return testPhoneNumber;
};

export const nameValidation = (name) => {
  const testName = REGEX_NAME.test(name);
  return testName;
};
