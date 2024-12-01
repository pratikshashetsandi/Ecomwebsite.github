import React from 'react';
import useCategory from "../Hook/UseCategory";
import { Link } from "react-router-dom";
import Layout from '../Layout/Layout';
import "../Style/Categories.css"; // Ensure the path is correct

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout>
      <div className="categories-container">
        <h1 className="categories-heading">All Categories</h1>
        <div className="list-group">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <Link 
                key={category._id} 
                className="list-group-item" 
                to={`/category/${category.slug}`}
              >
                {category.name}
              </Link>
            ))
          ) : (
            <div className="no-categories">No categories available</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
