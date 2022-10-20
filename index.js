const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./util/database');
require('./util/associations');
const authRoute = require('./routes/auth');
const contactRoute = require('./routes/contacts')
const permissionRoute = require('./routes/permissions')
const cors = require('cors');
require('dotenv').config();

app.use(cors({
    origin: "*",
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/images', express.static('./images'))

db.authenticate().then(() => {
    console.log("Connection has been established successfully.");
}).catch(err => console.log(err, "err"));


app.use('/api/users', authRoute);
app.use('/api/contacts', contactRoute);
app.use('/api/permissions', permissionRoute);


app.listen(process.env.PORT || 5000, () => console.log("Listening on port 3000"));