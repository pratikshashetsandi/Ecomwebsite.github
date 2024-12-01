import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Policy from './Pages/Policy';
import Pagenotfound from './Pages/Pagenotfound';
import Register from './Pages/Auth/Register';
import Login from './Pages/Auth/Login';
import ForgotPassword from './Pages/Auth/Forgotpass';
import Dashboard from './User/Dashboard';
import Admindashboard from './Pages/Admin/Admindashabord';
import CreateCategory from './Pages/Admin/CreateCategory';
import CreateProduct from './Pages/Admin/CreateProduct';
// import Users from './Pages/Admin/Users';
import Profile from './User/Profile';
// import Order from './User/Order';
import Products from './Pages/Admin/Products';

import SearchU from './Pages/Search';
import ProductDetails from './Pages/ProductDetails';
import Categories from './Pages/Categories';
import CategoryProduct from './Pages/CategoryProduct';
import CartPage from './Pages/Cartpage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Orders from './User/Order';
import UpdateProduct from './Pages/Admin/UpdateProduct';
import AdminOrders from './Pages/Admin/Adminorder';
// import UpdateProduct from './Pages/Admin/UpdateProduct';




function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='search' element={<SearchU />} />
        <Route path='/product/:slug' element={<ProductDetails />} />

        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path='cart' element={<CartPage />} />


        <Route path='contact' element={<Contact />} />
        <Route path='about' element={<About />} />
        <Route path='policy' element={<Policy />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
       {/* <Route path='/order' element={<Order/>}/> */}
       <Route path='/orders' element={<Orders/>}/>

        <Route path="admindashboard" element={<Admindashboard />} />    
        {/* <Route path="adminorder" element={< AdminOrders/>} /> */}
        <Route path="/adminorders" element={<AdminOrders />} /> 
        <Route path="createcategory" element={<CreateCategory />} /> 
        <Route path="/createproduct" element={<CreateProduct />} />
        <Route path="/products" element={<Products />} />
        <Route path="/update-product/:slug" element={<UpdateProduct/>} />
       
        

        {/* <Route path='Users' element={<Users />} /> */}
        <Route path='register' element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpass" element={<ForgotPassword />} />
        <Route path='*' element={<Pagenotfound />} />
      </Routes>
      <ToastContainer position='text-center' />
    </>
  );
}

export default App;
