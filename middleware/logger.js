function requestLogger(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    if (Object.keys(req.query).length > 0) {
        console.log('Query parameters:', req.query);
    }
    
    next();
}

module.exports = requestLogger;