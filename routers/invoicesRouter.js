const express = require("express");
const invoicesRouter = express.Router();
const invoiceController = require("../controllers/invoiceController");

//route for invoice listing page
invoicesRouter.get("/", invoiceController.Invoices);

//route for create
invoicesRouter.get("/create", invoiceController.Create);
invoicesRouter.post("/create", invoiceController.CreateInvoice);

//route for getById
invoicesRouter.get("/:id", invoiceController.InvoiceDetail);

//route for delete
invoicesRouter.get("/:id/delete", invoiceController.DeleteInvoiceById);

module.exports = invoicesRouter;