const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  // console.log('token', token)

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) return res.status(401).json({ message: "Unauthorized Access" });
    // console.log("user", user);

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, Something Wrong!" });
  }
};

const isAdmin = async (req, res, next) => {
  const role = req.user.role;
  if (role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied: can not get access without admin" });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin };

// const jwt = require("express-jwt");
// const jwksRsa = require("jwks-rsa");

// // create a middleware function that uses express-jwt
// const authMiddleware = jwt({
//   // specify the secret used to sign and verify the token
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: "https://your-auth0-domain.auth0.com/.well-known/jwks.json",
//   }),

//   // specify the audience and issuer of the token
//   audience: "your-api-audience",
//   issuer: "https://your-auth0-domain.auth0.com/",
//   algorithms: ["RS256"],

//   // specify the token extraction method
//   getToken: function (req) {
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.split(" ")[0] === "Bearer"
//     ) {
//       return req.headers.authorization.split(" ")[1];
//     } else if (req.query && req.query.token) {
//       return req.query.token;
//     } else if (req.cookies && req.cookies.token) {
//       return req.cookies.token;
//     }
//     return null;
//   },

//   // specify the error handling behavior
//   credentialsRequired: true,
//   // customize the error message and status code
//   unauthorized: function (err, req, res, next) {
//     if (err.code === "invalid_token") {
//       return res.status(401).json({ error: "Invalid token" });
//     } else if (err.code === "credentials_required") {
//       return res.status(401).json({ error: "Missing authorization token" });
//     }
//     next();
//   },

//   // specify the token revocation behavior
//   isRevoked: function (req, payload, done) {
//     // check if the token is blacklisted
//     if (payload.sub === "blacklisted") {
//       return done(null, true);
//     }
//     done(null, false);
//   },
// });

// module.exports = authMiddleware;
