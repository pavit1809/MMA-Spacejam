const mongoose=require('mongoose');

const appointmentSchema=mongoose.Schema({
      user_id:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
      },
      center_id:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Center'
      },
      dateofappointment:{
            type:String,
            required:true
      },
      amount:{
            type:Number,
            required:true
      },
      facilityused:{
            type:String,
            required:true
      },
      Slotdetails:{
            type:String,
            required:true
      },
      ResultStatus:{
            type:Boolean,
            default:false
      },
      Attended:{
            type:Boolean,
            default:false
      }
});

const Appointment=mongoose.model('Appointment',appointmentSchema);

module.exports=Appointment;