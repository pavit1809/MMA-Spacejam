const bcrypt=require('bcryptjs');


const modifyslotdata=(facility,queryobj,req)=>{
      for(let i=0;i<facility.SlotAvailability.length;i++)
      {
            const o1=facility.SlotAvailability[i];
            if (o1.date==queryobj.askeddate)
            {
                  for(let j=0;j<o1.slotinfo.length;j++)
                  {
                        const o2=o1.slotinfo;
                        if (o2[j].det1==req.body.selectedTime[0])
                        {
                              facility.SlotAvailability[i].slotinfo[j].det2--;
                        }
                  }
            }
      }
      return facility;
};

const getformatappointment=(req)=>{
      const queryobj=req.body.CentreValue;
      const ret={
            user_id:req.body.userInfo.data.user._id,
            center_id:queryobj.cen._id,
            dateofappointment:queryobj.askeddate,
            amount:queryobj.costing,
            facilityused:queryobj.service,
            Slotdetails:req.body.selectedTime[0]
      }
      return ret;
}

const getformatshowappointment=(center,app)=>{
      const obj1={
            CenterName:center.Name,
            TestName:app.facilityused,
            TestDate:app.dateofappointment,
            AmountPaid:app.amount,
            //add handler for missed tests also so as to calculate penalty
            Status:((new Date(app.dateofappointment).getTime())<=(new Date().getTime())?"Completed":"Upcoming"),
            Result:((app.ResultStatus==true)?"Ready":"In Process"),
            TimeSlot:app.Slotdetails,
            ContactDet:center.PhoneNo,
            Cenid:center._id
      }
      return obj1;
}

const getallopenslots=(facility,date)=>{
      let ret=[];
      for(let i=0;i<facility.SlotAvailability.length;i++)
      {
            const currobj=facility.SlotAvailability[i];
            const date1=new Date(date);
            const date2=new Date(currobj.date);
            if ((date1.getMonth()==date2.getMonth()) && (date1.getDate()==date2.getDate()) && (date1.getFullYear()==date2.getFullYear()))
            {
                  for(let j=0;j<currobj.slotinfo.length;j++)
                  {
                        const c2=currobj.slotinfo[j];
                        if (c2.det2>0)
                        {
                              const flagobj={
                                    timeslot:c2.det1,
                                    capacity:c2.det2
                              }
                              ret.push(flagobj);
                        }
                  }
            }      
      }
      return ret;
};

const assignuserchanges=async (original,upd)=>{
      original.IdType=upd.IdType;
      original.IdentificationIdNumber=upd.IdentificationIdNumber;
      original.Email=upd.Email;
      original.NearestLandmark=upd.NearestLandmark;
      original.City=upd.City;
      original.Pincode=upd.Pincode;
      original.State=upd.State;
      original.Country=upd.Country;
      original.PhoneNumber=upd.PhoneNumber;
      if (upd.Password!='')
      {
            original.Password=upd.Password;
      }
      // console.log(original);
      return original;
};

module.exports={modifyslotdata,getformatappointment,getformatshowappointment,getallopenslots,assignuserchanges};