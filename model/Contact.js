const {DataTypes} = require("sequelize");
const db = require('../util/database');

const contactScheme = db.define('contacts', {
    name: {type: DataTypes.STRING(25)},
    lastname: {type: DataTypes.STRING(25)},
    company: {type: DataTypes.STRING(25)},
    email: {type: DataTypes.STRING(100)},
    phoneNumber: {type: DataTypes.STRING(14)},
    image: {type: DataTypes.STRING}
});

module.exports = contactScheme;