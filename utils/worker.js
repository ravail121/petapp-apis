const mysql = require('mysql2');
const fs = require("fs");
require("dotenv").config();


let REQUIRED_HEADERS = [ 
    "Stock" , "Description" , "Image Link" , "Barcode" ,
    "Dropship Price (NOT including VAT)"  ,
    "Full Description", "RRP (Including VAT)" , "Weight (g)" , "Category"
];


const compareArrays = ( arr_1 , arr_2) =>
    arr_1.length === arr_2.length &&
    arr_1.every((element) => arr_2.includes( element )  );


exports.checkFileType = async(data) => {
    try{
        if(  typeof data == typeof Array()){
            let cols =  Object.keys( data[0] );
    
            let flag = compareArrays( cols , REQUIRED_HEADERS )
            return flag;        
        }
        else{
            return false;
        }
    
    }
    catch(err){
        return null;        
    }
}


exports.getUniqueColList = async (data)=>{
    let listOfColumns = new Set();

    data.map((item)=>{
        if(item.Category){

            // let splitList =  item.Category?.split(" ");
            // if( splitList.includes(" ") ){
            //     let indexOfEmptySpace = splitList.indexOf( " " );
            //     splitList.splice( indexOfEmptySpace , 1 );
            //     console.log({splitList})
            //     item.Category = splitList.join(" ");
            // }
            
            // // let splitListlength = splitList.length;
            // // item.Category = splitListlength > 2 ? `${splitList[0]} ${splitList[ splitListlength-1 ]}` : item.Category;

            // // let indexToRemove = splitList.indexOf(" "); 
            // // myArray.splice(indexToRemove, 1);             
            // // console.log(myArray); // Output: [1, 2, 4, 5]
            // console.log("-->" , item.Category)
            listOfColumns.add( item.Category ) 

    
        }
    })

    listOfColumns = Array.from(listOfColumns)

    return listOfColumns

}


exports.getUniqueColsIds = async ( colsList )=>{
    let addColsSqlQuery = "INSERT IGNORE INTO Categories (`name`) VALUES "
    let getColsIdsSqlQuery = "SELECT id , name FROM Categories WHERE name IN ( "

    colsList.map((element)=>{
        addColsSqlQuery += "("
        addColsSqlQuery += `'${element}'`
        getColsIdsSqlQuery += `'${element}'`
        addColsSqlQuery += ")"
        addColsSqlQuery += ","
        getColsIdsSqlQuery += ","
    })

    addColsSqlQuery = addColsSqlQuery.slice(0,-1);
    getColsIdsSqlQuery = getColsIdsSqlQuery.slice(0,-1)
    addColsSqlQuery += ";"
    getColsIdsSqlQuery += ");"

    let result = { status : false };
    let addResp = await this.runQuery( addColsSqlQuery );
    if(addResp.status){
        let getResp = await this.runQuery( getColsIdsSqlQuery );
        if(getResp.status){
            let processedOject = {}
            getResp.result.map(( obj )=>{
                processedOject[ obj.name ] = obj.id
            })
            getResp.result = processedOject;
            result = getResp
        }
    }
    return result;
}


exports.addFileData = async( data , idsObject )=>{
    let categorySplitList;
    let categorySplitLength;
    let id_;
    let sqlQuery = "INSERT INTO Products (categoriesId , name , description , imageName, barcode, dropshipPrice, fullDescription , rrp, stockName, weight) VALUES "

    data.map((element )=>{

        if(element.Category){
            categorySplitList = element.Category.split(" ");
            categorySplitLength = categorySplitList.lenght;

            element.Category = categorySplitLength > 2 ? `${categorySplitList[0]} ${categorySplitList[ categorySplitLength-1 ]}` : element.Category;
            id_ = idsObject[ element.Category ];

            if(id_ && !element.Description.includes("KONG")){
                sqlQuery +=  '(' 
                sqlQuery += `${id_} , '${ element.Description.replace( /'/g, "''" ) ? element.Description.replace( /'/g, "''" ) : "" }', '${ element.Description.replace( /'/g, "''" ) ? element.Description.replace( /'/g, "''" ) : "" }' , '${element["Image Link"] ? element["Image Link"] : ""  }',`
                sqlQuery += `'${element.Barcode ? element.Barcode : "" }', ${element["Dropship Price (NOT including VAT)"] ? element["Dropship Price (NOT including VAT)"] : 0 },`
                sqlQuery += `'${element["Full Description"].replace( /'/g, "''" ) ? element["Full Description"].replace( /'/g, "''" ) : "" }', ${element["RRP (Including VAT)"] ? element["RRP (Including VAT)"] : "" },`
                sqlQuery += `'${element.Stock ? element.Stock :  "" }', ${element["Weight (g)"] ? element["Weight (g)"] : 0} `
                sqlQuery += "),"        
            }    

        }
    })

    sqlQuery = sqlQuery.slice(0 , -1);
    let splitList =  sqlQuery.split( "VALUES" )
    sqlQuery += ";"


    if( splitList[1] == " " ){
        return {status : false}
    }
    let result = await this.runQuery( sqlQuery )
    return result;

}



exports.runQuery = async( sqlQuery , values )=>{
    const connection = mysql.createConnection({
        host: process.env.DATABASE_USER_HOST,
        user: process.env.DATABASE_USER_NAME,
        password: process.env.DATABASE_USER_PASS,
        database: process.env.DATABASE_DB_NAME,
        insecureAuth: true
    });

    return await new Promise((resolve , rejects)=>{
        connection.connect((err) => {
            if (err) {
                connection.destroy();
                console.error('Error connecting to MySQL database:', err.stack);
                rejects(err)
            } 
            else {
                connection.query(sqlQuery , values , function(err2 , result){
                    if(err2){
                        console.log({err2})
                        connection.destroy();
                        resolve({status : false})
                    }
                    else{
                        connection.destroy();
                        resolve({ status : true , result : result })
                    }
                })                
            }
        });

    })

}


