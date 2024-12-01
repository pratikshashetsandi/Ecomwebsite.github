import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/auth/category/getall-category");
      console.log("Fetched categories:", data); // Debugging log
      setCategories(data.categories);
      console.log("Categories state:", data?.category || []); // Debugging log
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}
