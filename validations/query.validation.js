const Joi = require("joi");

const customerQueryValidation = {
  add: Joi.object().keys({
    from: Joi.string().email().required()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "Email Address required",
        };
      }),


      message: Joi.string().required()
        .error(() => {
            throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "messaage required",
            };
        }),


        
    }),

  update: Joi.object().keys({
      replyMessage: Joi.string().required()
        .error(() => {
            throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "reply message required",
            };
        }),
  
  
          
      }),



};

module.exports = customerQueryValidation;