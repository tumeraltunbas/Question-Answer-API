const bcrypt = require("bcryptjs");
const isInputProvided = (email, password) =>
{
    return email && password;
}

const comparePassword = (password, hashedPassword) =>
{
    return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
    isInputProvided,
    comparePassword
}