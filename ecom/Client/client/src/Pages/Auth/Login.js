import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../../Layout/Layout';
import { useAuth } from '../../Context/auth';
import '../Auth/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const authData = {
        token: response.data.token,
        user: response.data.user
      };
  
      localStorage.setItem('auth', JSON.stringify(authData));
      setAuth(authData);
  
      // Show toast notification based on user role
      if (response.data.user.role === 'admin') {
        toast.success("Admin logged in successfully!", { position: "top-center" });
        setTimeout(() => {
          navigate('/');
        }, 2000); // Delay navigation by 2 seconds to allow the toast to display
      } else {
        toast.success("User logged in successfully!", { position: "top-center" });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000); // Delay navigation by 2 seconds to allow the toast to display
      }
  
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Unable to connect to the server. Please try again later.");
      toast.error("Login Failed", { position: 'top-center' });
    }
  };
  

  const handleForgotPasswordClick = () => {
    navigate('/forgotpass');
  };

  return (
    <Layout>
      <div className='login-container my-5'>
        <h4>Login</h4>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email:</label>
            <input 
              type='email' 
              name='email' 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className='form-control'
            />
          </div>
          <div className='form-group'>
            <label>Password:</label>
            <input 
              type='password' 
              name='password' 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className='form-control'
            />
          </div>
          <button type='button' onClick={handleForgotPasswordClick} className='btn btn-link'>Forgot Password</button>
          <button type='submit' className='btn btn-primary'>Login</button>
        </form>
        {error && <div className='error text-danger'>{error}</div>}
        
        <ToastContainer position="top-center" />
      </div>
    </Layout>
  );
};

export default Login;
