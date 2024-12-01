import React, { useState, useEffect } from 'react';
import DropIn from 'braintree-web-drop-in-react';
import axios from 'axios';
import { useCart } from '../Context/Cart';
import { useAuth } from '../Context/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../Layout/Layout';
import "../Style/Cartpage.css";
 
const CartPage = () => {
  const [clientToken, setClientToken] = useState('');
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const { cart, setCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log("Error removing item:", error);
    }
  };

  // Fetch Braintree token
  useEffect(() => {
    const getToken = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/auth/product/braintree/token', {
          headers: {
            'Authorization': `Bearer ${auth.token}` // Pass the user's token for authorization
          }
        });
        if (data?.clientToken) {
          setClientToken(data.clientToken);
          console.log("Client Token:", data.clientToken); // Log the token
        } else {
          throw new Error("Invalid token response");
        }
      } catch (error) {
        console.error("Error fetching client token:", error);
        toast.error("Failed to fetch client token. Please try again later.");
      }
    };

    if (auth?.token) {
      getToken();
    }
  }, [auth?.token]);

  // Handle payment process
  const handlePayment = async () => {
    try {
      setLoading(true);

      if (!auth.token) {
        toast.error("You must be logged in to make a payment");
        setLoading(false);
        return;
      }

      const { nonce } = await instance.requestPaymentMethod();

      const dataToSend = {
        nonce,
        cart: cart.map(item => ({
          _id: item._id,
          price: item.price,
          quantity: item.quantity || 1
        })),
      };

      const response = await axios.post(
        "http://localhost:8080/api/auth/product/braintree/payment",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      toast.success("Payment Completed Successfully", {
        onClose: () => navigate("/Orders"), // Navigate after toast closes
      });
      console.log("Payment Success");
      
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      toast.error("Payment Failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user ? "Hello Guest" : `Hello ${auth?.user?.name}`}
              <p className="text-center">
                {cart?.length ? `You Have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout !"}` : "Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-7 p-0 m-0">
              {cart?.map((p) => (
                <div className="card" key={p._id}>
                  <div className="card-img-container">
                    <img
                      src={`http://localhost:8080/api/auth/product/getproduct-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                  </div>
                  <div className="card-text-container">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price: {p.price}</p>
                  </div>
                  <div className="cart-remove-btn">
                    <button 
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-md-5 cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total: {totalPrice()}</h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/Profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <button
                  className="btn btn-outline-warning"
                  onClick={() => navigate("/login", { state: "/cart" })}
                >
                  Please Login to checkout
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          {auth?.token && clientToken && (
            <>
              <div id="dropin-container">
                <DropIn
                  options={{ authorization: clientToken }}
                  onInstance={(instance) => {
                    console.log('Drop-in UI instance:', instance);
                    setInstance(instance);
                  }}
                />
              </div>
              <button 
                onClick={handlePayment} 
                disabled={loading || !instance} 
                className="btn btn-primary"
              >
                {loading ? 'Processing...' : 'Pay'}
              </button>
            </>
          )}
        </div>
        {/* Position the ToastContainer to always render */}
        <ToastContainer position="top-center" />
      </div>
    </Layout>
  );
};

export default CartPage;
