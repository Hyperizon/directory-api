const {DataTypes} = require("sequelize");
const db = require('../util/database');

const userScheme = db.define('users', {
    name: {type: DataTypes.STRING(50)},
    email: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
});

module.exports = userScheme;