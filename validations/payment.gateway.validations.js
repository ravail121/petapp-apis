const Joi = require("joi");

const paymentGatewayValidation = {
    createIntent: Joi.object().keys({
        amount: Joi.number().required()
        .error(() => {
            throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "Amount is required",
            };
        }),

        currency : Joi.string().required()
        .error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Currency is required"
            }
        }),


        name : Joi.string().required()
        .error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Name is required"
            }
        }),

        

        address : Joi.string().required()
        .error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Address is required"
            }
        }),

        country : Joi.string().required()
        .error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Country is required"
            }
        }),


        description : Joi.string().required()
        .error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Description is required"
            }
        }),


        
    }),

};

module.exports = paymentGatewayValidation;