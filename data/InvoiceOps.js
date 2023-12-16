const Invoice = require("../models/Invoice.js");

class InvoiceOps{
    InvoiceOps() {}

    async getAllInvoices() {
        try{
          console.log("fetching all invoices");
        const invoices = await Invoice.find({}).sort({invoiceName: 1});
        return invoices;
        } catch (error){
          console.error("Error fetching invoices: ", error);
          throw error;
        }
      }
    
      async getInvoiceById(id) {
        try{
          console.log("fetching invoice by id")
          const invoice = await Invoice.findById(id);
          return invoice;
        } catch (error){
          console.error("Error fetching invoices by id: ", error);
          throw error;
        }
      }
    
      async createInvoice(invoiceObj) {
        if(invoiceObj.invoiceNumber )
        try {
          const error = await invoiceObj.validateSync();
          if (error) {
            const response = {
              obj: invoiceObj,
              errorMsg: "Error: Could not create invoice.",
            };
            console.log(error.message)
            return response; // Exit if the model is invalid
          }
    
          // Model is valid, so save it
          const result = await invoiceObj.save();
          const response = {
            obj: result,
            errorMsg: "",
          };
          return response;
        } catch (error) {
          const response = {
            obj: invoiceObj,
            errorMsg: error.message,
          };
          return response;
        }
      }
    
      async deleteInvoice(id) {
        try {
          console.log(`deleting invoice by id ${id}`);
          const deletedInvoice = await Invoice.findByIdAndDelete(id);
          console.log(deletedInvoice);
          return deletedInvoice;
        } catch (error) {
          console.error("Error deleting product: ", error);
          throw error;
        }
      }
    
      async find(query) {
        try {
          const invoices = await Invoice.find(query);
          return invoices;
        } catch (error) {
          throw new Error(`Error finding invoices: ${error.message}`);
        }
      }

      // function for userController to find invoices for a user
      async findInvoicesByInvoiceName(invoiceName) {
        return await Invoice.find({ 
            invoiceName: { $regex: new RegExp(invoiceName, 'i') } 
        });
    }
    
  
    
}

module.exports = InvoiceOps;