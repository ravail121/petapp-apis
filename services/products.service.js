require("dotenv").config();
const prisma = require("../db/prisma");
const fs = require("fs");
const xlsx = require('xlsx');
const { 
    addFileData , 
    checkFileType , 
    getUniqueColList ,  
    getUniqueColsIds,
    runQuery
}  = require("../utils/worker");
const {isUrl} = require("../utils/helpers");

const mysql = require('mysql2');


// Add product
exports.add = async (
    categoriesId , name , dropshipPrice , 
    description, imageName,
    stockName,fullDescription,
    weight,barcode , rrp        
    ) => {
    let product;
    try {
        categoriesId = parseInt(categoriesId);
        let productEntity = {
            categoriesId ,  name , dropshipPrice , 
            description , imageName,
            stockName,fullDescription,
            weight,barcode , rrp                
         }

        product = await prisma.Products.create({ data : productEntity})
        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Product has been added Succesfully to given category",
        };

    } catch (err) {
        console.log({err})

        let filePath = `${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${imageName}`;
        fs.unlinkSync( filePath )
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Product with this name already exists",
            };    
        }        
        if(err.code == "P2003"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Category with this ID doent exist",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Error while creating new Product",
        };
    }
};


// Get product
exports.get = async (id) => {
    let product;
    let category;
    let baseImagePath;
    try {
        product = await prisma.Products.findUnique({where : { id : parseInt(id) } });
        if( !isUrl(product.imageName) ){
            baseImagePath = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}`;
            product.imageName = `${baseImagePath}/${product.imageName}`;    
        }        

        category = await prisma.Categories.findUnique({where : { id : product.categoriesId }})

        product.categoriesName = category.name;
        product.categoriesId = undefined;



        return {
            statusCode: 200,
            success: true,
            data : { product : product },
            message: "Product has been fetched Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting Product details",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Product With provided ID not found",
        };
    }
};




// Get Shuffled Products
exports.getShuffledProducts = async ( ) => {
    let products;

    try {
        let page = 1;
        let limit = 10;
        const skip = (page - 1) * limit;

        let sqlQuery = "SELECT * FROM Products AS shuffled_data  ORDER BY rand() limit 0 , 10"        
        let resp = await runQuery(sqlQuery)

        if(resp.status){
            products = resp.result;

            products = products.map((item_)=>{
                if( !isUrl(item_.imageName) ){
                    item_.imageName = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${item_.imageName}`;
                }            
                return { ...item_ }
            })

            return {
                statusCode: 200,
                success: true,
                data : {  products },
                message: "Products has been fetched Succesfully",
            };
    
        }

        return {
            statusCode: 400,
            success: false,
            data : {  },
            message: "Products Not fetched",
        };







    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting products details",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Products not fetched",
        };
    }
};



// Update product
exports.update = async (entity , id) => {
    let product;
    try {
        let productEntity = { ...entity }
        product = await prisma.Products.update({
            data : productEntity,
            where : { id : parseInt(id) }
        })
        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Product has been updated Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Product With this name already exists",
            };    
        }
        if(err.code == "P2003"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Category with this ID doent exist",
            };    
        }        
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Product With provided ID not found",
        };
    }
};



// Delete category
exports.delete = async (id) => {
    let product;
    let baseImagePath;
    try {
        product = await prisma.Products.delete({where : {  id : parseInt(id)}})


        if(product.imageName.split("://").length == 1){
            let filePath = `${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${product.imageName}`;
            fs.unlinkSync( filePath )    
        }


        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Product has been deleted Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2025"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Product with provided id already deleted",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Product With provided ID not found",
        };
    }
};


