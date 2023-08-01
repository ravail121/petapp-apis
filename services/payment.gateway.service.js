require("dotenv").config();
const stripe = require('stripe')( process.env.STRIPE_SECRET_KEY );

// Get product
exports.createIntent = async (amount , currency , name , address , country , description) => {
    try {

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            description: description, // Add your export transaction description here
            // payment_method_types: ['card'],
            automatic_payment_methods: {enabled: true},
            shipping: {
                name: name , // Replace with the customer's name
                address: {
                  line1: address, // Replace with the customer's address line 1
                  country: country, // Replace with the customer's country code (e.g., IN for India)
                }
              }            
        });
        const clientSecret = paymentIntent.client_secret;

        console.log({paymentIntent})
                    

        return {
            statusCode: 200,
            success: true,
            data : { clientSecret },
            message: "Payment Intent Created Succesfully",
        };

    } catch (err) {
        console.log({err})
        return {
            statusCode: 400,
            success: false,
            data : {},
            message: "Payment Intent Not Created. Error Occured",
        };
    }
};