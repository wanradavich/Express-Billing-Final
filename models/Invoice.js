const mongoose = require('mongoose');
const Profile = require("./Profile");
const Product = require("./Product");
// const passportLocalMongoose = require("passport-local-mongoose");

const invoiceSchema = new mongoose.Schema({
        invoiceName: {
            type: String,
            required: true
        },
        invoiceNumber: {
            type: Number,
            unique: true,
            required: true,
            
        },
        invoiceCompanyName: {
            type: Profile.schema,
            required: true
        },
        invoiceProduct: [{
            type: Product.schema,
            required: true
        }],
        invoiceDate: {
            type: String,
            required: true
        },
        invoiceTotalDue: {
            type: Number,
            required: true
        },
        invoiceDueDate: {
            type: String,
            required: true
        },
       paid: { //field used to track payment status
            type: Boolean,
            default: false, // set default value to false (unpaid)
       }

    },
    {
        collection: "invoices"
    }
);
// invoiceSchema.plugin(passportLocalMongoose);
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;