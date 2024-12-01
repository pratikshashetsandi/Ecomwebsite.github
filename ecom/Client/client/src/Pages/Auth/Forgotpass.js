import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../../Layout/Layout';
import './Registr.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    newPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);

      toast.success("Password updated successfully!", { position: "top-center" });
      navigate('/login');
    } catch (error) {
      setError(error.message);
      toast.error("Failed to update password", { position: "top-center" });
    }
  };

  return (
    <Layout>
      <div className='register-container my-5'>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email:</label>
            <input type='email' name='email' value={formData.email} onChange={handleChange} required />
          </div>
          <div className='form-group'>
            <label>New Password:</label>
            <input type='password' name='newPassword' value={formData.newPassword} onChange={handleChange} required />
          </div>
          <button type='submit'>Reset Password</button>
        </form>
        {error && <div className='error'>{error}</div>}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
