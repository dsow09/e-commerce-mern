const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.json(categories);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    createCategory: async (req, res) => {
        try {
            /*  if user have role = 1 ---> admin
                only admin can create, update, delete category
            */
            const {name} = req.body;
            const category = await Category.findOne({name});
            if(category) return res.status(400).json({Message: "Cet Catégorie existe déjà !"});

            const newCategory = new Category({name});

            await newCategory.save();

            res.json({Message: "Category créé avec succès !"});
            
        } catch (error) {
            return res.status(500).json({Message: error.message});
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const product = await Product.findOne({category: req.params.id});
            if(product) return res.status(400).json(
                {Message: "Veuillez supprimer tous les produits concernés"});

            await Category.findByIdAndDelete(req.params.id);
            res.json({Message: "Catégorie supprimé avec succès !"});

        } catch (error) {
            return res.status(500).json({Message: error.message});
        }
    },

    updateCategory: async (req, res) => {
        try {
            const {name} = req.body;
            await Category.findByIdAndUpdate({_id: req.params.id}, {name});
            res.json({Message: "Catégorie mis à jour avec succès !"});
            
        } catch (error) {
            return res.status(500).json({Message: error.message});
        }
    }
}


module.exports = categoryController;