import React from 'react'
import Layout from '../Layout/Layout'
import { Link } from 'react-router-dom'

function Pagenotfound() {
  return (
    <div>
        <Layout>
        <div className="pnf">
        <h1 className="pnf-title">404</h1>
        <h2 className="pnf-heading">Oops ! Page Not Found</h2>
        <Link to="/" className="pnf-btn">
          Go Back
        </Link>
      </div>
        </Layout>
        </div>
  )
}

export default Pagenotfound