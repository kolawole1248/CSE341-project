// server.js - MINIMAL WORKING VERSION
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running!',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Sample products route
app.get('/api/products', (req, res) => {
    const products = [
        { id: 1, name: 'Laptop', price: 999, category: 'electronics' },
        { id: 2, name: 'Mouse', price: 25, category: 'electronics' },
        { id: 3, name: 'Keyboard', price: 75, category: 'electronics' }
    ];
    
    // Handle query parameters
    let filteredProducts = [...products];
    
    if (req.query.category) {
        filteredProducts = filteredProducts.filter(
            p => p.category === req.query.category
        );
    }
    
    if (req.query.minPrice) {
        filteredProducts = filteredProducts.filter(
            p => p.price >= Number(req.query.minPrice)
        );
    }
    
    res.json({
        success: true,
        count: filteredProducts.length,
        data: filteredProducts
    });
});

// 404 handler - SIMPLIFIED
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});