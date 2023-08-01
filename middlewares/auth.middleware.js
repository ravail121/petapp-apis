const jwt = require("jsonwebtoken");
const prisma = require("./../db/prisma");

exports.authenticate = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from headers
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      // Get user from token
      req.user = await prisma.Users.findUnique({
        where: { email : decoded.id }
      });
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({
        statusCode: 401,  
        success: false,
        data : {},
        message: "Unauthorized",
      });
    }
  }
  else{
    res.status(401).send({
        statusCode: 401,  
        success: false,
        data : {},
        message: "Unauthorized, No Token",
    });
    }
};
