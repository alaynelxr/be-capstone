const admin = require("firebase-admin");

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization; // Extract the Firebase token from headers
  console.log("this is verifyToken running", idToken);
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken.uid; // Store the user's Firebase UID in the request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized accessL verufytoken" });
  }
  console.log("Request Headers:", req.headers);
};

module.exports = { verifyToken };
