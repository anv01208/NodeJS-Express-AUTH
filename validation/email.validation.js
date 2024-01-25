function isEmail(email) {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  
  if (typeof email === 'string' && email !== '' && email.match(emailFormat)) {
      return true;
  }
  
  return false;
}

module.exports = isEmail;
