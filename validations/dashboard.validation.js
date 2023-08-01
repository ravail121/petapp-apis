const Joi = require("joi");

const dashboardValidation = {

  productRevenue: Joi.object().keys({  

        start: Joi.string()
            .error(() => {
                throw {
                status: 200,
                statusCode: 400,
                success: false,
                data : {},
                message: "start timeStamp is required",
                };
            }),

        end: Joi.string()
            .error(() => {
                throw {
                status: 200,
                statusCode: 400,
                success: false,
                data : {},
                message: "end timeStamp is required",
                };
            }),
          
      }),



};

module.exports = dashboardValidation;