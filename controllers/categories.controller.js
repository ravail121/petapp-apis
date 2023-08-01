const {categoryValidation} = require("../validations");
const categoryService = require("../services/categories.service");
const fs = require("fs");


// add category
exports.addCategory = async (req, res) => {    
    try {
        const { name , description } = req.body;
        // Data Validation

        const files = req.files;

        const JoiSchema = categoryValidation.add;
        await JoiSchema.validateAsync({
            name,
            description,
            files
        });


        console.log(req.frontImage , req.backImage)



        res.json(
            await categoryService.add(name , description , req.frontImage , req.backImage )
            );
    } catch (err) {
        console.log({err})
        if(err.code == 404){
            if(req.frontImage){
                let filePathFront = `${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}/${req.frontImage}`;
                fs.unlinkSync( filePathFront )    
    
            }
        }

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



// get category
exports.getCategory = async (req, res) => {    
    try {
        const { id } = req.params;
        res.json(await categoryService.get( id ));
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



// update category
exports.updateCategory = async (req, res) => {    
    try {
        const { name , description } = req.body;
        const { id } = req.params;
        let files = [1,2]
        // Data Validation
        const JoiSchema = categoryValidation.add;
        await JoiSchema.validateAsync({
            name,
            description,
            files
            
        });

        let entity = { name , description }

        res.json(await categoryService.update(entity , id ));
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




// delete category
exports.deleteCategory = async (req, res) => {    
    try {
        const { id } = req.params;
        res.json(await categoryService.delete( id ));
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



// get category
exports.getAllCategories = async (req, res) => {    
    try {
        let { page , limit } = req.params;

        let paginationFlag = !page && !limit  ? false : true;
        
        page = page ? page == 0 ? 1 : page  : 1;
        limit =  limit ? limit  : 10


        res.json(await categoryService.getAll( page , limit , paginationFlag ));
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



// update category
exports.updateCategoryPicture = async (req, res) => {    
    try {
        const { id } = req.params;
        const { sideFlag } = req.body;


        res.json(await categoryService.updateImage( id , req.uploadedFileName , sideFlag ));
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
