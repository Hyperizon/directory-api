const db = require('./database');
const Contact = require('../model/Contact');
const User = require('../model/User');

User.hasOne(Contact, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION'
});

db.sync({alter: true}).then(() => {
   console.log("Synced Database");
}).catch(() => {
    console.log("Synced Failed Database");
});