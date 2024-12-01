import React from 'react'
import Layout from '../Layout/Layout'
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

function Contact() {
  return (
    <div>
      <Layout>
     
     <div className=' row contacus'>
      <div className='col-md-6'>
        <img src='https://img.freepik.com/premium-vector
        /contact-us-customer-support-hotline-people-connect-businessman-using-laptop-
        touching-virtual-screen-contact-icons-email-address-live-chat-internet-
        wifi_43780-8623.jpg' alt="contactus"
        style={{ width: "100%" }}></img>
      </div>

      <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about prodduct feel free to call anytime we 24X7
            vaialible
          </p>
          <p className="mt-3">
            <BiMailSend /> : www.help@ecommerceapp.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 012-3456789
          </p>
          <p className="mt-3">
            <BiSupport /> : 1800-0000-0000 (toll free)
          </p>
        </div>


     </div>
      </Layout>
      </div>
  )
}

export default Contact