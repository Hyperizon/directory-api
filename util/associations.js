const db = require('./database');
const Contact = require('../model/Contact');
const User = require('../model/User');
const Permission = require('../model/Permission');

User.hasOne(Contact, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION'
});

Contact.hasMany(Permission);
User.hasMany(Permission);

db.sync({alter: true}).then(() => {
   console.log("Synced Database");
}).catch((e) => {
    console.log("Synced Failed Database");
    console.log(e)
});