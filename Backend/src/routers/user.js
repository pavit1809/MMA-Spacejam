const express=require('express');
const User=require('../models/user');
const router=new express.Router();
const Center=require('../models/center');
const Facility=require('../models/facilities');
const Appointment=require('../models/appointment');
const Authmiddleware=require('../middleware/auth');
const RegistrationUtil=require('../helpers/Registration-helper');

const Apphelper=require('../helpers/Appointment-helper');
const MainHelper=require('../helpers/all-utility');
const Vonage = require('@vonage/server-sdk');
const nodemailer=require('nodemailer');
const axios = require('axios').default;
const path=require('path');
const bcrypt=require('bcryptjs');

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

// Route-6:Sending all available slots to the user
router.post('/user/allslots',Authmiddleware,async (req,res)=>{
      // console.log(req.body);
      try{
            const own=req.body.flag1.cen._id;
            const fac=req.body.flag1.service;
            const date=req.body.flag1.askeddate;
            const facility=await Facility.findOne({owner:own,FacilityName:fac});
            let ret=MainHelper.getallopenslots(facility,date);
            const allappointments=await Appointment.find({userid:req.user._id,Attended:false});
            let fineapp=Apphelper.arrange(allappointments);
            if (ret.length!=0){
                  const finalretvalue={
                        allslots:ret,
                        center:req.body.flag1.cen,
                        service:fac,
                        dis:req.body.flag1.dis,
                        costing:req.body.flag1.costing,
                        concerneddate:req.body.flag1.askeddate,
                        fine:fineapp.length*100
                  }
                  // console.log(finalretvalue);
                  res.status(200).send(finalretvalue);
            }
            else{
                  res.status(404).send("No empty slot found for the date");
            }
      }catch(err){
            console.log(err);
            res.status(404).send("No Open Slots found!");
      }
})

//Route-7:Creating a new appointment
router.post('/user/newappointment',Authmiddleware,async(req,res)=>{
      try{
            const queryobj=req.body.CentreValue;
            const existing=await Appointment.findOne({user_id:req.body.userInfo.data.user._id,dateofappointment:queryobj.askeddate,Slotdetails:req.body.selectedTime[0]});
            if (existing==null){
                  const newappointment=new Appointment(MainHelper.getformatappointment(req));
                  let facility=await Facility.findOne({Price:queryobj.costing,FacilityName:queryobj.service,owner:queryobj.cen._id});
                  facility=MainHelper.modifyslotdata(facility,queryobj,req);
                  await facility.save();
                  newappointment.save();
                  res.status(200).send(newappointment);
            }
            else{
                  res.status(400).send("Same Booking already exists!");
            }
      }catch(err){
            console.log(err);
            res.status(400).send(err);
      }
});

//Route-8:Sending all appointments
router.post('/user/allappointments',Authmiddleware,async(req,res)=>{
      try{
            // console.log(req.body);
            const userinquestion=await User.find({_id:req.body.userInfo.data.user._id});
            const allappointments=await Appointment.find({user_id:req.body.userInfo.data.user._id});
            //it can be an array of objects
            let ret=[];       
            if (allappointments.length==0){
                  res.status(404).send();
            }
            else{
                  for(let i=0;i<allappointments.length;i++){
                        const concernedcenter=await Center.findOne({_id:allappointments[i].center_id});
                        ret.push(MainHelper.getformatshowappointment(concernedcenter,allappointments[i]));
                  }
                  res.status(200).send(ret);
            }
      }catch(err){
            console.log(err);
            res.status(400).send(err);
      }
});

//Route-9:Sending all available facilities
router.post('/user/getallfacilities',Authmiddleware,async(req,res)=>{
      try{
            let s=new Set();
            const alldata=await Facility.find({});
            for(let i=0;i<alldata.length;i++)
            {
                  // console.log(alldata[i].owner);
                  const asscen=await Center.findOne({_id:alldata[i].owner,Status:true});
                  if (asscen!=undefined)
                  {
                        s.add(alldata[i].FacilityName);
                  }
            }
            const ret=Array.from(s);
            res.status(200).send(ret);
      }catch(err){
            res.status(404).send();
      }
})

