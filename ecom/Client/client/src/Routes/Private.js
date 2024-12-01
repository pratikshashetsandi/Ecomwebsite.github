import { useState, useEffect } from "react";
import { useAuth } from "../Context/auth";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/auth/user-auth", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  if (ok) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
}
