const Joi = require("joi");

const productValidation = {
  add: Joi.object().keys({
    categoriesId : Joi.string()
      .required()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "Category Id required",
        };
      }),

    name: Joi.string()
        .required()
        .error(() => {
        throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "Product name required",
        };
    }),

    dropshipPrice: Joi.number().integer()
        .required()
        .error(() => {
        throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "Product price required in neumerical form",
        };
    }),


    description : Joi.string()
      .required()
      .error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Product description required"
            }
        }),
  }),

  update: Joi.object().keys({
    categoriesId : Joi.string()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "Category Id required",
        };
      }),

    id : Joi.string().required()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "Product Id required",
        };
      }),

    
    name: Joi.string()
        .error(() => {
        throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "Product name required",
        };
    }),

    dropshipPrice: Joi.number().integer()
        .error(() => {
        throw {
            status: 200,
            statusCode: 400,
            success: false,
            data : {},
            message: "Product price required in neumerical form",
        };
    }),


    description : Joi.string()
      .error(()=>{
            throw {
                status : 200,
                statusCode : 400,
                success : false,
                data : {},
                message : "Product description required"
            }
        }),


    }),

  filter: Joi.object().keys({
    page : Joi.number().integer().required()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "number of page required",
        };
      }),

      limit : Joi.number().integer().required()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "number of rows required",
        };
      }),



  }),

  delete: Joi.object().keys({

    idsList : Joi.array().items({
      id : Joi.number().required().error(()=>{ throw { 
        status : 200,
        statusCode : 400,
        success : false,
        data : {},
        message : "ProductId required"
      }}),

      image : Joi.string().required().error(()=>{ throw { 
        status : 200,
        statusCode : 400,
        success : false,
        data : {},
        message : "image required"
      }})

    }).min(1)
    .error(()=>{
        throw {
            status : 200,
            statusCode : 400,
            success : false,
            data : {},
            message : "ids List required"
        }
    }),

      deleteAll : Joi.bool()
      .error(() => {
        throw {
          status: 200,
          statusCode: 400,
          success: false,
          data : {},
          message: "deleteAll should be a boolean",
        };
      }),


  }),


};

module.exports = productValidation;