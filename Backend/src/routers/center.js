const express=require('express');
const Center=require('../models/center');
const User=require('../models/user');
const Facility=require('../models/facilities');
const Appointment=require('../models/appointment');
const router=new express.Router();
const RegistrationUtil=require('../helpers/center-registration-helper');
const RegistrationUtil1=require('../helpers/Registration-helper');
const AppointmentHelper=require('../helpers/Appointment-helper');
const MainHelper=require('../helpers/all-utility');
const Vonage = require('@vonage/server-sdk');
const nodemailer=require('nodemailer');
const axios = require('axios').default;
const bcrypt=require('bcryptjs');
const Authmiddleware=require('../middleware/auth1');
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

//Route-1: Saving a center :Part-1
router.post('/center/signup1',async (req,res)=>{
      let center=new Center(req.body);
      center.OpeningTime=RegistrationUtil.formattimestring(req.body.OpeningTime);
      center.ClosingTime=RegistrationUtil.formattimestring(req.body.ClosingTime);
      try{
            center.FrontImage='https://drive.google.com/thumbnail?id='+(center.FrontImage.slice(32,center.FrontImage.length-17));
            const hs=req.body.OpeningTime[0]+req.body.OpeningTime[1];
            const ms=req.body.OpeningTime[3]+req.body.OpeningTime[4];
            const he=req.body.ClosingTime[0]+req.body.ClosingTime[1];
            const me=req.body.ClosingTime[3]+req.body.ClosingTime[4];
            if ((he>hs) || (he==hs && me>ms) || (he==0))
            {
                  await center.save();
                  center.Status=false;
                  const ProvidedAddress=center.NearestLandmark+' '+center.City+' '+center.Pincode+' '+center.State+' '+center.Country;
                  const response=await axios.get('https://geocode.search.hereapi.com/v1/geocode?q='+ProvidedAddress+'&apiKey='+process.env.API_KEY);
                  const coordinates=Object.values(response.data.items[0].position);
                  await center.PositionCoordinates.push(coordinates[0]);
                  await center.PositionCoordinates.push(coordinates[1]);
                  const token=await center.generateauthtoken();
                  await center.save();
                  const offd=Object.entries(req.body.offdays);
                  let Offdays=[];
                  for(let i=0;i<7;i++)
                  {     
                        if (offd[i][1]==true){
                              Offdays.push(offd[i][0]);
                        }
                  }
                  let s=new Set();
                  for(let i=0;i<req.body.facilities.length;i++){
                        s.add(req.body.facilities[i]);
                  }
                  let allprovidedfacilities=Array.from(s);
                  console.log(allprovidedfacilities.length);
                  for(let i=0;i<allprovidedfacilities.length;i++)
                  {
                        const element=allprovidedfacilities[i];
                        const newFac=new Facility({
                              FacilityName:element.FacilityName,
                              CapacityperSlot:element.CapacityperSlot,
                              Price:element.Price,
                              Offdays:Offdays,
                              owner:center._id
                        });
                        center.Alloptions.push(element.FacilityName);
                        await center.save();
                        const currdate=RegistrationUtil.formatdate(new Date());
                        newFac.SlotAvailability=RegistrationUtil.listofnextsevendays(Offdays,currdate,element.CapacityperSlot,center.OpeningTime,center.ClosingTime);
                        await newFac.save();
                  }
                  res.status(201).send({center,token});      
            }
            else{
                  res.status(400).send('TIME ERROR');
            }
      }catch(err){
            const CenterinQuestion=await Center.findOne({Email:req.body.Email});
            console.log(err);
            if (CenterinQuestion==undefined){
                  res.status(400).send("Email is invalid");
            }
            else if (CenterinQuestion.PositionCoordinates.length==0){
                  await Center.deleteOne({Email:req.body.Email});
                  res.status(400).send("User is already registered");
            }
            else if(CenterinQuestion!=undefined){
                  await Center.deleteOne({Email:req.body.Email});
                  res.status(400).send("Invalid Address");
            }
      }
})

//Route-2
router.post('/center/signup2',Authmiddleware,async (req,res)=>{
      try{
           const center=await Center.findOne({Email:req.body.centerInfo.data.center.Email}) 
            if (center==undefined){
                  res.status(404).send();
            }
            else{
                  if (RegistrationUtil1.Verificationutil(center,req)==true){
                        const token=await center.generateauthtoken();
                        center.Status=true;
                        await center.RecentEmailOtps.pop();
                        await center.RecentMobileOtps.pop();
                        await center.save();
                        res.status(200).send({center,token});
                  }
                  else{
                        res.status(404).send(center);
                  }
            }
      }catch(err){
            console.log(err);
            res.status(400).send('Some error occured');
      }
});

