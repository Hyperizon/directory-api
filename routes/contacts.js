const router = require('express').Router();
const verifyToken = require('./verifyToken');
const Contact = require('../model/Contact');
const JWT = require("jsonwebtoken");
const joi = require("joi");
const uploadImage = require('../util/imageUploader');


router.get('/', verifyToken, (req, res) => {
    Contact.findAll({
        where: {
            userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id,
            deletedAt: null
        }
    }).then(result => {
        res.send(result);
    }).catch(() => res.status(204).send("No contact"));

});

router.get('/get/:id', verifyToken, (req, res) => {
    const validation = joi.object({
        id: joi.number()
            .positive()
            .integer()
            .required()
    }).validate(req.params);
    if (validation.error) return res.status(404).send(validation.error.details[0].message)

    Contact.findOne({
        where: {
            userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id,
            deletedAt: null,
            id: req.params.id
        }
    }).then(result => {
        res.send(result);
    }).catch(() => res.status(204).send("No contact"));
});

router.post('/create', uploadImage.upload.single('image'), verifyToken, (req, res) => {
    const validation = joi.object({
        name: joi.string()
            .required()
            .max(25),
        lastName: joi.string()
            .max(25),
        company: joi.string()
            .max(25),
        email: joi.string()
            .email()
            .max(100),
        phoneNumber: joi.string()
            .required()
            .regex(/^\+?[0-9][0-9]{7,14}$/, {name: 'phoneNumber'})
            .max(14),
        image: joi.string()
            .max(255),
        notes: joi.string()
            .max(255),
        star: joi.number()
            .min(0)
            .max(1),
        global: joi.number()
            .min(0)
            .max(1)
    }).validate(req.body);
    if (validation.error) return res.status(404).send(validation.error.details[0].message)

    Contact.create({
        name: req.body.name,
        lastName: req.body.lastName,
        company: req.body.company,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        image: (req.file) ? req.file.path : undefined,
        notes: req.body.notes,
        star: req.body.star,
        global: req.body.global,
        userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id
    }).then((contact) => {
        res.status(201).send({contact: contact.id});
    }).catch(err => res.status(404).send(err.message));
});

router.delete('/delete/:id', verifyToken, (req, res) => {
    const validation = joi.object({
        id: joi.number()
            .positive()
            .integer()
            .required()
    }).validate(req.params);
    if (validation.error) return res.status(404).send(validation.error.details[0].message)

    Contact.destroy({
        where: {
            userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id,
            id: req.params.id
        }
    }).then((result) => {
        if (!result) res.status(404).send('Deleted unsuccessfully! Check "id" parameter.')
        else res.status(200).send("Deleted successfully")
    }).catch(err => res.status(404).send(err.message));
});

router.patch('/restore/:id', verifyToken, (req, res) => {
    const validation = joi.object({
        id: joi.number()
            .positive()
            .integer()
            .required()
    }).validate(req.params);
    if (validation.error) return res.status(404).send(validation.error.details[0].message);

    Contact.restore({
        where: {
            userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id,
            id: req.params.id
        }
    }).then((result) => {
        if (!result) res.status(404).send('Restore unsuccessfully! Check "id" parameter.')
        else res.status(200).send("Restore successfully")
    }).catch(err => res.status(404).send(err.message));
});

router.patch('/update/:id', uploadImage.upload.single('image'), verifyToken, (req, res) => {
    const validation1 = joi.object({
        id: joi.number()
            .positive()
            .integer()
            .required()
    }).validate(req.params);
    if (validation1.error) return res.status(404).send(validation1.error.details[0].message);

    Contact.findOne({
        where: {
            userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id,
            deletedAt: null,
            id: req.params.id
        }
    }).then(result => {
        if (!result) res.status(404).send('Update unsuccessfully! Check "id" parameter.')
        else res.status(200).send("Update successfully")
    }).catch(() => res.status(204).send("No contact"));

    const validation2 = joi.object({
        name: joi.string()
            .max(25),
        lastName: joi.string()
            .max(25),
        company: joi.string()
            .max(25),
        email: joi.string()
            .email()
            .max(100),
        phoneNumber: joi.string()
            .regex(/^\+?[0-9][0-9]{7,14}$/, {name: 'phoneNumber'})
            .max(14),
        image: joi.string()
            .max(255),
        notes: joi.string()
            .max(255),
        star: joi.number()
            .integer()
            .min(0)
            .max(1),
        global: joi.number()
            .integer()
            .min(0)
            .max(1),
    }).validate(req.body);
    if (validation2.error) return res.status(404).send(validation2.error.details[0].message);

    Contact.update({
        name: req.body.name,
        lastName: req.body.lastName,
        company: req.body.company,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        image: (req.file) ? req.file.path : undefined,
        notes: req.body.notes,
        star: req.body.star,
        global: req.body.global,
    }, {
        where: {
            userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id,
            id: req.params.id
        }
    }).then((result) => {
        if (!result) res.status(404).send('Update unsuccessfully! Check "id" parameter.')
        else res.status(200).send("Update successfully")
    }).catch(err => res.status(304).send(err.message));
});

router.get('/global', verifyToken, (req, res) => {
    Contact.findAll({
        where: {
            global: 1,
            deletedAt: null,
        }
    }).then(result => {
        res.send(result);
    }).catch(() => res.status(204).send("No contact"));
});


module.exports = router;