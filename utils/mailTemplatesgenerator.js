require("dotenv").config();
const fs = require("fs");
const path = require("path");


exports.makeTableRowsHtml = ( orderDetails )=>{
    let html = "";
    orderDetails.map((item)=>{
        html += '<tr class="table-row">'
        html += `<td style="padding: 10px;">${item.productName}</td>`
        html += `<td style="padding: 10px;">${item.quantity}</td>`
        html += `<td style="padding: 10px;">${item.amount}</td>`
        html += '</tr>'
    })
    return html;
}

exports.populateEmailTemplate = ( templateName , replaceValues )=>{
    const content = fs.readFileSync(
        path.join(__dirname, `../${process.env.STATIC_DIR}/templates/${templateName}`),
        'utf8',
    );


    let emailTemaplate = content;
    replaceValues.map((item_)=>{
        let key_ = "${" + item_.original + "}";
        emailTemaplate = emailTemaplate.replaceAll( key_ , item_.newVal  )
    })

    return emailTemaplate;
}


