const express=require('express');
const cors=require('cors');
const cron=require('node-cron');
const path=require('path');
const Vonage = require('@vonage/server-sdk');
const updhelepr=require('./helpers/center-registration-helper');
const appointmentHelper=require('./helpers/Appointment-helper');
const otphelper=require('./helpers/Registration-helper');
const Facility=require('./models/facilities');
const Appointment=require('./models/appointment');
 
require('./db/mongoose');
require('dotenv').config({path:path.resolve(__dirname, '../.env') });

const userRouter=require('./routers/user');
const centerRouter=require('./routers/center');
const helperRouter=require('./routers/helper');
// const prescriptionRouter=require('./routers/prescription');
const User=require('./models/user');
const bodyParser=require('body-parser');

const app=express();
const port=process.env.PORT || 5000;

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(centerRouter);
app.use(helperRouter);

const vonage = new Vonage({
      apiKey: process.env.VKEY,
      apiSecret: process.env.SECRET
});

app.get('/',(req,res)=>{
      res.send("Hello,Atleast this is working1");
})

app.listen(port,()=>{
      console.log('Server is running on port:',port);
})

const task=cron.schedule('0 0 * * *',async ()=>{
      const AllFacilities=await Facility.find({});
      for(let i=0;i<AllFacilities.length;i++){
            let subject=AllFacilities[i].SlotAvailability;
            let nsa=[];
            for(let j=0;j<subject.length;j++){
                  const d1=subject[j].date;
                  if (appointmentHelper.comparedatecurr1(d1)==0){
                        nsa.push(subject[j]);
                  }
            }
            nsa=updhelepr.alteredlist(nsa,AllFacilities[i].Offdays);
            AllFacilities[i].SlotAvailability=nsa;
            await AllFacilities[i].save();
      }
},{
      scheduled:false,
      timezone:'Asia/Kolkata'
});

const task1=cron.schedule('0 1 * * *',async ()=>{
      const allaps=await Appointment.find({});
      for(let i=0;i<allaps.length;i++){
            if (new Date(allaps[i].dateofappointment).getFullYear()==new Date().getFullYear() && new Date(allaps[i].dateofappointment).getMonth()==new Date().getMonth() && new Date(allaps[i].dateofappointment).getDate()==new Date().getDate()){
                  const user=await User.findOne({id:allaps[i].user_id});
                  const otp=otphelper.GetOtp();
                  const messb=otphelper.MessageBody(otp);
                  // let messageinfo=await vonage.message.sendSms('Team',"91"+user.PhoneNumber,messb);    
            }
      }
},{
      scheduled:false,
      timezone:'Asia/Kolkata'
});
task.start();