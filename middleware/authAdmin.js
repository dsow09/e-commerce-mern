const User = require('../models/userModel');

const authAdmin = async (req, res, next) => {
    try {
        //Get user information by id
        const user = await User.findOne({_id: req.user.id})
        if(user.role === 0) return res.status(400).json({Message: "Accès Refusé !"})

        next();

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = authAdmin;