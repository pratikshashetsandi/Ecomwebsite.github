import React from 'react';
import Layout from '../Layout/Layout';
import'../Style/About.css'; 

const About = () => {
  return (
    <div className="about-container">
      <Layout>
        <div className="row about-us">
          <div className="col-md-6">
            <img
              src="https://img.freepik.com/free-vector/about-us-concept-illustration_114360-669.jpg"
              alt="About us"
            />
          </div>
          <div className="col-md-4">
            <p className="text-justify mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              officiis obcaecati esse tempore unde ratione, eveniet mollitia,
              perferendis eius temporibus dicta blanditiis doloremque explicabo
              quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
              accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
              commodi illum quidem neque tempora nam.
            </p>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default About;
