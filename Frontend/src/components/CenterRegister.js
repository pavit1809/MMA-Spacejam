import React from 'react';
import '../App.css';
import Navbar from './navbar';
import Footer from './Footer';
import CenterRegisterForm from './CenterRegisterForm';

function CenterRegister() {
  return (
    <>
      <Navbar />
      <CenterRegisterForm />
      <Footer />
    </> 
  );
}

export default CenterRegister;
