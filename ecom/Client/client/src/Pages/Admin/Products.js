import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Layout/AdminMenu";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8); // Initial number of products to display
  const [isLoading, setIsLoading] = useState(false);

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/auth/product/getall-product"
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching products");
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  // Load more products
  const loadMoreProducts = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProducts((prevVisible) => prevVisible + 8);
      setIsLoading(false);
    }, 500); // Simulate a delay for better UX
  };

  // Delete product
  const handleDelete = async (productId) => {
    try {
      // Send delete request to the server
      await axios.delete(
        `http://localhost:8080/api/auth/product/delete-product/${productId}`
      );

      // Update the products state to remove the deleted product
      setProducts(products.filter((product) => product._id !== productId));

      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting the product");
    }
  };

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products List</h1>
          <div className="d-flex flex-wrap">
            {products.slice(0, visibleProducts).map((p) => (
              <div key={p._id} className="product-link">
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`http://localhost:8080/api/auth/product/getproduct-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                    <div className="d-flex justify-content-between">
                      <Link to={`/product/${p.slug}`} className="btn btn-primary">
                        View
                      </Link>
                      <Link to={`/update-product/${p.slug}`} className="btn btn-warning">
                        Update
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {visibleProducts < products.length && (
            <div className="text-center mt-4">
              <button
                className="btn btn-secondary"
                onClick={loadMoreProducts}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default Products;
