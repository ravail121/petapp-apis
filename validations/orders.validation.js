const Joi = require("joi");

const orderValidation = {
  add: Joi.object().keys({
    emailAddress: Joi.string().required()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "Email Address required",
        };
      }),

      totalAmount : Joi.number().required()
        .error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Total Amount required"
            }
        }),


        orderDetails : Joi.array().items({
          quantity : Joi.number().required().error(()=>{ throw { 
            status : 200,
            statusCode : 400,
            success : false,
            data : {},
            message : "Quantity required for ordered item"
          }}),

          productId : Joi.number().required().error(()=>{ throw { 
            status : 200,
            statusCode : 400,
            success : false,
            data : {},
            message : "ProductId required for ordered item"
          }}),

          amount : Joi.number().required().error(()=>{ throw { 
            status : 200,
            statusCode : 400,
            success : false,
            data : {},
            message : "Total Amount required for ordered item"
          }}),

          productName : Joi.string().required().error(()=>{ throw { 
            status : 200,
            statusCode : 400,
            success : false,
            data : {},
            message : "Product Name required for ordered item"
          }}),

          productStock : Joi.string().required().error(()=>{ throw { 
            status : 200,
            statusCode : 400,
            success : false,
            data : {},
            message : "Product Stock is required for ordered item"
          }}),



        }).required()
        .error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Order Details required"
            }
        }),


        shippingAddress  : Joi.string().required()
          .error(() => {
            throw {
              status: 200,
              statusCode: 400,
              success: false,
              data : {},
              message: "Shipping Address required",
            };
          }),

        shippingFee : Joi.number().required()
        .error(() => {
          throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "Shipping Fee required",
          };
        }),

        totalTax : Joi.number().required()
        .error(() => {
          throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "Total Tax required",
          };
        }),
        
    }),


    update: Joi.object().keys({
      orderStatus: Joi.string().required()
        .error(() => {
          throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "Order Status required",
          };
        }),          
      }),



    shippingSetting : Joi.object().keys({
      tax: Joi.number()
        .error(() => {
          throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "Tax must be a Number",
          };
        }),          


      shippingFee: Joi.number()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "shippingFee must be a Number",
        };
      }),          


    currencySign : Joi.string()
    .error(() => {
      throw {
        status: 200,
        statusCode: 400,
        success: false,
        data : {},
        message: "currencySign must be a String",
      };
    }),          

    currency : Joi.string()
    .error(() => {
      throw {
        status: 200,
        statusCode: 400,
        success: false,
        data : {},
        message: "currency must be a String",
      };
    }),          



      }),




};

module.exports = orderValidation;