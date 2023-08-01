const prisma = require("../db/prisma");
const bcrypt = require('bcryptjs');
const {
  generateToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/generateToken");



// Register New Super Admin
exports.register = async (name, email, password) => {
  let user;
  let jwtToken;


  try {
    password = bcrypt.hashSync(password, parseInt( process.env.SALT_LENGTH) );
    const userEntity = { name, email, password , isAdmin : false }
    user = await prisma.Users.create({ data : userEntity});

    jwtToken = generateToken( email )

    return {
        statusCode: 200,
        success: true,
        data : { token : jwtToken },
        message: "User has been added",
      };

  } catch (err) {
    console.log({err})
    if (err.code === "P2002") {
      return {
        statusCode: 409,
        success: false,
        data : {},
        message: "Email already exist",
      };
    }

    return {
      statusCode: 400,
      success: false,
      data : {},
      message: "Error while creating new user",
    };
  }
};



// Login New Super Admin
exports.login = async (email, password) => {
  let user;
  try {
    let userEntity = {  email }
    user = await prisma.Users.findUnique({ where: userEntity });    
    if(!user){
      return {
        statusCode: 404,
        success: false,
        data : {},
        message: "Email not found",
      };      
    }
    else{
      const isMatch = bcrypt.compareSync(password, user.password);
      if(isMatch){
        let jwtToken = generateToken( email )
        return {
          statusCode: 200,
          success: true,
          data : { token : jwtToken },
          message: "Logged in successfully",
        };      
  
      }
      else{
        return {
          statusCode: 404,
          success: false,
          data : {},
          message: "Password is incorrect",
        };        
      }
    }

  } catch (err) {
    console.log({err})

    return {
      statusCode: 400,
      success: false,
      data : {},
      message: "Error while signing-in user",
    };
  }
};