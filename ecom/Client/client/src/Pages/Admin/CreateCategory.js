import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Layout from '../../Layout/Layout';
import AdminMenu from '../../Layout/AdminMenu';
import CategoryForm from '../../component/Form/CategoryForm';
import { Modal } from "antd";

function CreateCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).token : null;
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        'http://localhost:8080/api/auth/category/create-category',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data } = response;
      if (data.success) {
        toast.success("Category created successfully", { position: "top-center" });
        setName('');
        getAllCategory();
      } else {
        toast.error(data.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Create category error:', error);
      toast.error('Failed to create category. Please try again.');
    }
  };

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
      // toast.error('Failed to get categories. Please try again.');
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).token : null;
      if (!token) {
        throw new Error('No token found');
      }

      const { data } = await axios.put(
        `http://localhost:8080/api/auth/category/update-category/${selected._id}`,
        { name: updatedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Category updated successfully!", { position: "top-center" });
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        // toast.error(data.message);
      }
    } catch (error) {
      console.error('Update category error:', error);
      toast.error('Failed to update category. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).token : null;
      if (!token) {
        throw new Error('No token found');
      }

      const { data } = await axios.delete(
        `http://localhost:8080/api/auth/category/delete-category/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        getAllCategory();
        toast.success("Category deleted successfully!", { position: "top-center" });
      } else {
        toast.error(data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error('Failed to delete category. Please try again.');
    }
  };

  return (
    <Layout>
      <div className='row'>
        <div className='col-3'>
          <AdminMenu />
        </div>
        <div className='col-9'>
          <h1>Manage Category</h1>
          <div className='p-3 w-50'>
            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
          </div>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>
                      <button
                        className="btn btn-primary ms-2"
                        onClick={() => {
                          setVisible(true);
                          setUpdatedName(c.name);
                          setSelected(c);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ms-2"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default CreateCategory;
