var validator = require('email-validator');

module.exports = function (email) {
  return validator.validate(email);
}
