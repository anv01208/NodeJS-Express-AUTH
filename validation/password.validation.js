function CheckPassword(password) {
    if (typeof password !== 'string') {
      return false;
    }
  
    var passw = /^(?=.*[A-Z])(?=.*\d).{7,21}$/;
    return password.match(passw) !== null;
  }
  
  module.exports = CheckPassword;
  