// Get Products
exports.getAll = async (page , limit , paginationFlag) => {
    let products;
    let totalCount;

    try {

        if(paginationFlag){
            const skip = (page - 1) * limit;
            products = await prisma.Products.findMany({
                orderBy: {
                    createdAt: "desc",                    
                },    

                skip: parseInt(skip), 
                take: parseInt(limit)
            });    
            totalCount = await prisma.Products.count();
            totalCount = Math.round(totalCount / parseInt(limit))
            totalCount = totalCount == 0 ? 1 : totalCount    
        }
        else{
            products = await prisma.Products.findMany({ 
                orderBy: {
                    createdAt: "desc",
                }
            });    
        }


        products = products.map((item_)=>{
            if( !isUrl(item_.imageName) ){
                item_.imageName = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${item_.imageName}`;
            }            
            return { ...item_ }
        })


        return {
            statusCode: 200,
            success: true,
            data : { 
                products ,
                totalCount
            },
            message: "Products has been fetched Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting products details",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Products not fetched",
        };
    }
};




// Update category image
exports.updateImage = async (id , imageName) => {
    let product;
    try {

        previousData = await prisma.Products.findUnique({where : { id : parseInt(id) } });
        let filePath = `${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${previousData.imageName}`;
        if( previousData.imageName && !isUrl(previousData.imageName) ){ 
            fs.unlinkSync( filePath ) 
        }

        let productEntity = { imageName }

        product = await prisma.Products.update({
            data : productEntity,
            where : { id : parseInt(id) }
        })

        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Product Image has been updated Succesfully",
        };

    } catch (err) {
        let filePath = `${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${imageName}`;
        fs.unlinkSync( filePath )

        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Product With this id already exists",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Product With provided ID not found",
        };
    }
};




// Import Excel Data
exports.importData = async (fileObject) => {
    try {
        const filePath = fileObject.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];      
        const data = xlsx.utils.sheet_to_json(worksheet);
        let response;

        let checkFileCols = await checkFileType( data )

        if(checkFileCols == null){
            return {
                statusCode: 200,
                success: true,
                data : {  },
                message: "Data Uploaded Successfully",    
            }   
        }

        if( checkFileCols ){

            // get list of unique cols 
            let columnsList = await getUniqueColList(data);

            console.log({columnsList})
            // get columns ids and names
            let resp = await getUniqueColsIds(columnsList)

            if (resp.status){
                // add products to db
                response = await addFileData( data , resp.result )
            }

        }

        if(!response){
            return {
                statusCode: 400,
                success: false,
                data : {  },
                message: "File Format not supported",
            };    
        }


        if(response.status){
            return {
                statusCode: 200,
                success: true,
                data : {  },
                message: "Data Uploaded Succesfully",
            };    
        }


        return {
            statusCode: 200,
            success: false,
            data : {  },
            message: "Data not Uploaded",
        };

    } 
    catch (err) {
        console.log({err})
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Data cannot be uploaded",
        };
    }
};




// get products by category id
exports.getProductsByCategoryId = async (id , page , limit) => {
    let products;
    try {
        id = parseInt(id);
        const skip = (page - 1) * limit;

        products = await prisma.Products.findMany({
            where : { categoriesId : id },
            skip: parseInt(skip),
            take: parseInt(limit)
        });


        products = products.map((item_)=>{
            if( !isUrl(item_.imageName) ){
                item_.imageName = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${item_.imageName}`;
            }            
            return { ...item_ }
        })


        let totalCount = await prisma.Products.count({
            where: {
                categoriesId: id
            }
            });

        totalCount = Math.round(totalCount / process.env.PRODUCTS_PAGE_LIMIT)
        totalCount = totalCount == 0 ? 1 : totalCount;


        return {
            statusCode: 200,
            success: true,
            data : { products , totalCount },
            message: "Product fetched Successfully",
        };

    } catch (err) {

        console.log({err})
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Products With provided category ID not found",
        };
    }
};




// filter
exports.filter = async (name , price , categories , page , limit) => {
    let products;
    let sqlQuery;
    let totalCount;
    let sqlQueryCount;
    try {

        sqlQuery = "SELECT * FROM Products WHERE ";
        sqlQueryCount = 'SELECT COUNT(*) FROM Products WHERE ';

        const skip = (page - 1) * limit;

        if(name){
            sqlQuery += `name = ${name}`
        }
        else if(price && categories){
            sqlQuery += `categoriesId IN (${categories}) AND dropshipPrice BETWEEN ${price[0]} AND ${price[1]}`
        }
        else if(price){
            sqlQuery += `dropshipPrice BETWEEN ${price[0]} AND ${price[1]}`
        }
        else if(categories){
            sqlQuery += `categoriesId IN (${categories})`
        }

        sqlQueryCount += sqlQuery.split("WHERE")[1];
        sqlQuery += ` limit ${skip}, ${limit}`;


        const connection = mysql.createConnection({
            host: process.env.DATABASE_USER_HOST,
            user: process.env.DATABASE_USER_NAME,
            password: process.env.DATABASE_USER_PASS,
            database: process.env.DATABASE_DB_NAME,
            insecureAuth: true
        });

        let responce = await new Promise((resolve , rejects)=>{
            connection.connect((err) => {
                if (err) {
                    connection.destroy();
                    console.error('Error connecting to MySQL database:', err.stack);
                    rejects(err)
                } 
                else {
                    connection.query(sqlQuery , function(err2 , result2){
                        if(err2){
                            console.log({err2})
                            connection.destroy();
                            resolve({status : false})
                        }
                        else{
                            connection.query(sqlQueryCount , function(err3 , result3){
                                if(err3){
                                    console.log({err3})
                                    connection.destroy();
                                    resolve({status : false})
                                }
                                else{
                                    connection.destroy();
                                    resolve({ status : true , products : result2 , count : result3[0]["COUNT(*)"] })
                                }
                            })
                        }
                    })                
                }
            })
        })

        if(responce.status){

            products = responce.products;
            totalCount = responce.count;
            totalCount = Math.round(totalCount / process.env.PRODUCTS_PAGE_LIMIT)
            totalCount = totalCount == 0 ? 1 : totalCount;

            products = products.map((item_)=>{
                if( !isUrl(item_.imageName) ){
                    item_.imageName = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${item_.imageName}`;
                }            
                return { ...item_ }
            })
    
        }
        else{
            products = [];
        }

        return {
            statusCode: 200,
            success: true,
            data : { products , totalCount  },
            message: "Products fetched Successfully",
        };

    } catch (err) {

        console.log({err})
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Products not found",
        };
    }
};






// get products by:
// 1-category
// 2-list
// 3-filter
// 4-combinations
exports.getAllByCategory_Filter_List = async (
        search , 
        price ,
        categories ,
        filterFlag , 
        page , 
        limit
    ) => {

    let products;
    let sqlQuery;
    let totalCount;
    let sqlQueryCount;
    
    try {

        const skip = (page - 1) * limit;

    
        if(!filterFlag){
            sqlQuery = "SELECT * FROM Products";
            sqlQueryCount = 'SELECT COUNT(*) FROM Products';
        }

        else if(search){
            if(!parseInt(search)){
                // its name
                sqlQuery = `SELECT * FROM Products WHERE name LIKE '%${search}%' `;
                sqlQueryCount = `SELECT COUNT(*) FROM Products WHERE name LIKE '%${search}%' `;
            }
            else{
                // its price
                sqlQuery = `SELECT * FROM Products WHERE dropshipPrice LIKE '${search}%' `;
                sqlQueryCount = `SELECT COUNT(*) FROM Products WHERE dropshipPrice LIKE '${search}%' `;
            }
        }

        else{
            sqlQuery = "SELECT * FROM Products WHERE";
            sqlQueryCount = 'SELECT COUNT(*) FROM Products WHERE';
    
               
            if(price){
                if( typeof price != typeof Array() && parseInt(price) ){
                    sqlQuery += ` dropshipPrice = ${price} AND`;
                }
                else{
                    sqlQuery += ` dropshipPrice BETWEEN ${price[0]} AND ${price[1]} AND`
                }
                
            }

            if(categories.length > 0 ){
                sqlQuery += ` categoriesId IN (${categories}) AND`
            }


            sqlQuery = sqlQuery.slice(0 , -3);
            sqlQueryCount += sqlQuery.split("WHERE")[1];

        }

        sqlQuery += ` limit ${skip}, ${limit}`;

        sqlQuery = `SELECT * FROM ( ${sqlQuery} ) AS shuffled_data  ORDER BY rand()`

        console.log({sqlQuery})
        console.log({sqlQueryCount})

        const connection = mysql.createConnection({
            host: process.env.DATABASE_USER_HOST,
            user: process.env.DATABASE_USER_NAME,
            password: process.env.DATABASE_USER_PASS,
            database: process.env.DATABASE_DB_NAME,
            insecureAuth: true
        });

        let responce = await new Promise((resolve , rejects)=>{
            connection.connect((err) => {
                if (err) {
                    connection.destroy();
                    console.error('Error connecting to MySQL database:', err.stack);
                    rejects(err)
                } 
                else {
                    connection.query(sqlQuery , function(err2 , result2){
                        if(err2){
                            console.log({err2})
                            connection.destroy();
                            resolve({status : false})
                        }
                        else{
                            connection.query(sqlQueryCount , function(err3 , result3){
                                if(err3){
                                    console.log({err3})
                                    connection.destroy();
                                    resolve({status : false})
                                }
                                else{
                                    connection.destroy();
                                    resolve({ status : true , products : result2 , count : result3[0]["COUNT(*)"] })
                                }
                            })
                        }
                    })                
                }
            })
        })

        if(responce.status){

            products = responce.products;
            totalCount = responce.count;

            totalCount = Math.round(totalCount / limit)
            totalCount = totalCount == 0 ? 1 : totalCount;

            products = products.map((item_)=>{
                if( !isUrl(item_.imageName) ){
                    item_.imageName = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${item_.imageName}`;
                }            
                return { ...item_ }
            })


    
        }
        else{
            products = [];
        }

        return {
            statusCode: 200,
            success: true,
            data : { products , totalCount  },
            message: "Products fetched Successfully",
        };

    } catch (err) {

        console.log({err})
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Products not found",
        };
    }
};




// Delete products
exports.deleteAll = async (idsList , deleteAll) => {
    let deleteResp;
    try {
        if(!deleteAll){
            
            let images = [];
            let ids = idsList.map((item_)=>{
                if( item_.image.split( "://" ).length == 1 ){
                    images.push( item_.image )
                }
                return item_.id
            })
    
    
            deleteResp = await prisma.Products.deleteMany({
                where: { id: { in: ids } }
            })    

            console.log({images})

            if(images.length > 0){
                images.map((img)=>{
                    let filePath = `${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}/${img}`;
                    fs.unlinkSync( filePath );                    
                })
            }
    
        }
        else{
            deleteResp = await prisma.Products.deleteMany();
            let dirPath = `${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}`
            console.log({dirPath})
            try{
                fs.rmSync( dirPath , { recursive: true } );
            }
            catch(err){
                console.log(err)
            }
            
        }




        console.log({deleteResp})

        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Products has been deleted Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2025"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Product with provided id already deleted",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Product With provided ID not found",
        };
    }
};
