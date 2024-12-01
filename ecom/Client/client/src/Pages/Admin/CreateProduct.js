import React, { useState, useEffect } from 'react';
import Layout from '../../Layout/Layout';
import AdminMenu from '../../Layout/AdminMenu';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';

const { Option } = Select;

function CreateProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shipping, setShipping] = useState('');
  const [photo, setPhoto] = useState('');

  const getAllCategory = async () => {
    try {
      const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).token : null;
      if (!token) {
        throw new Error('No token found');
      }

      const { data } = await axios.get('http://localhost:8080/api/auth/category/getall-category', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message || 'Failed to get categories');
      }
    } catch (error) {
      console.error('Get categories error:', error);
      toast.error('Failed to get categories. Please try again.');
    }
  };

  useEffect(() => {
    getAllCategory();
    // toast.success('Toast notifications are working!');
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log('handleCreate called');
    try {
      const productData = new FormData();
      productData.append('name', name);
      productData.append('description', description);
      productData.append('price', price);
      productData.append('quantity', quantity);
      productData.append('category', category);
      productData.append('shipping', shipping);
      
      if (photo) {
        productData.append('photo', photo);
      }
  
      const slug = slugify(name, { lower: true, strict: true });
      productData.append('slug', slug);
  
      console.log('Sending product data:', {
        name,
        description,
        price,
        quantity,
        photo: photo?.name,
        category,
        shipping,
        slug
      });
  
      const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).token : null;
      if (!token) {
        throw new Error('No token found');
      }
  
      const { data } = await axios.post(
        'http://localhost:8080/api/auth/product/create-product',
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      console.log('API response:', data);
  
      if (data.success) {
        toast.success('Product Created Successfully');
        setTimeout(() => {
          navigate('/Products');
        }, 100); // Delay navigation to allow the toast to be visible
      } else {
        toast.error(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Create product error:', error.response ? error.response.data : error.message);
      toast.error('Something went wrong');
    }
  };

  return (
    <Layout>
      <div className='row'>
        <div className='col-3'>
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>Create Product</h1>
          <div className="m-1 w-75">
            <Select
              variant="default"
              placeholder="Select a category"
              size="large"
              showSearch
              className="form-select mb-3"
              onChange={(value) => setCategory(value)}
            >
              {categories?.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>

            <div className="mb-3">
              <label className="btn btn-outline-secondary col-md-12">
                {photo ? photo.name : 'Upload Photo'}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>
            <div className="mb-3">
              {photo && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product_photo"
                    height={'200px'}
                    className="img img-responsive"
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={name}
                placeholder="Write a name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <textarea
                type="text"
                value={description}
                placeholder="Write a description"
                className="form-control"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                value={price}
                placeholder="Write a price"
                className="form-control"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                value={quantity}
                placeholder="Write a quantity"
                className="form-control"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <Select
                bordered={false}
                placeholder="Select Shipping"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setShipping(value)}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" onClick={handleCreate}>
                CREATE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default CreateProduct;
