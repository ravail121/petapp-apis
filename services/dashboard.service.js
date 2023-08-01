const prisma = require("../db/prisma");
const {runQuery} = require("../utils/worker");


exports.getTotalCount = async (  ) => {
    let totalOrdersCount;
    let totalProductCount;
    let totalQueriesCount;
    let totalRevenue;

    try {

        totalProductCount = await prisma.Products.count();
        totalQueriesCount = await prisma.customer_Queries.count({
            where: {
                readStatus: false 
            }
        });



        let sqlQuery = "SELECT COUNT(id) AS Count ,  SUM(totalAmount) AS Revenue FROM Orders";
        let responce = await runQuery( sqlQuery )

        if(responce.status){
            totalRevenue = responce.result[0].Revenue;
            totalOrdersCount = responce.result[0].Count;
            return {
                statusCode: 200,
                success: true,
                data : { 
                    totalProductCount , 
                    totalOrdersCount, 
                    totalQueriesCount,
                    totalRevenue 
                },
                message: "Dashboard Stats has been fetched Succesfully",
            };
    
        }


        return {
            statusCode: 400,
            success: false,
            data : { },
            message: "Invalid Query",
        };



    } catch (err) {
        console.log({err})
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Total Count not fetched",
        };
    }
};







exports.getProductsRevenue = async ( start , end  ) => {
    let totalRevenueList;
    let sqlQuery;

    try {




        sqlQuery = `SELECT revenue , totalQuantity, productId , SUBSTRING_INDEX(productName ,  "${process.env.PRODUCT_NAME_SEPRATOR}" , 1) AS productName FROM ( `

        if(start && end){
            sqlQuery += 'SELECT SUM(amount) AS revenue, SUM(quantity) AS totalQuantity, '
            sqlQuery += `GROUP_CONCAT(productName separator "${process.env.PRODUCT_NAME_SEPRATOR}") AS productName , productId `
            sqlQuery += 'FROM Orders_To_Products WHERE '
            sqlQuery += 'productId IN ( SELECT id FROM Products) AND '
            sqlQuery += `createdAt Between '${start}' AND '${end}' `
            sqlQuery += 'GROUP BY productId'
        }
        else{
            sqlQuery += 'SELECT SUM(amount) AS revenue, SUM(quantity) AS totalQuantity, '
            sqlQuery += `GROUP_CONCAT(productName separator "${process.env.PRODUCT_NAME_SEPRATOR}") AS productName , productId `
            sqlQuery += 'FROM Orders_To_Products WHERE '
            sqlQuery += 'productId IN ( SELECT id FROM Products) '
            sqlQuery += 'GROUP BY productId'
        }

        sqlQuery += " ) AS subQuery"

        console.log({sqlQuery})


        let responce = await runQuery(sqlQuery );

        if(responce.status){
            totalRevenueList = responce.result;

            return {
                statusCode: 200,
                success: true,
                data : { totalRevenueList },
                message: "Total Revenue has been fetched Succesfully",
            };
    
        }

        return {
            statusCode: 400,
            success: false,
            data : { },
            message: "Invalid Query",
        };

    } catch (err) {
        console.log({err})
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Total Revenue not fetched",
        };
    }
};



