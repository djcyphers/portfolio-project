const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../user/model/User");

async function validateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  let result;
  if (!authorizationHeader)
    return res.status(401).json({
      error: true,
      message: "Access Token Missing",
    });

  const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
  const options = {
    expiresIn: "2h",
  };
  try {
    let user = await User.findOne({
      accessToken: token,
    });

    if (!user) {
      result = {
        error: true,
        message: `Authorization Error`,
      };
      return res.status(403).json(result);
    }

    result = jwt.verify(token, process.env.JWT_SECRET, options);

    if (!user.userId === result.id) {
      result = {
        error: true,
        message: `Invalid Token`,
      };

      return res.status(401).json(result);
    }

    result["referralCode"] = user.referralCode;

    req.decoded = result;
    next();
  } catch (err) {
    // console.log(err);
    if (err.name === "TokenExpiredError") {
      result = {
        error: true,
        message: `Access Token Expired`,
      };
    } else {
      result = {
        error: true,
        message: `Authentication Error`,
      };
    }
    return res.status(403).json(result);
  }
}

module.exports = { validateToken };
