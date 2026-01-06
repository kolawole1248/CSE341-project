// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Debugging middleware - logs all requests (MUST COME BEFORE ROUTES!)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    if (Object.keys(req.query).length > 0) {
        console.log('Query parameters:', req.query);
    }
    
    if (Object.keys(req.params).length > 0) {
        console.log('Route parameters:', req.params);
    }
    
    next();
});

// MongoDB connection setup
let db;
let client;
const uri = process.env.MONGODB_URI;

async function connectDB() {
    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('learningDB'); // Create/use database
        console.log('✅ Connected to MongoDB');
        
        // Create a sample collection with some data
        const products = db.collection('products');
        const count = await products.countDocuments();
        
        if (count === 0) {
            // Insert sample data if collection is empty
            await products.insertMany([
                { name: 'Laptop', price: 999, category: 'electronics', inStock: true },
                { name: 'Mouse', price: 25, category: 'electronics', inStock: true },
                { name: 'Keyboard', price: 75, category: 'electronics', inStock: false },
                { name: 'Monitor', price: 300, category: 'electronics', inStock: true },
                { name: 'Desk', price: 450, category: 'furniture', inStock: true },
                { name: 'Chair', price: 250, category: 'furniture', inStock: true }
            ]);
            console.log('📝 Sample data inserted');
        }
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: '🎉 Welcome to the Learning Activity API!',
        endpoints: {
            root: 'GET /',
            allProducts: 'GET /api/products',
            productById: 'GET /api/products/:id',
            productsByCategory: 'GET /api/products?category=electronics',
            expensiveProducts: 'GET /api/products?minPrice=100',
            inStockProducts: 'GET /api/products?inStock=true'
        },
        instructions: 'Use Thunder Client or REST Client to test these endpoints'
    });
});

// ============ API ENDPOINTS ============

// GET all products
app.get('/api/products', async (req, res) => {
    try {
        // Check if DB is connected
        if (!db) {
            return res.status(503).json({
                success: false,
                error: 'Database not connected'
            });
        }
        
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
});

// GET product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        // Check if DB is connected
        if (!db) {
            return res.status(503).json({
                success: false,
                error: 'Database not connected'
            });
        }
        
        const products = db.collection('products');
        
        // Check if ID is valid
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
});

// GET products by category (alternative route)
app.get('/api/categories/:category/products', async (req, res) => {
    try {
        // Check if DB is connected
        if (!db) {
            return res.status(503).json({
                success: false,
                error: 'Database not connected'
            });
        }
        
        const products = db.collection('products');
        const result = await products.find({ 
            category: req.params.category 
        }).toArray();
        
        res.json({
            success: true,
            category: req.params.category,
            count: result.length,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET with headers example
app.get('/api/headers-example', (req, res) => {
    // Log all headers received
    console.log('Headers received:', req.headers);
    
    res.json({
        success: true,
        message: 'Check your server console for headers',
        yourHeaders: {
            userAgent: req.headers['user-agent'],
            accept: req.headers['accept'],
            contentType: req.headers['content-type'],
            customHeader: req.headers['x-custom-header']
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
    process.exit(0);
});

// Start server and connect to DB
async function startServer() {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();