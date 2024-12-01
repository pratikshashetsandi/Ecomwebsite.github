import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/reset.css";
import { SearchProvider } from "./Context/Search";
import { AuthProvider } from "./Context/auth";
import { CartProvider } from "./Context/Cart";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </CartProvider>
    </SearchProvider>
    </AuthProvider>
  
);

reportWebVitals();
