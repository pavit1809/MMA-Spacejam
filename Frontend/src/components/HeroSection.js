import React from 'react';
import '../App.css';
import { Button1 } from './Button';
import { Link } from 'react-router-dom';
import './HeroSection.css';
import HourglassFull from '@material-ui/icons/HourglassFull';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DoneAllIcon from '@material-ui/icons/DoneAll';
function HeroSection() {
  return (
    <div className='hero-container'>
      <img src='/images/homech1.jpg' className="home-img" style={{filter: 'grayscale(0.5) brightness(0.8) '}}/>
      <h2>Test Appointments made easy!</h2>
      <div style={{marginLeft:'-50vw',color:"#fcf5dd",fontSize:'5vh' , textAlign:'center'}}>
      <FileCopyIcon /><br/>Fast and Reliable</div>
      <div style={{marginLeft:'0vw',marginTop:'-15vh',color:"#fcf5dd",fontSize:'5vh' , textAlign:'center'}}><HourglassFull /> <br/>Flexible</div>
      <div style={{marginLeft:'50vw',marginTop:'-15vh',color:"#fcf5dd",fontSize:'5vh' , textAlign:'center'}}><DoneAllIcon /> <br/>Easy to Use
</div>
    </div>
  );
}

export default HeroSection;