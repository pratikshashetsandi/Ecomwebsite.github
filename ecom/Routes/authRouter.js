const express = require('express');
const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,

} = require('../Controller/authController');
const { isAdmin, requireSignIn } = require('../Mindderware/authmidderware');

// Create a new instance of Express application
const app = express();

//routing
//REGISTER || METHOD POST
app.post('/register', registerController);

//LOGIN || POST
app.post('/login', loginController);

//Forgot Password || POST
app.post('/forgot-password', forgotPasswordController); 

//test routes
app.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
app.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
app.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
//update profile
app.put("/profile", requireSignIn, updateProfileController);

//orders
app.get("/orders", requireSignIn, getOrdersController);

//all orders
// app.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
app.get("/all-orders",requireSignIn, isAdmin,getAllOrdersController);


// order status update
app.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

module.exports = app;
