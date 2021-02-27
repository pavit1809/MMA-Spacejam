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

// Route-5:Sending Matched center
router.post('/user/match',Authmiddleware,async (req,res)=>{
      // console.log(req.body);
      try{
            const requiredFacility=req.body.test;
            const requiredDate=req.body.date;
            const user=req.body.userInfo.data.user;
            if (user.Status==false){
                  res.status(403).send("User Not Verified");
            }
            else{
                  const step1=await Facility.find({FacilityName:requiredFacility});
                  let ids=[];
                  for(let i=0;i<step1.length;i++){
                        const element=step1[i];
                        // console.log(element);
                        const v1=element.SlotAvailability.find(e=> e.date==requiredDate);
                        // console.log(v1);
                        if (v1!=undefined){
                              let check=false;
                              for(let j=0;j<v1.slotinfo.length;j++){
                                    let k=v1.slotinfo[j];
                                    check=check | (k.det2>0);     
                              }
                              if (check!=false){
                                    const ob={
                                          own:element.owner,
                                          costing1:element.Price
                                    }
                                    ids.push(ob);
                              }
                        }
                  };
                  let ret=[];
                  for(let j=0;j<ids.length;j++)
                  {
                        let i=ids[j];
                        //handle unverified centres
                        const center=await Center.findOne({_id:i.own,Status:true});
                        const clientcoor=user.PositionCoordinates[0].toString()+','+user.PositionCoordinates[1].toString();
                        const centercoor=center.PositionCoordinates[0].toString()+','+center.PositionCoordinates[1].toString();
                        const url='https://router.hereapi.com/v8/routes?transportMode=car&origin='+clientcoor+'&destination='+centercoor+'&return=Summary&apiKey='+process.env.API_KEY;
                        const response=await axios.get(url);
                        let uallopts=new Set(center.Alloptions);
                        uallopts=Array.from(uallopts);
                        const retobj={
                              cen:center,
                              dis:response.data.routes[0].sections[0].summary.length/1000,
                              // dis:100,
                              costing:i.costing1,
                              service:requiredFacility,
                              askeddate:requiredDate,
                              tags:uallopts,
                        };
                        ret.push(retobj);
                  }
                  res.status(200).send(ret);
            }
      }catch(err){
            console.log(err);
            res.status(404).send("No centers found");
      }
}) 


module.exports=router;