//Route-3
router.post('/center/newotps',Authmiddleware,async (req,res)=>{
      try{
            const CenterEmail=req.body.centerInfo.data.center.Email;
            const center=await Center.findOne({Email:CenterEmail});
            if (center!==undefined && center.Status==false)
            {
                  const otp1=RegistrationUtil1.GetOtp();
                  const otp2=RegistrationUtil1.GetOtp();
                  const emailbody=RegistrationUtil1.EmailBody(center.Email,otp1);
                  const messagebody=RegistrationUtil1.MessageBody(otp2);
                  let emailinfo=await transporter.sendMail(emailbody);
                  let messageinfo=await vonage.message.sendSms('Team',"91"+center.PhoneNumber,messagebody);
                  center.RecentEmailOtps.push(otp1);
                  center.RecentMobileOtps.push(otp2);
                  await center.save();
                  res.status(200).send();
            }
      }catch(err){
            console.log(err);
            res.status(400).send();
      }
})

//Route-4
router.post('/review/new',async (req,res)=>{
      try{
            console.log(req.body);
            const center=await Center.findOne({_id:req.body._id});
            center.Reviews.push({
                  text:req.body.review,
                  stars:req.body.rating
            });
            await center.save();
            res.status(200).send();
      }catch(err){
            console.log(err);
            res.status(400).send();
      }
})

//Route-5
router.post('/center/login',async (req,res)=>{
      try{
            const center=await Center.findbycredentials(req.body.email,req.body.password);
            if (center.Status==false){
                  res.status(400).send();
            }
            else{
                  const token=await center.generateauthtoken();
                  res.status(200).send({center,token});
            }
      }catch(err){
            console.log(err);
            res.status(404).send("Center not registered");
      }
});

//Route-6
router.post('/center/prevapp',Authmiddleware,async(req,res)=>{
      try{
            const appointments=await Appointment.find({center_id:req.body.centerInfo.data.center._id,Attended:true});
            const filtered=AppointmentHelper.arrange(appointments);
            let ret=[];
            for(let i=0;i<filtered.length;i++){
                  const currentuser=await User.findOne({_id:filtered[i].user_id});
                  ret.push({
                        Name:currentuser.UserName,
                        Test:filtered[i].facilityused,
                        Date:filtered[i].dateofappointment,
                        Slot:filtered[i].Slotdetails,
                        PhoneNo:currentuser.PhoneNumber,
                        Email:currentuser.Email,
                        appid:filtered[i]._id,
                        userid:currentuser._id,
                        flag:((filtered[i].ResultStatus==false)?1:0)
                  });
            }
            // console.log(ret);
            res.status(200).send(ret);
      }catch(err){
            console.log(err);
            res.status(400).send(err);
      }
})

//Route-7
router.post('/center/prevapp',Authmiddleware,async(req,res)=>{
      try{
            const appointments=await Appointment.find({center_id:req.body.centerInfo.data.center._id,Attended:true});
            const filtered=AppointmentHelper.arrange(appointments);
            let ret=[];
            for(let i=0;i<filtered.length;i++){
                  const currentuser=await User.findOne({_id:filtered[i].user_id});
                  ret.push({
                        Name:currentuser.UserName,
                        Test:filtered[i].facilityused,
                        Date:filtered[i].dateofappointment,
                        Slot:filtered[i].Slotdetails,
                        PhoneNo:currentuser.PhoneNumber,
                        Email:currentuser.Email,
                        appid:filtered[i]._id,
                        userid:currentuser._id,
                        flag:((filtered[i].ResultStatus==false)?1:0)
                  });
            }
            // console.log(ret);
            res.status(200).send(ret);
      }catch(err){
            console.log(err);
            res.status(400).send(err);
      }
})

//Route-8
router.post('/center/presapp',Authmiddleware,async(req,res)=>{
      try{
            const appointments=await Appointment.find({center_id:req.body.centerInfo.data.center._id});
            // console.log(appointments);
            const filtered=AppointmentHelper.arrange1(appointments);
            // console.log(filtered);
            let ret=[];
            for(let i=0;i<filtered.length;i++){
                  const currentuser=await User.findOne({_id:filtered[i].user_id});
                  ret.push({
                        Name:currentuser.UserName,
                        Test:filtered[i].facilityused,
                        Date:filtered[i].dateofappointment,
                        Slot:filtered[i].Slotdetails,
                        PhoneNo:currentuser.PhoneNumber,
                        Email:currentuser.Email,
                        userid:currentuser._id,
                        appid:filtered[i]._id,
                        flag:((filtered[i].Attended==false)?1:0)
                  });
            }
            // console.log(ret);
            res.status(200).send(ret);
      }catch(err){
            console.log(err);
            res.status(400).send(err);
      }
})

