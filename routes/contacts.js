const router = require('express').Router();
const verifyToken = require('./verifyToken');
const Contact = require('../model/Contact');
const JWT = require("jsonwebtoken");
const joi = require("joi");
const uploadImage = require('../util/imageUploader');


router.get('/', verifyToken, (req, res) => {
    Contact.findAll({where: {userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id}}).then(result => {
        res.send(result);
    }).catch(() => res.send("No contact"));

});

router.post('/create', uploadImage.upload.single('image'), verifyToken, (req, res) => {
    const validation = joi.object({
        name: joi.string()
            .required()
            .max(25),
        lastname: joi.string()
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
            .max(255)
    }).validate(req.body);
    if (validation.error) return res.status(404).send(validation.error.details[0].message)

    Contact.create({
        name: req.body.name,
        lastname: req.body.lastname,
        company: req.body.company,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        image: (req.file) ? req.file.path : null,
        userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id
    }).then((contact) => {
        res.status(200).send({contact: contact.id});
    }).catch(err => res.status(404).send(err.message));
});

router.delete('/delete/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(404).send('The "id" parameter cannot be empty!')

    Contact.destroy({
        where: {
            userId: JWT.verify(req.header('auth-token'), process.env.TOKEN_SECRET).id,
            id: id
        }
    }).then((result) => {
        if (!result) res.status(404).send('Deleted unsuccessfully! Check "id" parameter.')
        else res.status(200).send("Deleted successfully")
    }).catch(err => res.status(404).send(err.message));
});

router.patch('/restore/:id', verifyToken, (req, res) => {
    res.send(req.params.id);
});


module.exports = router;