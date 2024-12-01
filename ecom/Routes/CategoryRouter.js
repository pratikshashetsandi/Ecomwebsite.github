// categoryRouter.js
const express = require("express");
const { isAdmin, requireSignIn } = require("../Mindderware/authmidderware");
const { createCategoryController,updateCateogryController,getAllCategoriesController,singleCategoryController,deleteCategoryCOntroller } = require("../Controller/createCategoryController");
const router = express.Router();

router.post('/create-category', requireSignIn, isAdmin, createCategoryController);
router.put('/update-category/:id', requireSignIn, isAdmin, updateCateogryController)
router.get('/getall-category', getAllCategoriesController);
router.get('/single-category/:slug',singleCategoryController)
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryCOntroller)

module.exports = router;
