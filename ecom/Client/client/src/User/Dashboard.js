import React from 'react';
import Layout from '../Layout/Layout';
import UserMenu from '../Layout/UserMenus';
import { useAuth } from '../Context/auth';

const Dashboard = () => {
  const { auth } = useAuth();
  return (
    <Layout title="Dashboard - Ecommerce App my-5">
      <div className='container-fluid my-5'>
        <div className='row'>
          <div className='col-3'>
            <UserMenu />
          </div>
          <div className='col-9 my-5'>
            <div className='card'>
              <h3>{auth?.user?.name}</h3>
              <h3>{auth?.user?.email}</h3>
              <h3>{auth?.user?.phone}</h3>
              <h3>{auth?.user?.Address}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
