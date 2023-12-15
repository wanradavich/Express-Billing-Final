const InvoiceOps = require("../data/InvoiceOps");
const Invoice = require("../models/Invoice");
const _invoiceOps = new InvoiceOps();
const ProductOps = require("../data/ProductOps");
const _productOps = new ProductOps();
const ProfileOps = require("../data/ProfileOps");
const _profileOps = new ProfileOps();
const RequestService = require("../data/RequestService");

// const Invoice = require("../models/Invoice.js");

exports.searchInvoice = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated){
    console.log("searching for invoice");
    const searchQuery = req.query.q;
  
    try {
      const invoices = await _invoiceOps.find({
        invoiceName: { $regex: searchQuery, $options: "i" },
      });
  
      res.render("invoices", {
        title: "Invoice Search",
        invoices: invoices,
        reqInfo: reqInfo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.redirect("/user/login?errorMessage=You must be logged in to view this page.")
  }
};

exports.Invoices = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request);
  if (reqInfo.authenticated){
    console.log("loading invoices from controller");
    let invoices = await _invoiceOps.getAllInvoices();
    if (invoices) {
      response.render("invoices", {
        title: "Invoices",
        invoices: invoices,
        layout: "layouts/full-width",
        reqInfo: reqInfo,
      });
    } else {
      response.render("invoices", {
        title: "Express Billing - Invoices",
        invoices: [],
        reqInfo: reqInfo,
      });
    }
  } else {
    response.redirect("/user/login?errorMessage=You must be logged in to view this page.")
  }  
};
  
  exports.InvoiceDetail = async function (request, response) {
    let reqInfo = RequestService.reqHelper(request);
    if (reqInfo.authenticated){
      const invoiceId = request.params.id;
      console.log(`loading single invoice by id ${invoiceId}`);
      let invoice = await _invoiceOps.getInvoiceById(invoiceId);
      let invoices = await _invoiceOps.getAllInvoices();
      if (invoice) {
        response.render("invoiceDetails", {
          title: "Express Yourself - " + invoice.invoiceNumber,
          invoices: invoices,
          invoiceId: request.params.id,
          layout: "layouts/full-width",
          products: invoice.invoiceProduct,
          reqInfo: reqInfo,
        });
      } else {
        response.render("invoiceDetails", {
          title: "Express Yourself - Invoices",
          invoices: [],
          reqInfo: reqInfo,
        });
      }
    } else {
      response.redirect("/user/login?errorMessage=You must be logged in to view this page.")
    }   
  };

  exports.Create = async function (request, response) {
    let reqInfo = RequestService.reqHelper(request);
    if (reqInfo.authenticated){
      let products = await _productOps.getAllProducts();
      console.log(products);
      let profiles = await _profileOps.getAllProfiles();
      response.render("invoice-form", {
        title: "Create Invoice",
        errorMessage: "",
        invoice_id: null,
        invoice: {},
        products: products,
        profiles: profiles,
        reqInfo: reqInfo,
      });
    } else {
      response.redirect("/user/login?errorMessage=You must be logged in to view this page.")
    } 
  };

  exports.CreateInvoice = async function (request, response) {
    let reqInfo = RequestService.reqHelper(request);
    if (reqInfo.authenticated){
      console.log(request.body);

      let profileId = request.body.clientName;
      let profileObj = await _profileOps.getProfileById(profileId);
  
  
      const products = [];
      let totalDue = 0;
  
      for (let i = 0; i < request.body["productIds[]"].length; i++) {
        if (request.body["productIds[]"][i] == "0"){
          continue;
        }
        if (request.body["productIds[]"][i] == ""){
          continue;
        }
        let product = await _productOps.getProductById(request.body["productIds[]"][i]);
        if(request.body["productQuantities[]"][i] != ""){
          product.quantity = request.body["productQuantities[]"][i];
        }
        totalDue += product.unitCost * product.quantity;
        products.push(product);
      }
  
      let tempInvoiceObj = new Invoice({
        invoiceNumber: request.body.invoiceNumber,
        invoiceCompanyName: profileObj,
        invoiceProduct: products,
        invoiceDate: request.body.issueDate,
        invoiceDueDate: request.body.dueDate,
        invoiceTotalDue: totalDue,
        invoiceName: `Invoice # ${request.body.invoiceNumber} - ${profileObj.name}`,
        reqInfo: reqInfo,
      });
      
      let responseObj = await _invoiceOps.createInvoice(tempInvoiceObj);
  
      if(responseObj.errorMsg == "") {
        let invoices = await _invoiceOps.getAllInvoices();
        console.log(responseObj.obj);
        response.render("invoices", {
          title: "Invoice",
          invoiceId: responseObj.obj._id.valueOf(),
          invoices: invoices,
          reqInfo: reqInfo,
        });
      } else {
        let products = await _productOps.getAllProducts();
        let profiles = await _profileOps.getAllProfiles();
        console.log("An error occured. Invoice was not created.");
        response.render("invoice-form", {
          title: "Create Invoice",
          invoice: responseObj.obj,
          errorMessage: responseObj.errorMsg,
          profiles: profiles,
          products: products,
          invoice_id: null,
          reqInfo: reqInfo,
        });
      }
    } else {
      response.redirect("/user/login?errorMessage=You must be logged in to view this page.")
    }  
  };

exports.DeleteInvoiceById = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request);
  if (reqInfo.authenticated){
    const invoiceId = request.params.id;
    console.log(`deleting a single invoice by id ${invoiceId}`);
    let deletedProduct = await _invoiceOps.deleteInvoice(invoiceId);
    let invoices = await _invoiceOps.getAllInvoices();
  
    if (deletedProduct) {
      response.render("invoices", {
        title: "Invoices",
        invoices: invoices,
        reqInfo: reqInfo,
      });
    } else {
      response.render("invoices", {
        title: "Invoices",
        invoices: invoices,
        errorMessage: "Error. Could not delete invoice.",
      });
    }
  } else {
    response.redirect("/user/login?errorMessage=You must be logged in to view this page.")
  } 
};