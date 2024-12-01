import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Spinner from "../components/Spinner";
import { useAuth } from "../Context/auth";

const AdminRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const res = await axios.get("/api/auth/admin-auth", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (res.data.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate('/login'); // Redirect to login if not admin
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      checkAdminRole();
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [auth, navigate]);

  // if (loading) return <Spinner />;

  return isAdmin ? <>{/* Your admin dashboard component */}</> : null;
};

export default AdminRoute;
