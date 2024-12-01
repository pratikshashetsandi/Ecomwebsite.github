import React from 'react'
import AdminMenu from '../../Layout/AdminMenu'
import Layout from '../../Layout/Layout'

function Users() {
  return (
    <>
    <Layout>
      <div className='row'>
        <div className='col-3 '>
        <AdminMenu/>
        </div>
        <div className='col-3 '>
        <h1>All Users</h1>
        </div>
      </div>
      </Layout>
    </>
  )
}

export default Users