const bcrypt = require('bcryptjs');

const SALT_WORK_VALUE = parseInt(process.env.SALT_WORK_VALUE || 10);

function hashPassword(password) {
    return bcrypt.hashSync(password, SALT_WORK_VALUE);
};

module.exports.hashPassword = hashPassword;