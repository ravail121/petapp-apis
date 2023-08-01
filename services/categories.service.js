const { Prisma } = require("@prisma/client");
const prisma = require("../db/prisma");
const fs = require("fs");
const { preferences } = require("joi");

// Add category
exports.add = async (name, description, frontImage , backImage) => {
    let category;
    try {
        let categoryEntity = { 
            name : name , 
            description : description , 
            imageName : backImage , 
            frontImageName   : frontImage
        }

        category = await prisma.Categories.create({ data : categoryEntity})
        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Category has been added Succesfully",
        };

    } catch (err) {
        console.log({err})

        let filePathFront = `${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}/${frontImage}`;
        fs.unlinkSync( filePathFront )
        let filePathBack = `${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}/${backImage}`;
        fs.unlinkSync( filePathBack )

        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Category with this name already exists",
            };    
        }        
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Error while creating new Category",
        };
    }
};


// Get category
exports.get = async (id) => {
    let category;
    let baseImagePath;
    try {
        category = await prisma.Categories.findUnique({where : { id : parseInt(id) } });
        baseImagePath = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}`;
        category.imageName = `${baseImagePath}/${category.imageName}`;
        category.frontImageName = `${baseImagePath}/${category.frontImageName}`

        return {
            statusCode: 200,
            success: true,
            data : { category : category },
            message: "Category has been fetched Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting Category details",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Category With provided ID not found",
        };
    }
};



// Update category
exports.update = async (entity , id) => {
    let category;
    try {
        let categoryEntity = { ...entity }
        category = await prisma.Categories.update({
            data : categoryEntity,
            where : { id : parseInt(id) }
        })
        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Category has been updated Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Category With this name already exists",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Category With provided ID not found",
        };
    }
};



// Delete category
exports.delete = async (id) => {
    let category;
    let products;
    let baseImagePath;
    try {


        products = await prisma.products.findMany({ where : { categoriesId : parseInt(id) } });
        category = await prisma.Categories.delete({where : {  id : parseInt(id)}});

        let images = [];
        products.map((item_)=>{
            if( item_.imageName.split( "://" ).length == 1 ){
                images.push( item_.image )
            }

        })
        

        console.log({category})
        if( category.imageName.split("://").length == 1 ){
            let filePath = `${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}/${category.imageName}`;
            fs.unlinkSync( filePath )
        }

        
        else if( category.frontImageName.split("://").length == 1 ){
            let filePath = `${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}/${category.frontImageName}`;
            fs.unlinkSync( filePath )    
        }
        

        if(images.length > 0){
            images.map((img)=>{

                let filePath = `${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${img}`;
                fs.unlinkSync( filePath );
                
            })
        }


        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Category has been deleted Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2025"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Category with provided id already deleted",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Category With provided ID not found",
        };
    }
};





// Get category
exports.getAll = async (page , limit , paginationFlag ) => {
    let categories;
    let totalCount;

    try {

        if(paginationFlag){
            const skip = (page - 1) * limit;
            categories = await prisma.Categories.findMany({
                orderBy: {
                    createdAt: "desc",
                },    

                skip: parseInt(skip),
                take: parseInt(limit)
            });
            totalCount = await prisma.Categories.count();
            totalCount = Math.round(totalCount / parseInt(limit))
            totalCount = totalCount == 0 ? 1 : totalCount
        }
        else{
            categories = await prisma.Categories.findMany({
                orderBy: {
                    createdAt: "desc",                    
                },    

            });
        }

        categories = categories.map((item_)=>{
            item_.imageName = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}/${item_.imageName}`;
            item_.frontImageName = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}/${item_.frontImageName}`
            return { ...item_ }
        })


        return {
            statusCode: 200,
            success: true,
            data : { categories , totalCount },
            message: "Categories has been fetched Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting Categories details",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Categories not fetched",
        };
    }
};




// Update category image
exports.updateImage = async (id , imageName , sideFlag) => {
    let category;
    let filePath;
    let categoryEntity;
    try {

        previousData = await prisma.Categories.findUnique({where : { id : parseInt(id) } });


        if( sideFlag == 1 ){
            if(previousData.frontImageName){
                filePath = `${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}/${previousData.frontImageName}`;
            }            

            categoryEntity  = { frontImageName : imageName }
        }
        else{
            if(previousData.imageName){
                filePath = `${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}/${previousData.imageName}`;
            }            

            
            categoryEntity = { imageName : imageName }
        }



        if(filePath){  
            fs.unlinkSync( filePath ) 
        }

        

        category = await prisma.Categories.update({
            data : categoryEntity,
            where : { id : parseInt(id) }
        })
        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Category Image has been updated Succesfully",
        };

    } catch (err) {
        console.log({err})

        let filePath = `${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}/${imageName}`;
        fs.unlinkSync( filePath )

        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Category With this id already exists",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Category With provided ID not found",
        };
    }
};