//Route-9
router.post('/center/futapp',Authmiddleware,async (req,res)=>{
      try{  
            const appointments=await Appointment.find({center_id:req.body.centerInfo.data.center._id});
            const filtered=AppointmentHelper.arrange2(appointments);
            let ret=[];
            for(let i=0;i<filtered.length;i++){
                  const currentuser=await User.findOne({_id:filtered[i].user_id});
                  ret.push({
                        Name:currentuser.UserName,
                        Test:filtered[i].facilityused,
                        date:filtered[i].dateofappointment,
                        Slot:filtered[i].Slotdetails,
                        PhoneNo:currentuser.PhoneNumber,
                        Email:currentuser.Email,
                        appid:filtered[i]._id,
                  });
            }
            // console.log(ret);
            res.status(200).send(ret);
      }catch(err){
            console.log(err);
            res.status(400).send(err);
      }
})

//Route-10
router.post('/center/sendcancelmail',Authmiddleware,async (req,res)=>{
      try{
            const mailbody=AppointmentHelper.EmailBody(req.body.appInfo.Email,req.body.appInfo.Name,req.body.reason,req.body.centerInfo.data.center.Name,req.body.appInfo.Slot,req.body.appInfo.date,req.body.appInfo.Test);
            let emailinfo=await transporter.sendMail(mailbody);
            await Appointment.deleteOne({_id:req.body.appInfo.appid});
            res.status(200).send();
      }catch(err){
            console.log(err);
            res.status(400).send('Some error occured,Please try again later!');
      }
})

//Route-11
router.post('/center/userverify',Authmiddleware,async (req,res)=>{
      try{
            const user=await User.findOne({_id:req.body.userid});
            // console.log(user.RecentMobileOtps[user.RecentMobileOtps.length-1]);
            // console.log(req.body.otp);
            if (user.RecentMobileOtps[user.RecentMobileOtps.length-1]==req.body.otp && user.IdentificationIdNumber==req.body.idnum){
                  await user.RecentMobileOtps.pop();
                  const appoint=await Appointment.findOne({_id:req.body.appid});
                  appoint.Attended=true;
                  await user.save();
                  await appoint.save();
                  res.status(200).send();
            }
            else{
                  res.status(400).send("Data is invalid");
            }
      }catch(err){
            console.log(err);
            res.status(400).send("Data is invalid");
      }
})

//Route-12
router.post('/center/logout',Authmiddleware,async (req,res)=>{
      try{
            req.center.tokens=[];
            req.center.RecentEmailOtps=[];
            req.center.RecentMobileOtps=[];
            await req.center.save();
            res.status(200).send();
      }catch(err){
            console.log(err);
            res.status(400).send(err);
      }
})

//Route-13
router.post('/center/sendotp',Authmiddleware,async(req,res)=>{
      // console.log(req.body);
      try{
            const center=await Center.findOne({_id:req.body.id});
            const otp=RegistrationUtil1.GetOtp();
            if (parseInt(req.body.flag)==0){     
                  const emailbody=RegistrationUtil1.EmailBody(req.body.value,otp);
                  let emailinfo=await transporter.sendMail(emailbody);
                  center.RecentEmailOtps.push(otp);
                  await center.save();
                  res.status(200).send("Otp sent successfully");
            }
            else{
                  const messagebody=RegistrationUtil.MessageBody(otp);
                  let messageinfo=await vonage.message.sendSms('Team',"91"+user.PhoneNumber,messagebody);
                  center.RecentMobileOtps.push(otp);
                  await center.save();
                  res.status(200).send("Otp sent successfully");
            }
      }catch(err){
            console.log(err);
            res.send(400).send(err);
      }
})

