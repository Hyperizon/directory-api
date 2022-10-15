const router = require('express').Router();
const verifyToken = require('./verifyToken');

router.get('/', verifyToken, (req,res) => {
   res.json({
      contact: {
          name: "Eyüp Canbudak",
          phoneNumber: "05064272775"
      }
   });
});

module.exports = router;