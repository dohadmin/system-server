import { randomInt } from 'crypto';

export const generateRandomPassword = (length) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';

  const characterSet = uppercase + lowercase + numbers + specialCharacters;

  if (characterSet === '') {
    throw new Error('At least one character set must be selected');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(0, characterSet.length);
    password += characterSet[randomIndex];
  }

  return password;
};