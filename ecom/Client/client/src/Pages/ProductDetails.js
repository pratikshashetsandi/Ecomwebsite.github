import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../Style/Productdetails.css"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null); // Initialize as null
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/auth/product/getsingle-product/${params.slug}`
        );
        if (data?.product) {
          setProduct(data.product);
          getSimilarProduct(data.product._id, data.product.category?._id);
        } else {
          console.error('Product data not found');
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getSimilarProduct = async (pid, cid) => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/auth/product/related-product/${pid}/${cid}`
        );
        setRelatedProducts(data?.products || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    // Logic for adding product to cart goes here
    // This might involve updating a global cart state or local storage
    console.log('Add to cart:', product.name);
    toast.success("Password updated successfully!", { position: "top-center" });
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`http://localhost:8080/api/auth/product/getproduct-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            style={{
              height: '400px',
              width: '100%',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>
          <h6>
            Price: 
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h6>
          <h6>Category: {product.category?.name}</h6>
          <button className="btn btn-secondary ms-1" onClick={handleAddToCart}>
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 ? (
          <p className="text-center">No Similar Products found</p>
        ) : (
          <div className="d-flex flex-wrap">
            {relatedProducts.map((p) => (
              <div className="card m-2" key={p._id} style={{ width: "250px" }}>
                <img
                  src={`http://localhost:8080/api/auth/product/getproduct-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  style={{
                    height: '300px',
                    width: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </h5>
                  <p className="card-text">
                    {p.description.substring(0, 60)}...
                  </p>
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