//Route-10:Sending update otps
router.post('/user/sendotp',Authmiddleware,async(req,res)=>{
      // console.log(req.body);
      try{
            const user=await User.findOne({_id:req.body.id});
            const otp=RegistrationUtil.GetOtp();
            if (parseInt(req.body.flag)==0){     
                  const emailbody=RegistrationUtil.EmailBody(req.body.value,otp);
                  // let emailinfo=await transporter.sendMail(emailbody);
                  user.RecentEmailOtps.push(otp);
                  await user.save();
                  res.status(200).send("Otp sent successfully");
            }
            else{
                  const messagebody=RegistrationUtil.MessageBody(otp);
                  // let messageinfo=await vonage.message.sendSms('Team',"91"+user.PhoneNumber,messagebody);
                  user.RecentMobileOtps.push(otp);
                  await user.save();
                  res.status(200).send("Otp sent successfully");
            }
      }catch(err){
            console.log(err);
            res.send(400).send(err);
      }
})

//Route-11:Verifying update otps
router.post('/user/verifyotponupd',Authmiddleware,async (req,res)=>{
      try{
            const user=await User.findOne({_id:req.body.id});
            if (parseInt(req.body.flag)==0){
                  if (user.RecentEmailOtps[user.RecentEmailOtps.length-1]==req.body.otp){
                        res.status(200).send('Verified');
                  }
                  else{
                        res.status(400).send('Invalid Otp');
                  }
            }
            else{
                  if (user.RecentMobileOtps[user.RecentMobileOtps.length-1]==req.body.otp){
                        res.status(200).send('Verified');
                  }
                  else{
                        res.status(400).send('Invalid Otp');
                  }
            }
      }catch(err){
            console.log(err);
            res.status(400).send(err);
      }
})

//Route-12:Update user finally
router.post('/user/update',Authmiddleware,async (req,res)=>{
      try{
            const reqobj=req.body.data;
            let curruser=await User.findOne({_id:reqobj.id});
            const ismatch=await bcrypt.compare(reqobj.Validitypassword,curruser.Password);
            if (ismatch){
                  curruser=await MainHelper.assignuserchanges(curruser,reqobj);
                  // console.log(curruser);
                  const ProvidedAddress=curruser.NearestLandmark+' '+curruser.City+' '+curruser.Pincode+' '+curruser.State+' '+curruser.Country;
                  // console.log(ProvidedAddress);
                  const response=await axios.get('https://geocode.search.hereapi.com/v1/geocode?q='+ProvidedAddress+'&apiKey=tbeKC9DJdnRIZ1p5x496OgpIUj2vbL5CWADs8czW5Rk');
                  // console.log(response.data);
                  const coordinates=Object.values(response.data.items[0].position);
                  curruser.PositionCoordinates.length=0;
                  curruser.PositionCoordinates[0]=(coordinates[0]);
                  curruser.PositionCoordinates[1]=(coordinates[1]);
                  await curruser.save();
                  // console.log(curruser);
                  const token=req.token;
                  res.status(200).send({user:curruser,token});
            }
            else{
                  res.status(400).send("Password Mismatch")
            }
      }catch(err){
            //Mostly due to invalid address
            console.log(err);
            res.status(400).send(err);
      }
})

//Route-13:Logging a user out
router.post('/user/logout',Authmiddleware,async (req,res)=>{
      try{
            // console.log(req.user);
            req.user.tokens=[];
            req.user.RecentEmailOtps=[];
            req.user.RecentMobileOtps=[];
            await req.user.save();
            res.status(200).send();
      }catch(err){
            console.log(err);
            res.status(400).send(err);
      }
})

module.exports=router;