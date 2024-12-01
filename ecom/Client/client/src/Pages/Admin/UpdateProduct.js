import React, { useEffect, useState } from 'react';
import Layout from '../../Layout/Layout';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import AdminMenu from '../../Layout/AdminMenu';

const { Option } = Select;

function UpdateProduct() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shipping, setShipping] = useState('');
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState('');

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/auth/product/getsingle-product/${slug}`);
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price.toString());
      setQuantity(data.product.quantity.toString());
      setShipping(data.product.shipping ? '1' : '0');
      setCategory(data.product.category._id); // Set category ID for selection
    } catch (error) {
      console.log('Error fetching product:', error);
      // toast.error('Failed to fetch product details');
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [slug]);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/auth/category/getall-category');
      if (data.success) {
        setCategories(data.category);
      } else {
        // toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.log('Error fetching categories:', error);
      // toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const token = localStorage.getItem('authToken');

  const logFormData = (formData) => {
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  };
  
  // Inside handleUpdate function
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    if (!token) {
      // toast.error('Authentication token is missing');
      navigate('/Products');
      return;
    }
  
    try {
      const productData = new FormData();
      productData.append('name', name);
      productData.append('description', description);
      productData.append('price', price);
      productData.append('quantity', quantity);
      if (photo) productData.append('photo', photo);
      productData.append('category', category);
      productData.append('shipping', shipping === '1');
  
      logFormData(productData);
  
      const { data } = await axios.put(
        `http://localhost:8080/api/auth/product/update-product/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('API response:', data);
  
      if (data.success) {
        // toast.success('Product Updated Successfully');
        navigate('/Products');
      } else {
        // toast.error(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.log('Error updating product:', error);
      // toast.error('Something went wrong');
    }
  };
  
  
  const handleDelete = async () => {
    try {
      const answer = window.confirm('Are you sure you want to delete this product?');
      if (!answer) return;

      const { data } = await axios.delete(
        `http://localhost:8080/api/auth/product/delete-product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // toast.success('Product Deleted Successfully');
        navigate('/Products');
      } else {
        // toast.error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.log('Error deleting product:', error);
      // toast.error('Something went wrong');
    }
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <Layout title={'Dashboard - Update Product'}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Update Product</h1>
            <div className='m-1 w-75'>
              <Select
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setCategory(value)}
                value={category}
              >
                {categories && categories.map((c) => (
                  <Option key={c._id} value={c._id}> {/* Ensure this is the ID */}
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className='mb-3'>
                <label className='btn btn-outline-secondary col-md-12'>
                  {photo ? photo.name : 'Upload Photo'}
                  <input
                    type='file'
                    name='photo'
                    accept='image/*'
                    onChange={handlePhotoChange}
                    hidden
                  />
                </label>
              </div>
              <div className='mb-3'>
                {photo && (
                  <div className='text-center'>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt='product_photo'
                      height={'200px'}
                      className='img img-responsive'
                    />
                  </div>
                )}
                {!photo && (
                  <div className='text-center'>
                    <img
                      src={`http://localhost:8080/api/auth/product/getproduct-photo/${id}`}
                      alt='product_photo'
                      height={'200px'}
                      className='img img-responsive'
                    />
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <input
                  type='text'
                  value={name}
                  placeholder='Write a name'
                  className='form-control'
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <textarea
                  value={description}
                  placeholder='Write a description'
                  className='form-control'
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <input
                  type='number'
                  value={price}
                  placeholder='Write a price'
                  className='form-control'
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <input
                  type='number'
                  value={quantity}
                  placeholder='Write a quantity'
                  className='form-control'
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <Select
                  placeholder='Select Shipping'
                  size='large'
                  showSearch
                  className='form-select mb-3'
                  onChange={(value) => setShipping(value)}
                  value={shipping}
                >
                  <Option value='0'>No</Option>
                  <Option value='1'>Yes</Option>
                </Select>
              </div>
              <div className='mb-3'>
                <button className='btn btn-primary' onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className='mb-3'>
                <button className='btn btn-danger' onClick={handleDelete}>
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </Layout>
  );
}

export default UpdateProduct;
