const {DataTypes} = require("sequelize");
const db = require('../util/database');

const permissionScheme = db.define('permissions', {
    read: {type: DataTypes.TINYINT, defaultValue: 0},
    write: {type: DataTypes.TINYINT, defaultValue: 0},
    delete: {type: DataTypes.TINYINT, defaultValue: 0},
});

module.exports = permissionScheme;