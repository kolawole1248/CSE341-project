const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const db = getDB();
            const products = db.collection('products');
            const query = {};
            
            // Handle query parameters
            if (req.query.category) {
                query.category = req.query.category;
            }
            
            if (req.query.minPrice) {
                query.price = { $gte: Number(req.query.minPrice) };
            }
            
            if (req.query.maxPrice) {
                query.price = query.price || {};
                query.price.$lte = Number(req.query.maxPrice);
            }
            
            if (req.query.inStock !== undefined) {
                query.inStock = req.query.inStock === 'true';
            }
            
            const result = await products.find(query).toArray();
            res.json({
                success: true,
                count: result.length,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    
    getProductById: async (req, res) => {
        try {
            const db = getDB();
            const products = db.collection('products');
            
            if (!ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid product ID format'
                });
            }
            
            const product = await products.findOne({ 
                _id: new ObjectId(req.params.id) 
            });
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = productController;