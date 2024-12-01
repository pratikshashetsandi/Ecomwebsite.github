import React, { useState, useEffect } from "react";
import UserMenu from "../Layout/UserMenus";
import Layout from "../Layout/Layout";
import { useAuth } from "../Context/auth";
import moment from "moment";
import axios from "axios";
import "../Style/order.css"; // Import scoped CSS

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { auth } = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/auth/orders", {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      console.log("Orders fetched:", data);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="orders-container container-fluid p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((o, i) => (
                <div className="order-card border shadow" key={o._id}>
                  <table className="table orders-table">
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
                        <td>{o?.status || "Unknown"}</td> {/* Display the order status */}
                        <td>{o?.buyer?.name || "Unknown"}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {o?.products?.map((p) => (
                      <div className="order-card d-flex flex-row mb-2 p-3" key={p._id}>
                        <img
                          src={`http://localhost:8080/api/auth/product/getproduct-photo/${p._id}`}
                          alt={p.name}
                        />
                        <div className="card-body">
                          <p>{p.name}</p>
                          <p>{p.description.substring(0, 30)}...</p>
                          <p>Price: {p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No orders found</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
