const paymentService = require("../services/payment.gateway.service");
const { paymentGatewayValidation } = require("../validations");

// create intent
exports.createIntent = async (req, res) => {    
    try {
        const { amount , currency ,  name , address , country , description } = req.body;
        // Data Validation
        const JoiSchema = paymentGatewayValidation.createIntent;
        await JoiSchema.validateAsync({
            amount,
            currency,
            name , 
            address , 
            country,
            description
        });


        res.json( await paymentService.createIntent( amount , currency ,  name , address , country , description ) );
    } catch (err) {
        const { status } = err;
        const s = status ? status : "500";
        res.status(s).send({
            statusCode: err.statusCode,
            success: err.success,
            data : err.data,
            message: err.message,
        });
    }  
};

