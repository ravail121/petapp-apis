require("dotenv").config();
const {generateOrderNumber} = require("../utils/helpers")
const {populateEmailTemplate , makeTableRowsHtml} = require("../utils/mailTemplatesgenerator");
const {sendEmail } = require("../utils/helpers");
const { runQuery } = require("../utils/worker");
const prisma = require("../db/prisma");


// Add Order
exports.add = async (emailAddress , totalAmount , orderDetails , shippingAddress , shippingFee , totalTax , paymentId) => {
    let order;
    try {

        let orderNo = generateOrderNumber( process.env.ORDER_NO_LENGTH );
        let orderStatus = process.env.NEW_ORDER_STATUS;

        let subTotal = (parseFloat( totalAmount ) + parseFloat( shippingFee ) + parseFloat( totalTax ) ).toFixed(2).toString();        
        
        let orderEntity = { 
            orderNo , emailAddress ,  totalAmount , 
            orderStatus , shippingFee , totalTax , subTotal
        }


        const orderTransaction = await prisma.$transaction(async (prisma) => {
            const order = await prisma.Orders.create({ data : orderEntity });
        
            const order_to_products = await prisma.orders_To_Products.createMany({
                data: orderDetails.map((details) => ({
                    productId: details.productId,            
                    quantity: details.quantity,
                    amount : details.amount,
                    orderId : order.id,
                    productName: details.productName,
                    productStock : details.productStock
                }))
            });

            const order_history = await prisma.order_History.create({
                data : {
                    orderId : order.id,
                    prevStatus : orderStatus,
                    newStatus : orderStatus
                }
            })


            const order_shippingAddress = await prisma.orders_To_ShippingDetails.create({
                data : {
                    orderId : order.id,
                    shippingAddress 
                }
            })

            const order_paymentId = await prisma.Payment_Intents.create({
                data: {
                    orderId : order.id,
                    orderNo : orderNo,
                    paymentId : paymentId
                }
            })
        
            return { order, order_to_products , order_history , order_shippingAddress ,order_paymentId };
          });

        let logoImagePath = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.GENERIC_ASSETS_DIR}/${process.env.LOGO_IMG}`
        let mainImagePath = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.GENERIC_ASSETS_DIR}/${process.env.EMAIL_MAIN_IMAGE}`
        let footerImagePath = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.GENERIC_ASSETS_DIR}/${process.env.EMAIL_FOOTER_IMAGE}`
                  

        console.log({logoImagePath});


        let tableRowsHtml =  makeTableRowsHtml( orderDetails );

        totalAmount = parseFloat( totalAmount ).toFixed(2).toString();
        
        let replaceObject = [
            { original  : "logoImgUrl" , newVal :  logoImagePath },
            { original : "emailMainImage" , newVal : mainImagePath  },
            { original : "footerImageLogo" , newVal : footerImagePath},
            { original : "orderNo" , newVal : orderNo },
            { original : "tabledata" , newVal : tableRowsHtml },
            { original : "total" , newVal : totalAmount },
            { original : "totalTax" , newVal : totalTax },
            { original : "shippingFee" , newVal : shippingFee },
            { original : "subTotal" , newVal : subTotal }
        ]; 

        let emailBody = populateEmailTemplate( process.env.SEND_ORDER_NO_TEMPLATE , replaceObject )
        let emailSubject = "Order Placed";


        let emailResp = await sendEmail( emailAddress , emailSubject , emailBody  );

        if(emailResp.status){

            await prisma.Orders.update({
                data : { emailSent : true },
                where : {  id : orderTransaction.order.id }
            })   
        }


        return {
            statusCode: 200,
            success: true,
            data : { orderNo },
            message: "Order has been placed Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2003"){
            return{
                statusCode: 400,
                success: false,
                data : {},
                message: "ProductId Not Found",    
            }
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Error while creating new Order",
        };
    }
};



exports.checkProducts = async( productIds )=>{
    let sqlQuery;
    try {

        // orders = await prisma.Orders.findMany({
        //     orderBy : {
        //         createdAt : "desc"
        //     }
        // });
        sqlQuery = "SELECT id FROM Products WHERE id IN ( ";
        productIds.map((id)=>{ sqlQuery += `${id} ,` })
        sqlQuery = sqlQuery.slice(0 , -1);
        sqlQuery += ")"

        let resp = await runQuery(sqlQuery);
        if(resp.status){
            let existingIds = resp.result.map((elem)=>{ return elem.id });
            return {
                statusCode: 200,
                success: true,
                data : { existingIds },
                message: "Existing Ordered Products Returned Successfully",
            };
    
        }

        return {
            statusCode: 400,
            success: false,
            data : {  },
            message: "Existing Ordered Products Not Found",
        };


    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting Ordered Products details",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Ordered Product Ids not fetched",
        };
    }
}




// Get All Orders
exports.getAll = async ( ) => {
    let orders;
    try {

        orders = await prisma.Orders.findMany({
            orderBy : {
                createdAt : "desc"
            }
        });

        return {
            statusCode: 200,
            success: true,
            data : { orders },
            message: "Orders has been fetched Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting Order details",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Orders not fetched",
        };
    }
};




// Get Order
exports.get = async ( id ) => {
    let order;
    let orderHistory;
    let orderProductDetails;
    let orderShippingAddress;
    let orderPaymentIdDetails;

    try {

        order = await prisma.Orders.findUnique({where : { id : parseInt(id) } });;


        orderProductDetails = await prisma.orders_To_Products.findMany({
            where : { orderId : parseInt(id) },
            select : {  
                quantity : true , 
                amount : true , 
                productName : true,
                productStock : true,
            }
        })

        orderShippingAddress = await prisma.orders_To_ShippingDetails.findMany({
            where : { orderId : parseInt(id) },
            select : { shippingAddress : true }
        })


        orderHistory = await prisma.order_History.findMany({
            where : { orderId : parseInt(id) },
            orderBy: {
                createdAt: 'asc' 
            },
            select : { newStatus : true , createdAt : true }

        });


        orderPaymentIdDetails =  await prisma.Payment_Intents.findMany({
            where : { orderId : parseInt(id) }
        })
        

        order.paymentId = orderPaymentIdDetails[0].paymentId

        order.shippingAddress = orderShippingAddress[0].shippingAddress;
        order.productDetails = orderProductDetails;
        order.history = orderHistory;
    


        return {
            statusCode: 200,
            success: true,
            data : { order  },
            message: "Order has been fetched Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting Order details",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Order not fetched",
        };
    }
};




// Get All Orders
exports.getOrderStatuses = async ( ) => {
    let statuses;
    try {

        statuses = await prisma.Order_Statuses.findMany({
            select : {
                value : true
            }
        });

        return {
            statusCode: 200,
            success: true,
            data : { statuses },
            message: "Order Statuses has been fetched Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting Order Statuses",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Order Statuses not fetched",
        };
    }
};




// Update Order Status
exports.update = async (entity , id) => {
    let order;
    let lastStatus;
    let newStatus;
    try {
        let orderEntity = { ...entity }
        order = await prisma.Orders.update({
            data : orderEntity,
            where : { id : parseInt(id) }
        })

        lastStatus = await prisma.order_History.findMany({
            where: {
              orderId: parseInt(id) 
            },
            orderBy: {
              createdAt: 'desc' 
            },
            take: 1 
        });

        let prevStatus = lastStatus[0].newStatus;


        if(prevStatus != entity.orderStatus){
            newStatus = await prisma.order_History.create({
                data : {
                    orderId : parseInt(id),
                    prevStatus : prevStatus,
                    newStatus : entity.orderStatus              
                }
            })    
        }



        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Order Status has been updated Succesfully",
        };

    } catch (err) {
        if(err.code == "P2003"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Invalid Order Status",
            };    
        }

        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Order With provided ID not found",
        };
    }
};




exports.getShippingFee = async ()=>{
    let shippingFee;
    try {

        shippingFee = await prisma.Shipping_Settings.findMany({});;

        return {
            statusCode: 200,
            success: true,
            data : { shippingFee },
            message: "Shipping Fee has been fetched Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting shippingFee",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "shipping Fee not fetched",
        };
    }

}




// update shipping settings
exports.updateShippingSettings = async ( 
        tax,
        shippingFee,
        currencySign,
        currency  
    ) => {

    try {
        let shippingSettingEntity = { tax , shippingFee , currencySign , currency }

        const prevSettings = await prisma.shipping_Settings.findFirst({
            orderBy : { id : "asc" }
        })

        const shippingSetting = await prisma.shipping_Settings.update({
            where: { id :  prevSettings.id }, // Empty `where` object selects the first record
            data: shippingSettingEntity
        });



        return {
            statusCode: 200,
            success: true,
            data : {   },
            message: "Shipping Settings has been updated Succesfully",
        };

    } catch (err) {

        console.log({err})

        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Shipping Settings Not Found provided ID not found",
        };
    }
};
