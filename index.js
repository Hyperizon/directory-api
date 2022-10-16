const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./util/database');
require('./util/associations');
const authRoute = require('./routes/auth');
const contactRoute = require('./routes/contacts')
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

db.authenticate().then(() => {
    console.log("Connection has been established successfully.");
}).catch(err => console.log(err, "err"));


app.use('/api/users', authRoute);
app.use('/api/contacts', contactRoute);


app.listen(process.env.PORT || 5000, () => console.log("Listening on port 3000"));