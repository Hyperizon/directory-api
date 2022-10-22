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
    }).catch(err => res.status(404).send(err.message));
    ;
});

router.patch('/update/:contactId', verifyToken, (req, res) => {
    const validation1 = joi.object({
        contactId: joi.number()
            .positive()
            .integer()
            .required()
    }).validate(req.params);
    if (validation1.error) return res.status(404).send(validation1.error.details[0].message);

    Permission.findOne({
        where: {
            contactId: req.params.contactId,
            userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id
        }
    }).then(result => {
        if (!result) return res.status(404).send('Update unsuccessfully! Check "contactId" parameter.')
        else return res.status(200).send("Update successfully")
    }).catch(() => {
        return res.status(204).send("No permission");
    });

    const validation2 = joi.object({
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
    if (validation2.error) return res.status(404).send(validation2.error.details[0].message)

    Permission.update({
        read: req.body.read,
        write: req.body.write,
        delete: req.body.delete,
    }, {
        where: {
            contactId: req.params.contactId,
            userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id
        }
    }).then(result => {
        if (!result) res.status(404).send('Update unsuccessfully! Check "contactId" parameter.')
        else res.status(200).send("Update successfully")
    }).catch(() => res.status(204).send("No permission"));
});


module.exports = router;