const router = require('express').Router();
const User = require('../model/User');
const joi = require('joi');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const validation = joi.object({
        name: joi.string()
            .required()
            .max(25),
        email: joi.string()
            .required()
            .email()
            .min(6),
        password: joi.string()
            .required()
            .min(6)
    }).validate(req.body);
    if (validation.error) return res.status(404).send(validation.error.details[0].message)

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const emailExist = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (emailExist) return res.status(404).send("Email already exist!");

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    }).then((user) => {
        res.status(200).send({user: user.id});
    }).catch(err => res.status(404).send(err.message));
});

router.post('/login', async (req, res) => {
    const validation = joi.object({
        email: joi.string()
            .required()
            .email()
            .min(6),
        password: joi.string()
            .required()
            .min(6)
    }).validate(req.body);
    if (validation.error) return res.status(404).send(validation.error.details[0].message)

    const user = await User.findOne({where: {email: req.body.email}});
    if (!user) return res.status(404).send('Invalid Email');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(404).send('Invalid Password');

    const token = JWT.sign({id: user.id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send();
});

module.exports = router;