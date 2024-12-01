import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Context/auth';
import useCategory from '../Hook/UseCategory';
import { useCart } from '../Context/Cart';
import { Badge } from 'antd';
import '../Style/Home.css';

const Header = () => {
  const { auth, setAuth } = useAuth();
  const { cart } = useCart();
  const categories = useCategory();
  const navigate = useNavigate();
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const handleLogout = () => {
    console.log('Auth state:', auth);
    console.log('SetAuth function:', setAuth);
    
    localStorage.removeItem('auth');
    setAuth({ user: null, token: "" });
    toast.success("You're logout in successfully!", { position: "top-center" });
    navigate('/login');
  
  };  

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <div className={`collapse navbar-collapse ${categoryDropdownOpen || adminDropdownOpen ? 'show' : ''}`} id="navbarTogglerDemo01">
          <Link to="/" className="navbar-brand">
            🛒 Ecommerce App
          </Link>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdownCategories"
                role="button"
                onClick={() => setCategoryDropdownOpen(prev => !prev)}
                aria-expanded={categoryDropdownOpen ? "true" : "false"}
              >
                Categories
              </a>
              <ul className={`dropdown-menu ${categoryDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdownCategories">
                <li>
                  <Link className="dropdown-item" to="/categories">All Categories</Link>
                </li>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map(category => (
                    <li key={category._id}>
                      <Link className="dropdown-item" to={`/category/${category.slug}`}>{category.name}</Link>
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">No categories available</li>
                )}
              </ul>
            </li>
            <li className="nav-item">
              <Badge count={cart.length} showZero offset={[10, -5]}>
                <NavLink to="/cart" className="nav-link">Cart</NavLink>
              </Badge>
            </li>
            {!auth?.user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">Register</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">Login</NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownUser"
                  role="button"
                  onClick={() => setAdminDropdownOpen(prev => !prev)}
                  aria-expanded={adminDropdownOpen ? "true" : "false"}
                >
                  {auth?.user?.name}
                </a>
                <ul className={`dropdown-menu ${adminDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdownUser">
                  <li>
                    <NavLink
                      to={auth.user.role === "admin" ? "/admindashboard" : "/dashboard"}
                      className="dropdown-item"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item">Logout</button>
                  </li>
                </ul>
              </li>
            )}
             {/* <ToastContainer position="top-center" /> */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
