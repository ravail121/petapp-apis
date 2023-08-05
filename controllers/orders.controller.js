const { orderValidation } = require("../validations");
const orderService = require("../services/orders.service");


// add order
exports.addOrder = async (req, res) => {    
    try {
        let { 
            emailAddress , 
            shippingFee,
            totalTax,
            totalAmount , 
            orderDetails , 
            shippingAddress ,
            paymentId
        } = req.body;

        // Data Validation
        const JoiSchema = orderValidation.add;
        await JoiSchema.validateAsync({
            emailAddress,
            totalAmount,
            orderDetails,
            shippingAddress,
            shippingFee,
            totalTax,
            paymentId

        });

        totalAmount = totalAmount.toString();
        totalTax = totalTax.toString();
        shippingFee = shippingFee.toString();

        res.json(await orderService.add( emailAddress , totalAmount , orderDetails , shippingAddress , shippingFee , totalTax ,paymentId ));
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



exports.checkOrderedProducts = async(req , res)=>{
    try {
        let { productIds } = req.body;

        // Data Validation
        const JoiSchema = orderValidation.checkProducts;
        await JoiSchema.validateAsync({
            productIds,

        });


        res.json(await orderService.checkProducts( productIds ));
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
}




// get all orders
exports.getAllOrders = async (req, res) => {    
    try {
        res.json(await orderService.getAll( ));
    } catch (err) {
        console.log({ err });
        const { status } = err;
        const s = status ? status : 500;
        res.status(s).send({
            statusCode: err.statusCode,
            success: err.success,
            data : err.data,
            message: err.message,
        });
    }  
};


// get order
exports.getOrders = async (req, res) => {    
    try {
        const { id } = req.params;

        res.json(await orderService.get( id ));
    } catch (err) {
        console.log({ err });
        const { status } = err;
        const s = status ? status : 500;
        res.status(s).send({
            statusCode: err.statusCode,
            success: err.success,
            data : err.data,
            message: err.message,
        });
    }  
};



// get order
exports.getOrderStatuses = async (req, res) => {    
    try {        
        res.json(await orderService.getOrderStatuses( ));
    } catch (err) {
        console.log({ err });
        const { status } = err;
        const s = status ? status : 500;
        res.status(s).send({
            statusCode: err.statusCode,
            success: err.success,
            data : err.data,
            message: err.message,
        });
    }  
};



// update order status
exports.updateOrderStatus = async (req, res) => {    
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        // Data Validation
        const JoiSchema = orderValidation.update;
        await JoiSchema.validateAsync({
            orderStatus
        });

        let entity = { orderStatus }

        res.json(await orderService.update(entity , id ));
    } catch (err) {
        console.log({ err });
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



// get order
exports.getShippingFee = async (req, res) => {    
    try {
        res.json(await orderService.getShippingFee( ));
    } catch (err) {
        console.log({ err });
        const { status } = err;
        const s = status ? status : 500;
        res.status(s).send({
            statusCode: err.statusCode,
            success: err.success,
            data : err.data,
            message: err.message,
        });
    }  
};



exports.updateShippingSettings = async(req , res)=>{
    try {
        let { tax , shippingFee , currencySign , currency } = req.body;

        // Data Validation
        const JoiSchema = orderValidation.shippingSetting;
        await JoiSchema.validateAsync({
            tax,
            shippingFee,
            currencySign,
            currency
        });

        tax =  tax ?  parseFloat( tax ) : undefined
        shippingFee = shippingFee ? parseInt( shippingFee ) : undefined

        res.json(await orderService.updateShippingSettings( 
            tax, shippingFee,
            currencySign, currency    
        ));

    } catch (err) {
        console.log({ err });
        const { status } = err;
        const s = status ? status : 500;
        res.status(s).send({
            statusCode: err.statusCode,
            success: err.success,
            data : err.data,
            message: err.message,
        });
    }  
};
