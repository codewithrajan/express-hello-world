// authentication.js

const jwt = require('jsonwebtoken');

// Middleware function to check user authentication
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // Redirect to login if the token is not present
    req.session.originalUrl = req.originalUrl;
    return res.redirect('/login');
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.SECRET);

    // Attach the user information to the request for further processing
    req.user = decoded;

    // Continue to the next middleware or route
    next();
  } catch (error) {
    // Redirect to login if token verification fails
    res.send("somethis went wrong")
    // return res.redirect('/login');
  }
};

module.exports = authenticateUser;
