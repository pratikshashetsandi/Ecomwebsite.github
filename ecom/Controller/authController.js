const Usermodel = require("../Model/Usermodel");
const { comparePassword, hashPassword } = require("../Helper/authhelper");
const{orderModel} = require("../Model/Order.model")
const jwt = require("jsonwebtoken");
const OrderModel = require("../Model/Order.model");

// Register Controller
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // Validations
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });
    if (!phone) return res.status(400).json({ error: "Phone number is required" });
    if (!address) return res.status(400).json({ error: "Address is required" });
    if (!role) return res.status(400).json({ error: "Role is required" });

    // Check if user exists
    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Already registered. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user
    const user = await new Usermodel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role,
    }).save();

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in registration.",
      error: error.message,
    });
  }
};



// Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password.",
      });
    }
    // Check user
    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered.",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password.",
      });
    }
    // Generate token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        Address: user.Address, 
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login.",
      error,
    });
  }
};

// Forgot Password Controller
const forgotPasswordController = async (req, res) => {
  try {
    const { email,  newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required." });
    }
   
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required." });
    }
    // Check user and validation
    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer.",
      });
    }
    // Hash new password and update
    const hashed = await hashPassword(newPassword);
    await Usermodel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong.",
      error,
    });
  }
};

// upprofile
const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, Address, phone } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !Address) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, phone, Address) are required",
      });
    }

    if (password && password.length < 5) {
      return res.status(400).json({ error: "Password must be at least 5 characters long" });
    }

    const user = await Usermodel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : user.password;

    const updatedUser = await Usermodel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        Address: Address || user.Address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

// ordes
const getOrdersController = async (req, res) => {
  try {
    console.log("Fetching orders for user ID:", req.user._id);

    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing",
      });
    }

    const orders = await OrderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    console.log("Orders fetched:", orders);

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Error while getting orders:", error); // Log full error details
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error: error.message || "Internal Server Error",
    });
  }
};

// Check if the API returns orders
const getAllOrdersController = async (req, res) => {
  try {
    console.log("Fetching orders...");
    const orders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    console.log('Fetched Orders:', orders);

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error While Getting Orders:", error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error: error.message,
    });
  }
};







// Update Order Status Controller
const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({
      success: false,
      message: "Error While Updating Order",
      error: error.message,
    });
  }
};



// Test Controller
const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  testController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
};
