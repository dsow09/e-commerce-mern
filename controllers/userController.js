require('dotenv').config();
const User = require('../models/userModel');
const Payement = require('../models/payementModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    register: async (req, res) => {
        try {
            const {name, email, password} = req.body;
            const user = await User.findOne({email});
            if(user) return res.status(400).json({message: "Cet email existe déjà !"})

            if(password.length < 6) return res.status(400).json({message: "Le Mot de Passe doit contenir au moins 6 caractères"})
            
            //Password Encryption
            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new User({
                name, email, password: passwordHash
            });

            //Save to mongodb
            await newUser.save()

            //Create jsonwebtoken to authentification
            const accessToken = createAccessToken({id: newUser._id})
            const refreshToken = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 //7d
            })
            
            res.json({accessToken});

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    login: async (req, res) => {
        try {
            const {email, password} = req.body;

            const user = await User.findOne({email});
            if(!user) return res.status(400).json({message: "Cet Utilisateur n'existe pas !"});

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({message: "Mot de passe incorrect !"});

            // If login success, create access token and refresh token
            //Create jsonwebtoken to authentification
              const accesstoken = createAccessToken({id: user._id})
              const refreshtoken = createRefreshToken({id: user._id})
  
              res.cookie('refreshtoken', accesstoken, {
                  httpOnly: true,
                  path: '/user/refresh_token',
                  maxAge: 7*24*60*60*1000 //7d
              })

            res.json({accesstoken});

        } catch (err) {
            return res.status(500).json({message: err.message});
        }
    },

    logout: async (req, res) => {
        try {
           res.clearCookie('refreshtoken', {path: '/user/refresh_token'});
           return res.json({message: "Logged out"})
           
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },

    refreshToken: (req, res) => {
        try {
            const accesstoken = req.cookies.refreshtoken;
            if(!accesstoken) return res.status(403).json({message: "Veuillez vous connecter ou vous inscrire !"});

            res.json({accesstoken})
            
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    getUser: async (req, res) => {
        try {
                const user = await User.findById(req.user.id).select('-password');
                
                if(!user) return res.status(400).json({message: "Cet utilisateur n'existe pas dans la base de données !"})

                 res.json(user);

        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },

    addCart: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if(!user) return res.status(400).json({message: "Cet utilisateur n'existe pas !"});

            await User.findOneAndUpdate({_id: req.user.id},{
                cart: req.body.cart
            })

            return res.json({message: "Ajouté au Panier"})
            
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    history: async(req, res) => {
        try {
            const history = await Payement.find({user_id: req.user.id});
            
            res.json(history);


        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'})
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'})
}



module.exports = userController;