const router = require('express').Router();
const payementController = require('../controllers/payementController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


router.route('/payement')
    .get(auth, authAdmin, payementController.getPayement)
    .post(auth, payementController.createPayement)


module.exports = router;