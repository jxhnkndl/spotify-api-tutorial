const generateRandomString = length => {
  let string = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    string += characters[Math.floor(Math.random() * characters.length)];
  }

  console.log(string);

  return string;
}

module.exports = generateRandomString;