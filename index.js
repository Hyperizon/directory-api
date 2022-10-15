const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./util/database');
const authRoute = require('./routes/auth');
const contactRoute = require('./routes/contacts')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

db.authenticate().then(() => console.log("Connection has been established successfully.")).catch(err => console.log(err, "err"));

app.use('/api/users', authRoute);
app.use('/api/contacts', contactRoute);


app.listen(3000, () => console.log("Listening on port 3000"));