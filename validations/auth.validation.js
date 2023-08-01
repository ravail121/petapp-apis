const Joi = require("joi");

const authValidation = {
  register: Joi.object().keys({
    name: Joi.string()
      .required()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "Full name required",
        };
      }),

    password : Joi.string(
        ).required(
        ).error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Password required"
            }
        }),

    email: Joi.string()
      .email()
      .required()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "Please provide valid email address",
        };
      }),
  }),


  login: Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "Please provide valid email address",
        };
      }),

    password : Joi.string(
        ).required(
        ).error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Password required"
            }
        })
  })

};

module.exports = authValidation;