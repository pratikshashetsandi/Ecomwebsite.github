const ProductModel = require("../Model/Productmodel");
const categoryModel = require("../Model/Category.model")
const fs = require('fs');
const slugify = require("slugify");
const CategoryModel = require("../Model/Category.model");


const dotenv = require('dotenv');
dotenv.config();

//payment 

const braintree = require('braintree');
const OrderModel = require("../Model/Order.model");




const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // Log incoming fields and files
    console.log('Received fields:', req.fields);
    console.log('Received files:', req.files);

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required" });
      case !price:
        return res.status(400).send({ error: "Price is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const product = new ProductModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      try {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
        product.photo.name = photo.name;
        console.log('Photo read and processed successfully');
      } catch (fileReadError) {
        console.error('Error reading photo file:', fileReadError);
        return res.status(500).send({ error: "Error processing photo file" });
      }
    }

    // Save the product in the database
    await product.save();

    // Convert photo data to base64 for response
    let photoBase64 = null;
    if (product.photo && product.photo.data) {
      photoBase64 = `data:${product.photo.contentType};base64,${product.photo.data.toString('base64')}`;
    }

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product: {
        ...product.toObject(),
        photo: {
          data: photoBase64,
          contentType: product.photo.contentType,
          name: product.photo.name
        }
      }
    });
  } catch (error) {
    console.error('Error in creating product:', error);
    res.status(500).send({
      success: false,
      error: error.message || error,
      message: "Error in creating product",
    });
  }
};

// Get all products 
const getProductController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// Get single product
const getsingleProuctController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in getting single product",
      error: error.message,
    });
  }
};

// Get photo
const productPhotoController = async (req, res) => {
  try {
    console.log(`Fetching product with id ${req.params.pid}`);
    const product = await ProductModel.findById(req.params.pid).select("photo");

    if (!product) {
      console.log(`Product with id ${req.params.pid} not found`);
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    console.log(`Product found: ${product._id}`);
    if (!product.photo || !product.photo.data) {
      console.log(`Photo not found for product with id ${req.params.pid}`);
      return res.status(404).send({
        success: false,
        message: "Photo not found",
      });
    }

    console.log("Photo data length: ", product.photo.data.length);
    res.set("Content-Type", product.photo.contentType);
    return res.status(200).send(product.photo.data);
  } catch (error) {
    console.error("Error during fetching photo: ", error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error: error.message || error,
    });
  }
};

// Delete product
const deleteProductController = async (req, res) => {
  try {
    const productId = req.params.pid;
    console.log(`Attempting to delete product with id ${productId}`);

    if (!productId) {
      return res.status(400).send({
        success: false,
        message: "Product ID is required",
      });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(productId).select("-photo");

    if (!deletedProduct) {
      console.log(`Product with id ${productId} not found`);
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    console.log(`Product with id ${productId} deleted successfully`);
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting product: ", error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: error.message || error,
    });
  }
};

// Update product
const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required" });
      case !price:
        return res.status(400).send({ error: "Price is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const products = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating product",
    });
  }
};

// Filters
const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body; // Extract checked (categories) and radio (price range) from the request body
    let args = {};

    if (checked.length > 0) {
      // If there are selected categories, add them to the filter criteria
      args.category = { $in: checked };
    }

    if (radio.length > 0) {
      // If there is a price range selected, add it to the filter criteria
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await ProductModel.find(args); // Use the constructed query to find products
    res.status(200).send({
      success: true,
      products, // Send the filtered products back to the client
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};


// Product count
const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// Product list based on page
const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const product = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product list per page",
      error,
    });
  }
};

// Search
const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await ProductModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in search product API",
      error,
    });
  }
};

// Similar products
const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting related products",
      error,
    });
  }
};

// product category

const productCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    const products = await ProductModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: process.env.PAYPAL_MODE, // sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

//token
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        console.error("Error generating client token:", err);
        res.status(500).send({ error: "Failed to generate client token" });
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.error("Unexpected error in token controller:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};


const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};




module.exports = {
  createProductController,
  getProductController,
  getsingleProuctController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  brainTreePaymentController,
  braintreeTokenController,
};