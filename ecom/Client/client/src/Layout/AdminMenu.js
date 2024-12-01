// AdminMenu.js
import React from "react";
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminMenu = () => {
  return (
    <div className="text-center">
      <div className="list-group dashboard-menu">
        <h4>Admin Panel</h4>
        <NavLink
          to="/CreateCategory"
          className={({ isActive }) => 
            isActive ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
          }
        >
          Create Category
        </NavLink>
        <NavLink
          to="/CreateProduct"
          className={({ isActive }) => 
            isActive ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
          }
        >
          Create Product
        </NavLink>

        <NavLink
          to="/AdminOrders"
          className={({ isActive }) => 
            isActive ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
          }
        >
       order
        </NavLink>

        <NavLink
          to="/Products"
          className={({ isActive }) => 
            isActive ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
          }
        >
          Products
        </NavLink>
        {/* <NavLink
          to="/UpdateProduct"
          className={({ isActive }) => 
            isActive ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
          }
        >
          Update Product
        </NavLink> */}
      </div>
    </div>
  );
};

export default AdminMenu;
