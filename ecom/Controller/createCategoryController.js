const { default: slugify } = require("slugify");
const CategoryModel = require("../Model/Category.model");

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    // Check if category already exists
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).json({
        success: false,
        message: "Category Already Exists",
      });
    }

    // Create new category
    const category = await new CategoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).json({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.error("Error in createCategoryController:", error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in creating category",
    });
  }
};

module.exports = { createCategoryController };


//updatcategory
const updateCateogryController = async (req,res) =>{
    try{
        const {name} = req.body;
        const {id} = req.params;
        const category = await CategoryModel.findByIdAndUpdate(
            id,
            {name,slug:slugify(name)},
            {new:true}
        );
        res.status(200).send({
            success:true,
            message:"Category Updated Successfully",
            category,
        });
    } catch (error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while updating category"
        });
    }
};

//getall category

const getAllCategoriesController = async (req, res) => {
    try {
      const categories = await CategoryModel.find({});
      res.status(200).send({
        success: true,
        message: "All Categories List",
        categories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "Error while getting all categories",
        error: error.message,
      });
    }
  };
  
  //get single category
   const singleCategoryController = async (req, res) => {
    try {
      const category = await CategoryModel.findOne({ slug: req.params.slug });
      res.status(200).send({
        success: true,
        message: "Get SIngle Category SUccessfully",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While getting Single Category",
      });
    }
  };

  const deleteCategoryCOntroller = async (req, res) => {
    try {
      const { id } = req.params;
      await CategoryModel.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Categry Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while deleting category",
        error,
      });
    }
  };
  
module.exports = { createCategoryController, updateCateogryController,getAllCategoriesController,singleCategoryController,deleteCategoryCOntroller }
