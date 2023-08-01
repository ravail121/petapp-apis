require("dotenv").config();
const Joi = require("joi");

const categoryValidation = {
  add: Joi.object().keys({
    name: Joi.string().not(process.env.GENERIC_CATEGORY_NAME).required()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: `Category name required and cannot be ${process.env.GENERIC_CATEGORY_NAME}`,
        };
      }),

    description : Joi.string(
        ).required().error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Category description required"
            }
        }),
    
    files : Joi.array().min(2).required().error(()=>{
          throw {
            status : 200,
            statusCode : 400,
            success : false,
            data : {},
            code : 404,
            message : "Provide both front and back images"
          }
    })

  }),


};

module.exports = categoryValidation;