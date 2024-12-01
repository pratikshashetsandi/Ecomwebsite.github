import React, { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox, Radio, Input } from "antd";
import { Prices } from "../Context/Prices";
import Layout from "../Layout/Layout";
import { useCart } from "../Context/Cart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Search } = Input;

const HomePage = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts(); // Initial fetch
  }, []);

  const getAllCategory = async () => {
    try {
      const token = localStorage.getItem("auth")
        ? JSON.parse(localStorage.getItem("auth")).token
        : null;
      if (!token) {
        throw new Error("No token found");
      }

      const { data } = await axios.get(
        "http://localhost:8080/api/auth/category/getall-category",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Get categories error:", error);
      setCategories([]);
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/auth/product/getall-product`
      );
      console.log("Products data:", data);
      setLoading(false);
      setProducts(data.products || []);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/auth/product/product-count"
      );
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Error fetching total products:", error);
      setTotal(0);
    }
  };

  useEffect(() => {
    if (page > 1) {
      loadMore();
    }
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/auth/product/product-list/${page}`
      );
      console.log("Load more data:", data);
      setProducts((prevProducts) => [...prevProducts, ...(data?.products || [])]);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length && !radio.length && !searchQuery) getAllProducts();
    else filterProduct();
  }, [checked, radio, searchQuery]);

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/product/product-filters",
        {
          checked,
          radio,
          searchQuery
        }
      );
      console.log("Filtered products data:", data);
      setProducts(data?.products || []);
    } catch (error) {
      console.error("Error filtering products:", error);
      setProducts([]);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleAddToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item Added To Cart", { position: "top-center" });
  };

  return (
    <Layout title="All Products - Best offers ">
      <img
        src="https://github.com/techinfo-youtube/ecommerce-app-2023/blob/15-admin-orders-css/client/public/images/banner.png?raw=true"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      <div className="container-fluid row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group
              onChange={(e) => setRadio(e.target.value)}
              value={radio}
            >
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => {
                setChecked([]);
                setRadio([]);
                setSearchQuery("");
                getAllProducts();
              }}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="mb-3">
            <div className="search-container">
              <Search
                placeholder="Search products"
                enterButton="Search"
                onSearch={handleSearch}
                style={{ width: "100%", marginRight: "8px" }}
              />
            </div>
          </div>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                <img
                  src={`http://localhost:8080/api/auth/product/getproduct-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  style={{
                    height: "300px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text">Rs {p.price}</p>
                  <button
                    className="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-secondary ms-1"
                    onClick={() => handleAddToCart(p)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prevPage) => prevPage + 1);
                }}
                disabled={loading || products.length >= total}
              >
                {loading ? "Loading ..." : "Load more"}
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </Layout>
  );
};

export default HomePage;
