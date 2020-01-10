let presenter;

switch (process.env.PRESENTER) {
  case 'public':
    presenter = require('./presenter-public');
    break;
  default:
    presenter = require('./presenter-ustc');
}

module.exports = presenter;
