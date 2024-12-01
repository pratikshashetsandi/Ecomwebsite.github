import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../Auth/Registr.css';
import Layout from '../../Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    role: 'user'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', formData);
  
      if (response.data.success) {
        toast.success("Registered Successfully", { position: "top-center" });
        setTimeout(() => {
          navigate('/Login');
        }, 2000); // delay navigation by 2 seconds
      } else {
        toast.error(response.data.message || "Registration Failed", { position: "top-center" });
      }
    } catch (error) {
      toast.error("Registration Failed", { position: "top-center" });
    }
  };
  

  return (
    <Layout>
      <div className='register-container my-5'>
        <h4 className='text-center'>Register</h4>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Name:</label>
            <input type="text" name="name" placeholder="Enter Name" value={formData.name} onChange={handleChange}  />
          </div>

          <div className='form-group'>
            <label>Email:</label>
            <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange}  />
          </div>

          <div className='form-group'>
            <label>Password:</label>
            <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange}  />
          </div>

          <div className='form-group'>
            <label>Phone:</label>
            <input type="text" name="phone" placeholder="Enter Phone" value={formData.phone} onChange={handleChange}  />
          </div>

          <div className='form-group'>
            <label>Address:</label>
            <input type="text" name="address" placeholder="Enter Address" value={formData.address} onChange={handleChange}  />
          </div>

          <div className='form-group'>
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit">Register</button>
        </form>
        <ToastContainer position="top-center" />
      </div>
    </Layout>
  );
};

export default Register;
