require("dotenv").config();
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");


exports.isUrl = (str)=>{
    const urlPattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;
    return urlPattern.test(str);
  
}


exports.generateOrderNumber = (length)=>{
    let result = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  }


exports.sendEmail = async (recieverMail , subject , body)=>{
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.EMAIL_ADDRESS,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  
  const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.SENDGRID_API_KEY,
      },
    })
  );
  



  // Define the email options
  const mailOptions = {
      from: process.env.EMAIL_ADDRESS ,
      to: recieverMail ,
      subject: subject ,
      html: body,
  };


  // Send the email
  return await new Promise((resolve , reject)=>{
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Mail Error :- " , {error})
          resolve( { status : false , message : error.message } )
        } else {
          console.log("Mail Info :- " , {info})
          resolve( {status : true , message : info.messageId} )
        }
      });
  
  })

}




exports.extractNameFromMail = (email)=>{
  let parts = email.split("@");
  let username = parts[0];

  // Split the username by periods or underscores
  let nameParts = username.split(/[._]/);

  // Capitalize the first letter of each name part
  let capitalizedNames = nameParts.map(function(part) {
    return part.charAt(0).toUpperCase() + part.slice(1);
  });

  // Join the capitalized name parts with a space
  let fullName = capitalizedNames.join(" ");

  return fullName;  
}
