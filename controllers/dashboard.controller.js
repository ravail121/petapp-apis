const dashboardService = require("../services/dashboard.service");
const {dashboardValidation} = require("../validations");


// get total orders count
exports.getDashboardStats = async (req, res) => {    
    try {

        res.json(await dashboardService.getTotalCount(  ));
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




exports.getProductsRevenue = async(req , res)=>{
    try {
        const { start , end } = req.body;

        const JoiSchema = dashboardValidation.productRevenue;
        await JoiSchema.validateAsync({
            start , 
            end
        });

        res.json(await dashboardService.getProductsRevenue(  start , end  ));
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
}
