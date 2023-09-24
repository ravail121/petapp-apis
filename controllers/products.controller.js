const {productValidation} = require("../validations");
const productService = require("../services/products.service");
const { products } = require("../db/prisma");

// add product
exports.addProduct = async (req, res) => {    
    try {
        const { 
            categoriesId ,
            name , dropshipPrice , 
            description  , stockName,
            fullDescription,
            weight,
            barcode , rrp
        } = req.body;
        console.log(dropshipPrice)
        // Data Validation
        const JoiSchema = productValidation.add;
        await JoiSchema.validateAsync({
            categoriesId,
            name,
            dropshipPrice,
            description
        });

        res.json(await productService.add(
                categoriesId , name , dropshipPrice , 
                description, req.uploadedFileName ,
                stockName,fullDescription,
                weight,barcode , rrp            
            ));
    } catch (err) {
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


// get product
exports.getProduct = async (req, res) => {    
    try {
        const { id } = req.params;
        res.json(await productService.get( id ));
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


// get shuffled products
exports.getShuffledProducts = async (req, res) => {    
    try {
        res.json(await productService.getShuffledProducts(  ));
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



// update product
exports.updateProduct = async (req, res) => {    
    try {
        // let {categoriesId ,  name , price  , description } = req.body;

        let { 
            categoriesId ,name , dropshipPrice , 
            description  , stockName, fullDescription,
            weight, barcode , rrp
        } = req.body;

        const { id } = req.params;

        // Data Validation
        const JoiSchema = productValidation.update;
        await JoiSchema.validateAsync({
            categoriesId,
            id,
        });

        categoriesId = categoriesId ? parseInt(categoriesId) : undefined
        dropshipPrice = dropshipPrice ? dropshipPrice.toString() : undefined;

        let entity = { 
            categoriesId , name , dropshipPrice , 
            description , stockName, fullDescription,
            weight, barcode , rrp
        }

        res.json(await productService.update(entity , id ));
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



// delete product
exports.deleteProduct = async (req, res) => {    
    try {
        const { id } = req.params;
        res.json(await productService.delete( id ));
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



// get products
exports.getAllProducts = async (req, res) => {    
    try {
        let { page , limit } = req.params;
        
        let paginationFlag = !page && !limit  ? false : true

        page = page ? page == 0 ? 1 : page  : 1;
        limit =  limit ? limit  : 10

        res.json(await productService.getAll( page , limit , paginationFlag ));
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



// update products
exports.updateProductPicture = async (req, res) => {    
    try {
        const { id } = req.params;
        res.json(await productService.updateImage( id , req.uploadedFileName ));
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





// import products
exports.importProductsData = async (req, res) => {    
    try {
        res.json( await productService.importData( req.file ) )
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



// get products by category id
exports.getProductByCategoryId = async (req , res)=>{
    try {
        let { id , page , limit } = req.params;
        page = page ? page == 0 ? 1 : page  : 1;
        limit =  limit ? limit  : 10


        res.json(await productService.getProductsByCategoryId( id , page , limit ));
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



// filter api
exports.filter = async (req , res)=>{
    try {
        const {name , price , categories , page , limit} = req.body;

        // console.log({name , price , categories , page , limit})

        const JoiSchema = productValidation.filter;
        await JoiSchema.validateAsync({
            page,
            limit
        });


        if(!name && !price && !categories){
            res.status(400).send({
                statusCode: 400,
                success: false,
                data : {  },
                message: "Please Provide name or price or categories ID to filter by",
            });            
        }

        else{
            res.json(await productService.filter(name ,  price , categories , page , limit ));
        }
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







// get products by:
// 1-category
// 2-list
// 3-filter
// 4-combinations

exports.getAllByCategory_Filter_List = async (req, res) => {    
    let filterFlag = true;
    try {
        let {  price , categories , search  , page , limit} = req.body;


        
        page = page ? page == 0 ? 1 : page  : 1;
        limit =  limit && limit <=50 ? limit  : 10;




        
        categories = categories ? categories : [];

        
        if((!price || price.length == 0) && categories.length == 0){
            filterFlag = false;
        }

        res.json(
            await productService.getAllByCategory_Filter_List( 
                search ,  price , categories  , filterFlag , page , limit  
            )
            );
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





// delete products
exports.deleteProducts = async (req, res) => {    
    try {
        let { idsList , deleteAll } = req.body;
        deleteAll = deleteAll ? deleteAll  : false; 

        const JoiSchema = productValidation.delete;
        await JoiSchema.validateAsync({
            idsList,
            deleteAll
        });


        res.json(await productService.deleteAll( idsList , deleteAll ));
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
