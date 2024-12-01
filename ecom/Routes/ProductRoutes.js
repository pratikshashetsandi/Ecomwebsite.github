// ProductRoutes.js
const express = require('express');
const formidable = require('express-formidable');
const { createProductController, getProductController ,getsingleProuctController,productPhotoController,
    deleteProductController,updateProductController,productFiltersController,relatedProductController,
    searchProductController,productCountController,productListController,productCategoryController,
    brainTreePaymentController,braintreeTokenController
 }
 = require('../Controller/ProductController');

 
const { isAdmin, requireSignIn } = require('../Mindderware/authmidderware');

const router = express.Router();

router.post('/create-product', formidable(), requireSignIn, isAdmin, createProductController);

router.get('/getall-product', getProductController);

router.get('/getsingle-product/:slug',getsingleProuctController );

router.get('/getproduct-photo/:pid',productPhotoController);

router.delete('/delete-product/:pid',deleteProductController);

router.put('/update-product/:pid',formidable(),requireSignIn,isAdmin,updateProductController);

router.post('/product-filters',productFiltersController);

router.get('/product-count', productCountController);

router.get("/product-list/:page",productListController);

router.get('/search/:keyword', searchProductController);

router.get("/related-product/:pid/:cid", relatedProductController);

//category wise product
router.get("/product-category/:slug",productCategoryController);

router.get('/braintree/token', braintreeTokenController);

router.post('/braintree/payment', requireSignIn, brainTreePaymentController);



module.exports = router;