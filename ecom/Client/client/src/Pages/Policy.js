import React from 'react';
import Layout from '../Layout/Layout';
import '../Style/Policy.css';

function Policy() {
  return (
    <div className="policy-container">
      <Layout>
        <div className="row contactus">
          <div className="col-md-6">
            <img
              src='https://img.freepik.com/premium-vector/contact-us-customer-support-hotline-people-connect-businessman-using-laptop-touching-virtual-screen-contact-icons-email-address-live-chat-internet-wifi_43780-8623.jpg'
              alt="contactus"
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-md-4">
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Policy;
