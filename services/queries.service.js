require("dotenv").config();
const {populateEmailTemplate} = require("../utils/mailTemplatesgenerator");
const {sendEmail} = require("../utils/helpers");

const prisma = require("../db/prisma");

// Add Order
exports.add = async (from , message) => {
    let query;
    try {


        let queryEntity = { from , message  }
        query = await prisma.Customer_Queries.create({data : queryEntity})

        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Query  has been sent Succesfully",
        };

    } catch (err) {
        console.log({err})
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Error while sending user query",
        };
    }
};



// Get All Queries
exports.getAll = async ( ) => {
    let queries;
    try {


        queries = await prisma.Customer_Queries.findMany({
            select : {
                id : true,
                from : true,
                readStatus : true,
                replyStatus : true,
                createdAt : true
            },

            orderBy : {
                createdAt : "desc"
            }
            
        })

        return {
            statusCode: 200,
            success: true,
            data : { queries },
            message: "Queries  has been sent Succesfully",
        };

    } catch (err) {
        console.log({err})
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Error while fetching user queries",
        };
    }
};



// Get Query
exports.get = async ( id ) => {
    let query;
    let chatHistory;
    try {

        query = await prisma.Customer_Queries.findUnique({
            where : { id : parseInt(id) } ,
            select : {
                from : true,
                message : true,
                createdAt : true
            },
        });;


        chatHistory = await prisma.Customer_Queries_History.findMany({
            where : { queryId : parseInt(id) },
            select : { adminMessage : true  , createdAt : true},
            orderBy : { createdAt : "asc" }
        })


        let readStatus = true;
        let queryEntity = { readStatus }
        let updateReadStatus = await prisma.Customer_Queries.update({
            data : queryEntity,
            where : { id : parseInt(id)  }
        })

        query.chatHistory = chatHistory;

        return {
            statusCode: 200,
            success: true,
            data : { query },
            message: "Query has been fetched Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while getting Query details",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Query not fetched",
        };
    }
};





// Get Query
exports.reply = async ( id , replyMessage ) => {
    let query;
    try {

        query = await prisma.Customer_Queries.findUnique({
            where : { id : parseInt(id) } ,
        });;



        let logoImagePath = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.GENERIC_ASSETS_DIR}/${process.env.LOGO_IMG}`
        let mainImagePath = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.GENERIC_ASSETS_DIR}/${process.env.EMAIL_MAIN_IMAGE}`
        let footerImagePath = `${process.env.SERVER_URL}/${process.env.STATIC_DIR}/${process.env.GENERIC_ASSETS_DIR}/${process.env.EMAIL_FOOTER_IMAGE}`
                  


        
        let replaceObject = [
            { original  : "logoImgUrl" , newVal :  logoImagePath },
            { original : "emailMainImage" , newVal : mainImagePath  },
            { original : "footerImageLogo" , newVal : footerImagePath},
            { original : "reply" , newVal : replyMessage },

        ]; 



        let emailBody = populateEmailTemplate( process.env.SEND_QUERY_REPLY_TEMPLATE , replaceObject )
        let emailSubject = "Reply";

        let emailResp = await sendEmail( query.from , emailSubject , emailBody  );

        if(emailResp.status){
            let replyStatus = true;
            let queryEntity = { replyStatus }
            
            await prisma.Customer_Queries.update({
                data : queryEntity ,
                where : {  id : parseInt(id) }
            })               

            await prisma.Customer_Queries_History.create({
                data : {
                    queryId : query.id,
                    adminMessage : replyMessage
                }        
            })


        }

        return {
            statusCode: 200,
            success: true,
            data : {  },
            message: "Query has been replied Succesfully",
        };

    } catch (err) {
        console.log({err})
        if(err.code == "P2002"){
            return {
                statusCode: 400,
                success: false,
                data : {},
                message: "Error while replying Query",
            };    
        }
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Query not replied",
        };
    }
};


