const Product = require('../models/productModel');

// FILTER, SORTING AND PAGINATION
class APIfeatures 
{
    constructor(query, queryString)
    {
        this.query = query;
        this.queryString = queryString;
    }

    //Filtering products
    filtering() {
        const queryObject = {...this.queryString}; //queryString = req.query
        console.log({before: queryObject}); //Before delete page
        
        const excludedFields = ['page', 'sort', 'limit'];
        excludedFields.forEach(element =>delete(queryObject[element]));
        
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        this.query.find(JSON.parse(queryStr))

        return this;
    }

    //Sorting products
    sorting() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    //Paginating products
    paginating(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1 ) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

const productController = {
    getProducts: async(req, res) => {
        try {
            const features = new APIfeatures(Product.find(), req.query)
                .filtering()
                .sorting()
                .paginating();

            const products = await features.query;

            res.json({
                status: "Success",
                result: products.length,
                products
            });

        } catch (error) {
            return res.status(500).json({Message: error.message});
        }
    },

    createProduct: async(req, res) => {
        try {
            const {product_id, title, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({Message: "Aucune image sélectionnée !"});

            const product = await Product.findOne({product_id});
            if(product) return res.status(400).json({Message: "Ce produit existe déjà !"});

            const newProduct = new Product({
                product_id, 
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category
            });

            newProduct.save();
            res.json({Message: "Produit créé avec succès !"});
            
        } catch (error) {
            return res.status(500).json({Message: error.message});
        }
    },

    deleteProduct: async(req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.id);
            res.json({ Message: "Produit supprimé avec succès !"});

        } catch (error) {
            return res.status(500).json({Message: error.message});
        }
    },

    updateProduct: async(req, res) => {
        try {
            const {title, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({Message: "Aucune image sélectionnée !"});

            await Product.findByIdAndUpdate(
                {
                    _id: req.params.id
                },
                {
                    title: title.toLowerCase(), 
                    price, 
                    description, 
                    content, 
                    images, 
                    category
                }
            )

            res.json({ Message: "Mis à jour avec succès !"});

        } catch (error) {
            return res.status(500).json({Message: error.message});
        }
    }
}


module.exports = productController;