const express=require('express');
const User=require('../models/user');
const router=new express.Router();
const Authmiddleware=require('../middleware/auth');
const RegistrationUtil=require('../helpers/Registration-helper');
const Vonage = require('@vonage/server-sdk');
const nodemailer=require('nodemailer');
const axios = require('axios').default;
const path=require('path');

require('dotenv').config({path:path.resolve(__dirname, '../../.env') });

//Setting up functionality for message-based authentication
const vonage = new Vonage({
      apiKey: process.env.VKEY,
      apiSecret: process.env.SECRET
});

//Setting up functionality for email-based authentication
const transporter=nodemailer.createTransport({
      service: process.env.SECRET,
      auth:{
            user:process.env.TEST_MAIL,
            pass:process.env.TEST_PASS
      }
});

//Route-1:Temporary creation of a user in the database(T completed)
router.post('/user/signup1',async (req,res)=>{
      console.log(req.body);
      const user=new User(req.body);
      try{
            await user.save();
            user.Status=false;
            const ProvidedAddress=user.NearestLandmark+' '+user.City+' '+user.Pincode+' '+user.State+' '+user.Country;
            const response=await axios.get('https://geocode.search.hereapi.com/v1/geocode?q='+ProvidedAddress+'&apiKey='+process.env.API_KEY);
            const token=await user.generateauthtoken();
            const coordinates=Object.values(response.data.items[0].position);
            await user.PositionCoordinates.push(coordinates[0]);
            await user.PositionCoordinates.push(coordinates[1]);
            await user.save();
            res.status(201).send({user,token});
      }catch(err){
            const UserinQuestion=await User.findOne({Email:req.body.Email});
            if (UserinQuestion==undefined){
                  res.status(400).send("Email is invalid");
            }
            else if (UserinQuestion.PositionCoordinates.length==0){
                  await User.deleteOne({Email:req.body.Email});
                  res.status(400).send("Invalid Address");
            }
            else{
                  res.status(400).send("User is already registered");
            }
      }
});

//Route-2:Permanent creation of a user in the database if OTP verification succeeds.(T completed)
router.post('/user/signup2',Authmiddleware,async (req,res)=>{
      try{
            const user=await User.findOne({Email:req.body.userInfo.data.user.Email}) 
            if (user==undefined){
                  res.status(404).send();
            }
            else{
                  if (RegistrationUtil.Verificationutil(user,req)==true){
                        const token=await user.generateauthtoken();
                        user.Status=true;
                        await user.RecentEmailOtps.pop();
                        await user.RecentMobileOtps.pop();
                        await user.save();
                        res.status(200).send({user,token});
                  }
                  else{
                        res.status(404).send(user);
                  }
            }
      }catch{
            res.status(400).send('Some error occured');
      }
});

//Route-3:Login setup for a user(T completed)
router.post('/user/login',async (req,res)=>{
      try{
            const user=await User.findbycredentials(req.body.email,req.body.password);
            const token=await user.generateauthtoken();
            res.status(200).send({user,token});
      }catch(err){
            console.log(err);
            res.status(404).send("User not registered");
      }
});

//Route-4:Sending OTP
router.post('/user/newotps',Authmiddleware,async (req,res)=>{
      try{
            const UserEmail=req.body.userInfo.data.user.Email;
            const user=await User.findOne({Email:UserEmail});
            if (user!==undefined && user.Status==false){
                  const otp1=RegistrationUtil.GetOtp();
                  const otp2=RegistrationUtil.GetOtp();
                  const emailbody=RegistrationUtil.EmailBody(user.Email,otp1);
                  const messagebody=RegistrationUtil.MessageBody(otp2);
                  // let emailinfo=await transporter.sendMail(emailbody);
                  // let messageinfo=await vonage.message.sendSms('Team',"91"+user.PhoneNumber,messagebody);
                  await user.RecentEmailOtps.push(otp1);
                  await user.RecentMobileOtps.push(otp2);
                  await user.save();
                  res.status(200).send();
            }
            else if (user===undefined){
                  res.status(404).send("You are not registered!");
            }
            else{
                  res.status(400).send("User is already verified");
            }
      }catch{
            res.status(404).send();
      }
});