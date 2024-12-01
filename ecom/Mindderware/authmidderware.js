const jwt = require("jsonwebtoken");
const userModel = require("../Model/Usermodel");

// Middleware to check if user is signed in
const requireSignIn = async (req, res, next) => {
  console.log('Request Headers:', req.headers);

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization header is missing or incorrect format');
    return res.status(401).json({ success: false, message: "Token missing or incorrect format" });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token);

  if (!token) {
    console.log('Token is missing after split');
    return res.status(401).json({ success: false, message: "Token missing after split" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debug: Log the decoded token
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(403).json({ success: false, message: "Token invalid" });
  }
};


// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  console.log('Running isAdmin middleware');
  try {
    const user = await userModel.findById(req.user._id);
    console.log('User in isAdmin:', user);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    if (user.role !== 'admin') {
      return res.status(401).json({ success: false, message: "Unauthorized Access - Admin required" });
    }
    next();
  } catch (error) {
    console.log("Error in isAdmin middleware:", error);
    return res.status(401).json({ success: false, message: "Error in admin middleware" });
  }
};


module.exports = { requireSignIn, isAdmin };
