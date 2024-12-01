import React from "react";
import Layout from "../../Layout/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../Context/auth";
import AdminMenu from "../../Layout/AdminMenu";
import "../../Style/Admind.css"; // Import the CSS file

const AdminDashboard = () => {
  const { auth } = useAuth();
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <div className="admin-menu">
              <AdminMenu />
            </div>
          </div>
          <div className="col-md-7">
            <div className="admin-info mx-4">
              <h3>Admin Name: {auth?.user?.name}</h3>
              <h3>Admin Email: {auth?.user?.email}</h3>
              <h3>Admin Contact: {auth?.user?.phone}</h3>
              {/* <h3> Admin Address : {auth?.user?.Address}</h3> */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
