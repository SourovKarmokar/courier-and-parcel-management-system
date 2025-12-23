const jwt = require("jsonwebtoken");

// 1. Login Check
const checkLogin = (req, res, next) => {
    const { authorization } = req.headers;

    try {
        // Bearer <token>
        const token = authorization.split(" ")[1];
        
        // Token Validation
        const decoder = jwt.verify(token, "api2406mern");
        
        // Token thake data bar kore request e rakha
        const { firstName, email, userid, role } = decoder;
        
        req.firstName = firstName;
        req.email = email;
        req.userid = userid;
        req.role = role;

        next();
    } catch (err) {
       
        return res.status(401).json({
            error: "Authentication failure! Please login again."
        });
    }
};

// 2. Role Check (Authorization - Admin/Agent)
const checkRole = (roles) => {
    return (req, res, next) => {
        
        if (!roles.includes(req.role)) {
            return res.status(403).json({
                error: "You are not authorized to access this route"
            });
        }
        next();
    };
};

module.exports = { checkLogin, checkRole };