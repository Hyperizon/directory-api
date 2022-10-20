const router = require('express').Router();
const verifyToken = require('./verifyToken');
const Permission = require('../model/Permission');
const JWT = require("jsonwebtoken");
const joi = require("joi");

router.post('/get/:contactId', verifyToken, (req, res) => {
    const validation = joi.object({
        contactId: joi.number()
            .positive()
            .integer()
            .required()
    }).validate(req.params);
    if (validation.error) return res.status(404).send(validation.error.details[0].message)

    Permission.findOne({
        where: {
            contactId: req.params.contactId,
            userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id
        }
    }).then(result => {
        res.send({read: result.read, write: result.write, delete: result.delete});
    }).catch(() => res.status(204).send("No permission"));
});

router.post('/create', verifyToken, (req, res) => {
    const validation = joi.object({
        contactId: joi.number()
            .positive()
            .integer()
            .required(),
        userId: joi.number()
            .positive()
            .integer()
            .required(),
        read: joi.number()
            .positive()
            .integer(),
        write: joi.number()
            .positive()
            .integer(),
        delete: joi.number()
            .positive()
            .integer(),
    }).validate(req.body);
    if (validation.error) return res.status(404).send(validation.error.details[0].message)

    Permission.create({
        contactId: req.body.contactId,
        userId: req.body.userId,
        read: req.body.read,
        write: req.body.write,
        delete: req.body.delete,
    }).then((permission) => {
        res.status(201).send(permission);
    }).catch(err => res.status(404).send(err.message));;
});


module.exports = router;