//Route-14
router.post('/center/verifyotponupd',Authmiddleware,async (req,res)=>{
      try{
            const center=await Center.findOne({_id:req.body.id});
            if (parseInt(req.body.flag)==0){
                  if (center.RecentEmailOtps[center.RecentEmailOtps.length-1]==req.body.otp){
                        res.status(200).send('Verified');
                  }
                  else{
                        res.status(400).send('Invalid Otp');
                  }
            }
            else{
                  if (center.RecentMobileOtps[center.RecentMobileOtps.length-1]==req.body.otp){
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

//Route-15
router.post('/center/profile',Authmiddleware,async(req,res)=>{
      try{
            const facilities=await Facility.find({owner:req.center._id});
            // console.log
            res.status(200).send(facilities);
      }catch(err){
            //Mostly due to invalid address
            console.log(err);
            res.status(400).send(err);
      }
})

router.post('/center/sendres',Authmiddleware,async(req,res)=>{
      try{
            const appointment=await Appointment.findOneAndUpdate({_id:req.body.appInfo.appid},{ResultStatus:true});
            res.status(200).send();
      }catch(err){
            console.log(err);
            res.status(400).send();
      }
})

router.post('/center/update',Authmiddleware,async (req,res)=>{
      console.log(req.body);
      res.status(200).send();
})

router.post('/center/reviewdet',Authmiddleware,async (req,res)=>{
      try{
            const center=await Center.findOne({_id:req.body.centerInfo.data.center._id});
            if (center.Reviews.length==0){
                  const reviews={
                        arr:[{
                              text:"Good boi",
                              stars:5
                        }],
                        posper:70,
                        negper:30,
                        comment:"Everything looks not good as of now",
                        avgstars:5,
                        flag:1
                  };
                  res.status(200).send(reviews);
            }
            else{
                  let sum=0;
                  let posp=0,negp=0;
                  for(let i=0;i<center.Reviews.length;i++){
                        const data1={
                              review:center.Reviews[i].text
                        };
                        sum+=center.Reviews[i].stars;
                        const response=await axios.post('http://f7c9e5c63ef0.ngrok.io',data1);
                        if (response.data=='negative'){
                              negp+=1;
                        }else{
                              posp+=1;
                        }
                  }
                  let comm="hello",flag=1;
                  if (negp>=posp || parseInt(sum/center.Reviews.length)<=3){
                        comm='Some Serious Steps are immediately needed',
                        flag=1;
                  }else{
                        comm='Things are going fine'
                  }
                  const reviews={
                        arr:center.Reviews,
                        posper:parseFloat((posp/(posp+negp))*100),
                        negper:parseFloat((negp/(posp+negp))*100),
                        comment:comm,
                        avgstars:parseFloat(sum/center.Reviews.length)
                  }
                  res.status(200).send(reviews);      
            }
      }catch{

      }
})

router.post('/center/update',Authmiddleware,async (req,res)=>{
      try{
            const reqobj=req.body.data;
            let currcenter=await Center.findOne({_id:reqobj.id});
            const ismatch=await bcrypt.compare(reqobj.Validitypassword,currcenter.Password);
            if (ismatch){
                  currcenter=await MainHelper.assignuserchanges1(currcenter,reqobj);
                  // console.log(currcenter);
                  const ProvidedAddress=currcenter.NearestLandmark+' '+currcenter.City+' '+currcenter.Pincode+' '+currcenter.State+' '+currcenter.Country;
                  // console.log(ProvidedAddress);
                  // const response=await axios.get('https://geocode.search.hereapi.com/v1/geocode?q='+ProvidedAddress+'&apiKey=tbeKC9DJdnRIZ1p5x496OgpIUj2vbL5CWADs8czW5Rk');
                  // // console.log(response.data);
                  // const coordinates=Object.values(response.data.items[0].position);
                  // currcenter.PositionCoordinates.length=0;
                  // currcenter.PositionCoordinates[0]=(coordinates[0]);
                  // currcenter.PositionCoordinates[1]=(coordinates[1]);
                  await currcenter.save();
                  // console.log(currcenter);
                  const token=req.token;
                  const f1=await Facility.findOne({owner:reqobj.id});
                  for(let i=0;i<reqobj.facilities.length;i++){
                        const f=await Facility.findOne({owner:reqobj.id,FacilityName:reqobj.facilities[i].FacilityName});

                        if (f==undefined){
                              const newFac=new Facility({
                                    FacilityName:reqobj.facilities[i].FacilityName,
                                    CapacityperSlot:reqobj.facilities[i].CapacityperSlot,
                                    Price:reqobj.facilities[i].Price,
                                    Offdays:f1.Offdays,
                                    owner:reqobj._id
                              });
                              currcenter.Alloptions.push(reqobj.facilities[i].FacilityName);
                              await currcenter.save();
                              const currdate=RegistrationUtil.formatdate(new Date());
                              newFac.SlotAvailability=RegistrationUtil.listofnextsevendays(f1.Offdays,currdate,reqobj.facilities[i].CapacityperSlot,currcenter.OpeningTime,currcenter.ClosingTime);
                              console.log(newFac);
                              await newFac.save(); 
                        }
                  }
                  res.status(200).send({user:currcenter,token});
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

module.exports=router;