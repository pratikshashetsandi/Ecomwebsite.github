import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../Layout/AdminMenu";
import moment from "moment";
import { Select } from "antd";
import Layout from "../../Layout/Layout";
import { useAuth } from "../../Context/auth";
import '../../Style/Adminorder.css'; // Import the CSS file

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [orders, setOrders] = useState([]);
  const { auth } = useAuth(); // Correctly destructure auth from useAuth

  const getOrders = async () => {
    console.log("Attempting to fetch orders...");
    try {
      const response = await axios.get("http://localhost:8080/api/auth/all-orders", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      console.log('API Response:', response); // Log entire response
      console.log('Orders Data:', response.data); // Log the data property
      
      if (Array.isArray(response.data.orders)) { // Ensure orders is an array
        setOrders(response.data.orders);
      } else {
        console.error("Orders data is not an array:", response.data.orders);
        // Set orders to an empty array to avoid rendering issues
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Set orders to an empty array in case of error
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      // Log the token to debug
      console.log("Token being used:", auth?.token);
  
      const response = await axios.put(
        `http://localhost:8080/api/auth/order-status/${orderId}`,
        { status: value },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`, // Ensure the token format is correct
          },
        }
      );
  
      if (response.data.success) {
        getOrders(); // Refetch orders if status change is successful
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response) {
        // Log error details for more context
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    }
  };
  

  return (
    <Layout title={"All Orders Data"}>
      <div className="orders-container">
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              orders.map((o, i) => (
                <div key={o._id}>
                  <table className="orders-table table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o.status}
                          >
                            {status.map((s, index) => (
                              <Option key={index} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{o.buyer?.name || "No Buyer"}</td>
                        <td>{moment(o.createdAt).fromNow()}</td>
                        <td>{o.payment?.success ? "Success" : "Failed"}</td>
                        <td>{o.products?.length || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="order-details">
                    {o.products?.map((p) => (
                      <div className="details-content" key={p._id}>
                        <img
                          src={`http://localhost:8080/api/auth/product/getproduct-photo/${p._id}`}
                          alt={p.name}
                        />
                        <div>
                          <p><strong>Name:</strong> {p.name}</p>
                          <p><strong>Description:</strong> {p.description.substring(0, 30)}</p>
                          <p><strong>Price:</strong> {p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
