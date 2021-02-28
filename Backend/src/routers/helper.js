const express=require('express');
const router=new express.Router();
const Facility=require('../models/facilities');
const Center=require('../models/center');
const User=require('../models/user');
const Appointment=require('../models/appointment');
const Mainhelper=require('../helpers/all-utility');
const Authmiddleware=require('../middleware/auth');
const Authmiddleware1=require('../middleware/auth1');
const FacilityRegHelper=require('../helpers/center-registration-helper');


//Route-1: Adding facilities for a testing center
router.post('/facility/new',async (req,res)=>{
      try{
            let s=new Set();
            req.body.forEach(element => {
                  s.add(element);
            });
            let allprovidedfacilities=Array.from(s);
            console.log(allprovidedfacilities.length);
            for(let i=0;i<allprovidedfacilities.length;i++)
            {
                  const element=allprovidedfacilities[i];
                  const newFac=new Facility(element);
                  const AssociatedCenter=await Center.findOne({_id:element.owner});
                  AssociatedCenter.Alloptions.push(element.FacilityName);
                  await AssociatedCenter.save();
                  const currdate=FacilityRegHelper.formatdate(new Date());
                  newFac.SlotAvailability=FacilityRegHelper.listofnextsevendays(element.Offdays,currdate,element.CapacityperSlot,AssociatedCenter.OpeningTime,AssociatedCenter.ClosingTime);
                  await newFac.save();
            }
            res.status(201).send("Shayad ho gaya");
      }catch(err){
            res.status(400).send(err);
      }
})

router.post('/helper/check',Authmiddleware,async(req,res)=>{
      res.status(200).send();
});

router.post('/helper/check1',Authmiddleware1,async (req,res)=>{
      res.status(200).send();
})

module.exports=router;