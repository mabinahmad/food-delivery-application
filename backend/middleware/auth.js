import jwt from "jsonwebtoken";

// Middleware function to authenticate the user
//---------------------------------------------------------
const authMiddleware = async (req, res, next) => {
  // Retrieve the token from the request headers
  const token = req.headers.authorization;

  // If there is no token, return an error response indicating that the user is not authorized
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login again " });
  }
  try {
    // Verify the token using the JWT secret and decode it
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user ID to the request object so it can be accessed in subsequent middleware or routes
    req.userId = token_decode.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Error" });
  }
};

export default authMiddleware;
