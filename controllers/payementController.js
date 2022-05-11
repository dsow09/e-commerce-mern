const Payement = require('../models/payementModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const payementController = {
    getPayement: async(req, res) => {
        try {
            const payement = await Payement.find();
            res.json(payement);

        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },

    createPayement: async(req, res) => {
        try {
            const user = await User.findById(req.user.id).select('name email');
            if(!user) return res.status(400).json({message: "Cet utilisateur n'existe pas !"});

            const {cart, paymentID, address} = req.body;
            const {_id, name, email} = user;

            const newPayement = new Payement({
                user_id: _id, name, email, paymentID, address, cart
            })

            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold)
            })

            await newPayement.save();
            res.json({message: "Payement effectué avec succès !"});
            
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
}

const sold = async (id, quantity, oldSold) => {
    await Product.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
}

module.exports = payementController;