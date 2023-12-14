const express = require("express");
const productsRouter = express.Router();
const productController = require("../controllers/ProductController");
 


  productsRouter.get("/", productController.Products);
//router for create
  productsRouter.get("/edit", productController.Create);
  
  productsRouter.post("/edit", productController.CreateProduct);
  
  productsRouter.get("/:id", productController.ProductDetail);
  //router for get by id
  productsRouter.get("/edit/:id", productController.Edit);
  
  productsRouter.post("/edit/:id", productController.EditProduct);
//router for delete
  productsRouter.get("/:id/delete", productController.DeleteProductById);



 

module.exports = productsRouter;