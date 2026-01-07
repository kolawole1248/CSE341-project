// server.js - PROFESSIONAL PROFILE API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080; // Changed to 8080 to match frontend

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (if you put frontend files in a 'frontend' folder)
app.use(express.static(path.join(__dirname, 'frontend')));

// ============ API ENDPOINTS ============

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Professional Profile API is running!',
        status: 'OK',
        endpoints: {
            professional: 'GET /professional',
            products: 'GET /api/products (example)'
        },
        timestamp: new Date().toISOString()
    });
});

// ============ MAIN ENDPOINT FOR YOUR FRONTEND ============
// Your frontend calls: http://localhost:8080/professional
app.get('/professional', (req, res) => {
    // Simple base64 image (small blue circle)
    const simpleBase64Image = "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADUSURBVHgB7dixDYAwEATBkwYS4v57WmhBKUIrXZIn4a611j5WepZ8Lfk/tiT1r7UWjDG0pJ4lzyS/vqvkmaS+5Jnk13eV3JJ0fu2S/Oq6Sm5JOr92SX51XSW3JJ1fuyS/uq6SW5LOr12SX11XyS1J59cuya+uq+SWpPNrl+RX11VyS9L5tUvyq+squSXp/Nol+dV1ldySdH7tkvzqukpuSTq/dkl+dV0ltySdX7skv7qukluSzq9dkl9dV8ktSefXLsmvrqvklqTza5fkV9dVckvS+bVL8qv8bF4hHEBOYwAAAABJRU5ErkJggg==";
    
    // EXACT structure your frontend expects
    const professionalData = {
        professionalName: "John Doe",
        base64Image: simpleBase64Image,
        nameLink: {
            firstName: "John",
            url: "https://example.com"
        },
        primaryDescription: "Senior Software Developer",
        workDescription1: "Passionate about creating efficient and scalable web applications with over 5 years of experience in full-stack development.",
        workDescription2: "Specialized in JavaScript, Node.js, React, and cloud technologies. Always eager to learn new technologies and solve complex problems.",
        linkTitleText: "Connect with me:",
        linkedInLink: {
            text: "LinkedIn Profile",
            link: "https://linkedin.com/in/johndoe"
        },
        githubLink: {
            text: "GitHub Profile",
            link: "https://github.com/johndoe"
        },
        contactText: "Email: john.doe@example.com | Phone: (123) 456-7890"
    };
    
    res.json(professionalData);
});

// ============ OPTIONAL: Your existing products endpoint ============
app.get('/api/products', (req, res) => {
    const products = [
        { id: 1, name: 'Laptop', price: 999, category: 'electronics' },
        { id: 2, name: 'Mouse', price: 25, category: 'electronics' },
        { id: 3, name: 'Keyboard', price: 75, category: 'electronics' }
    ];
    
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

// ============ ERROR HANDLING ============

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// ============ START SERVER ============

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Professional endpoint: http://localhost:${PORT}/professional`);
    console.log(`🎯 Products endpoint: http://localhost:${PORT}/api/products`);
    console.log(`📁 Root endpoint: http://localhost:${PORT}/`);
});