const { customerQueryValidation } = require("../validations");
const queryService = require("../services/queries.service");

// add order
exports.addQuery = async (req, res) => {    
    try {
        let { from , message } = req.body;

        // Data Validation
        const JoiSchema = customerQueryValidation.add;
        await JoiSchema.validateAsync({
            from,
            message
        });


        res.json(await queryService.add( from , message ));
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



// get all queries
exports.getAllQueries = async (req, res) => {    
    try {
        res.json(await queryService.getAll( ));
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


// get query
exports.getQuery = async (req, res) => {    
    try {
        const { id } = req.params;

        res.json(await queryService.get( id ));
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





// reply to query
exports.replyQuery = async (req, res) => {    
    try {
        let { id } = req.params;
        let { replyMessage} = req.body;

        // Data Validation
        const JoiSchema = customerQueryValidation.update;
        await JoiSchema.validateAsync({
            replyMessage
        });


        res.json(await queryService.reply( id , replyMessage ));
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
