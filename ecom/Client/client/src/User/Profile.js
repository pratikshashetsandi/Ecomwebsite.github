import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/auth";
import axios from "axios";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import Layout from "../Layout/Layout";
import UserMenu from "../Layout/UserMenus";

const Profile = () => {
  const { auth, setAuth } = useAuth();
  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (auth && auth.user) {
      const { name, email, phone, address } = auth.user;
      setName(name || "");
      setEmail(email || "");
      setPhone(phone || "");
      setAddress(address || "");
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("http://localhost:8080/api/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (data?.error) {
        // toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data.updatedUser });
        // toast.success("Profile Updated Successfully");
        let ls = JSON.parse(localStorage.getItem("auth"));
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        console.log(data.updatedUser);
      }
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
      if (error.response) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.message || "Bad Request: Please check your input data.";
          // toast.error(errorMessage);
        } else {
          // toast.error("Something went wrong: " + error.response.data.message);
        }
      } else {
        // toast.error("Network Error: Please try again later.");
      }
    }
  };

  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid m-3 p-3 dashboard my-5">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-8">
            <div className="form-container" style={{ marginTop: "-40px" }}>
              <form onSubmit={handleSubmit}>
                <h4 className="title"> PROFILE</h4>
                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Name"
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Email"
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Password"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Phone"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Address"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  UPDATE
                </button>
              </form>
              {/* <ToastContainer /> */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
