const mongoose = require('mongoose');
const Profile = require("./Profile");
const Product = require("./Product");

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

    },
    {
        collection: "invoices"
    }
);
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;